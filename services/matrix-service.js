import * as sdk from 'matrix-js-sdk'
// import axios from 'axios'
import throttle from 'lodash/throttle'
import { v4 as uuidv4 } from 'uuid'
import Service from '@/services/service'
import LogsService from '@/services/logs-service'

const MATRIX_HOMESERVER = 'https://matrix.terrakrya.com'
const DEFAULT_PASSWORD = 'tCDMiELuphq5Dr'

class MatrixService extends Service {
  client = null
  activeRoom = null
  $log = LogsService
  activeRoomListener = null

  get storeUser() {
    return this.$auth.user
  }

  get clientPrepared() {
    return this.$store.state.clientPrepared
  }

  get isChatEnabled() {
    return this.storeUser.matrixId && this.storeUser.matrixAccessToken
  }

  get activeRoomId() {
    return this.$store.state.activeRoom
  }

  get roomList() {
    return this.client && this.client.getRooms()
  }
  // utils

  getReplyIdFromEvent = (event) => {
    const content = event.getContent()
    const replyEventId = content['m.relates_to']?.['m.in_reply_to']?.event_id
    return replyEventId
  }

  //
  async fetchHistory() {
    if (!this.client || !this.activeRoom) {
      return
    }
    const paginated = throttle(
      async () => {
        return await this.client.paginateEventTimeline(
          this.activeRoom.getLiveTimeline(),
          {
            backwards: true,
            limit: 50,
          }
        )
      },
      2000,
      { leading: true }
    )
    // const paginated = await this.client.scrollback(this.activeRoom, 30)
    // // TODO: which is better?
    // return paginated()
    return await paginated()
  }

  async setActiveRoomMessages(newEvent) {
    const timeline = this.activeRoom.getLiveTimeline()
    let events = timeline.getEvents()

    // const timelineSet = timeline.getTimelineSet()

    // timelineSet.unstableClientRelationAggregation = true
    // timelineSet.relations = {}
    if (events.length === 0) {
      await this.client.roomInitialSync(this.activeRoomId, 20)
      events = this.activeRoom.getLiveTimeline().getEvents()
    }
    const messageList = events.reduce((messages, event, index) => {
      let content = event.getContent()
      const type = event.getType()

      if (
        type !== 'm.room.message' ||
        !content.body ||
        event.isRelation('m.replace')
      ) {
        return messages
      }
      const isUpdate =
        newEvent?.isRelation('m.replace') &&
        newEvent.getRelation()?.event_id === event.getId()

      if (isUpdate) {
        content = newEvent.getContent()
      }
      const sender = event.getSender()
      const senderUser = this.client.getUser(sender)
      const author =
        this.storeUser.matrixId === sender ? 'Eu' : senderUser.displayName
      // const humanizedTimestamp = new Date(event.localTimestamp).toLocaleString(
      //   'pt-BR',
      //   {
      //     hour12: false,
      //     day: '2-digit',
      //     month: '2-digit',
      //     hour: '2-digit',
      //     minute: '2-digit',
      //   }
      // )
      const replyId = this.getReplyIdFromEvent(event)
      const replyEvent = this.activeRoom.findEventById(replyId)
      return [
        ...messages,
        {
          type: content.msgtype,
          sender: author,
          id: event.getId(),
          content:
            (replyEvent && content.body.replace(/>.*\n/, '')) ||
            content.formatted_body ||
            content.body,
          replyEvent,
          timestamp: event.localTimestamp,
          update: isUpdate,
          canEdit: this.storeUser.matrixId === sender,
        },
      ]
    }, [])

    this.$store.commit('setMessages', messageList)
  }

  async init(force = false) {
    if (!this.storeUser.matrixAccessToken) {
      if (force) {
        this.registerUser()
        this.$store.commit('setFirstMatrixUse', true)
      } else return false
    }

    if (!this.client) await this.createClient()
    if (!this.clientPrepared) await this.startClient()
    return true
  }

  async createClient({ matrixId, accessToken }) {
    if (!this.storeUser) {
      throw new Error('No user logged In')
    }
    const finalMatrixId = matrixId || this.storeUser.matrixId
    const finalAccessToken = accessToken || this.storeUser.matrixAccessToken

    if (!finalMatrixId || !finalAccessToken) {
      this.$log.info(this.$auth.user)
      return
    }

    let opts = {}
    try {
      const store = new sdk.IndexedDBStore({
        indexedDB: window.indexedDB,
        localStorage: window.localStorage,
        dbName: this.storeUser.matrixId + '-' + this.storeUser.id,
      })
      await store.startup()
      opts = { store }
    } catch (e) {
      // Change this to log
      this.$log.error('IndexDB error:', e)
    }

    try {
      this.client = await sdk.createClient({
        baseUrl: MATRIX_HOMESERVER,
        accessToken: this.storeUser.matrixAccessToken,
        userId: this.storeUser.matrixId,
        ...opts,
      })
    } catch (error) {
      this.$log.error(error)
      throw error
    }
  }

  async login({ userId, password, authenticatedAxios }) {
    let accessToken = this.storeUser.matrixAccessToken

    if (userId && password) {
      const tempClient = await sdk.createClient({
        baseUrl: MATRIX_HOMESERVER,
      })

      const loginResponse = await tempClient.loginWithPassword(userId, password)
      this.$log.info(loginResponse)

      accessToken = loginResponse?.access_token
    }

    if (accessToken) {
      // TODO: deduplicate this
      let opts = {}
      try {
        const store = new sdk.IndexedDBStore({
          indexedDB: window.indexedDB,
          localStorage: window.localStorage,
          dbName: this.storeUser.matrixId + '-' + this.storeUser.id,
        })
        await store.startup()
        opts = { store }
      } catch (e) {
        this.$log.error('IndexDB error:', e)
      }
      try {
        await this.createClient({
          matrixId: userId,
          accessToken,
          baseUrl: MATRIX_HOMESERVER,
          ...opts,
        })
        this.$store.commit('setFirstMatrixUse', true)

        await authenticatedAxios.put('/api/auth/me', {
          matrixId: userId,
          matrixAccessToken: accessToken,
        })
        await this.startClient()

        return true
      } catch (error) {
        this.$log.error(error)
        return false
      }
    } else {
      return false
    }
  }

  async startClient() {
    if (this.client) {
      await this.client.startClient({
        initialSyncLimit: 20,
      })
      await this.client.once('sync', (state, prevState, res) => {
        if (state === 'PREPARED') {
          this.$store.commit('setClientPrepared', true)
          this.$log.info(state)
          this.$log.info(this.$auth)
          this.client.setDisplayName(this.storeUser.name)
          if (this.storeUser.avatar) {
            this.client.setAvatarUrl(this.storeUser.avatarUrl)
          }
        } else {
          this.$log.info(state)
        }
      })
    }
  }

  setActiveRoom(roomId) {
    if (!roomId) {
      return
    }

    if (this.clientPrepared) {
      const room = this.client.getRoom(roomId)

      if (room) {
        this.setupActiveRoom(room)
      } else {
        return this.client
          .joinRoom(roomId)
          .then((joinedRoom) => {
            return this.setupActiveRoom(joinedRoom)
          })
          .catch((error) => {
            this.$log.error(error)
            return null
          })
      }
    } else {
      this.$log.warning(
        'Tried to setActiveRoom before client was ready... Trying again in 2 seconds'
      )
      setTimeout(() => {
        // TODO: implementar limite de tentativas
        this.setActiveRoom(roomId)
      }, 2000)
    }
  }

  setupActiveRoom(room) {
    this.stopListeningRoomEvents()
    if (!room) return
    this.$store.commit('setActiveRoom', room.roomId)

    this.activeRoom = room

    this.setActiveRoomMessages()
    this.startListeningRoomEvents()
  }

  roomTimelineEventHandler = (event, room) => {
    if (
      room?.roomId !== this.activeRoomId ||
      event.getType() !== ('m.room.message' || 'm.room.redaction')
    ) {
      return
    }
    this.setActiveRoomMessages(event)
  }

  startListeningRoomEvents() {
    this.client.on('Room.timeline', this.roomTimelineEventHandler)
    this.client.on(
      'Room.localEchoUpdated',
      (event, room, oldEventId, oldStatus) => {
        if (oldStatus === 'sending') {
          this.setActiveRoomMessages()
        }
      }
    )
  }

  stopListeningRoomEvents() {
    this.client.removeAllListeners('Room.timeline')
    this.client.removeAllListeners('Room.localEchoUpdated')
  }

  sendTextMessage(txt) {
    this.client.sendTextMessage(this.activeRoomId, txt)
  }

  async sendReplyMessage(txt, targetEventId) {
    const targetEvent = this.activeRoom?.findEventById(targetEventId)
    const sender = targetEvent.getSender()
    const senderUser = this.client.getUser(sender)
    await this.client.sendEvent(this.activeRoomId, 'm.room.message', {
      body: txt,
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      formatted_body: `<mx-reply>
      <blockquote>
        <a href="https://matrix.to/#/${
          this.activeRoomId
        }/${targetEventId}">In reply to</a>
        <a href="https://matrix.to/#/${targetEvent.sender}">${
        senderUser.displayName
      }</a>
        <br />
        ${targetEvent.getContent().body}}}
      </blockquote>
    </mx-reply>
   ${txt}`,
      'm.relates_to': {
        'm.in_reply_to': {
          event_id: targetEventId,
        },
      },
    })
  }

  async registerUser({ authenticatedAxios }) {
    const username = `terrakrya_${uuidv4()}`
    const client = await sdk.createClient({
      baseUrl: MATRIX_HOMESERVER,
    })
    try {
      await client.registerRequest({})
    } catch (error) {
      try {
        const matrixUser = await client.registerRequest({
          username,
          password: DEFAULT_PASSWORD,
          inhibit_login: false,
          auth: {
            type: 'm.login.dummy',
            session: error.session,
          },
        })

        if (matrixUser && matrixUser.user_id && matrixUser.access_token) {
          const matrixCredentials = {
            matrixId: matrixUser.user_id,
            matrixAccessToken: matrixUser.access_token,
          }
          await authenticatedAxios.put('/api/auth/me', matrixCredentials)
          await this.createClient(matrixCredentials)
          await this.startClient()
          return matrixUser
        } else {
          throw new Error(
            'Missing fields from matrix registration response!',
            matrixUser
          )
        }
      } catch (e) {
        console.log('Register user error:', e)
        throw e
      }
    }
  }

  async sendEditMessage(txt, targetEventId) {
    const formatedContent = ' * ' + txt
    await this.client.sendEvent(this.activeRoomId, 'm.room.message', {
      'org.matrix.msc1767.text': formatedContent,
      body: formatedContent,
      msgtype: 'm.text',
      'm.new_content': {
        'org.matrix.msc1767.text': txt,
        body: txt,
        msgtype: 'm.text',
      },
      'm.relates_to': {
        rel_type: 'm.replace',
        event_id: targetEventId,
      },
    })
  }

  // registerUser = async ({ authenticatedAxios }) => {
  //
  // }

  async createRoom({ name, topic }) {
    // const roomAlias = `devflow_${uuidv4()}`
    // TODO: Pegar o access token automaticamente caso esse pare de funcionar

    try {
      const room = await this.client.createRoom({
        name,
        topic,
        visibility: 'public',
        // room_alias_name: roomAlias,
      })
      return room
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  async createChildRoom({ name, topic, parentSpaceId }) {
    const newRoom = await this.createRoom({ name, topic }).catch((error) => {
      console.log('CreateChildRoom Error', error)
      return false
    })

    if (newRoom) {
      await this.client.sendStateEvent(
        parentSpaceId,
        'm.space.child',
        {
          via: ['terrakrya.com'],
          suggested: true,
          auto_join: true,
        },
        newRoom.room_id
      )
      return newRoom
    }
  }

  async createSpace({ name, topic, childRoom }) {
    // const roomAlias = `devflow_space_${uuidv4()}:terrakrya.com`
    // TODO: Pegar o access token automaticamente caso esse pare de funcionar

    const opts = {
      name,
      visibility: 'public',
      // room_alias_name: roomAlias,
      initial_state: [
        {
          type: 'm.space.child',
          state_key: childRoom,
          content: {
            via: ['terrakrya.com'],
          },
          suggested: true,
          auto_join: true,
        },
      ],
      creation_content: { type: 'm.space' },
    }

    try {
      const room = await this.client.createRoom(opts)
      return room
    } catch (e) {
      console.log(e)
      throw e
    }
  }
}

const MatrixServiceInstance = new MatrixService()

export default MatrixServiceInstance

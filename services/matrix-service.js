import Service from '@/services/service'
import * as sdk from 'matrix-js-sdk'
import LogsService from '@/services/logs-service'
import axios from 'axios'

const MATRIX_HOMESERVER = 'https://matrix.terrakrya.com'

class MatrixService extends Service {
  client = null
  activeRoom = null
  $log = LogsService
  //   constructor() {
  //     super()
  //   }
  async init() {
    if (!this.storeUser.matrixAccessToken) {
      this.registerUser()
    }
    this.$log.info(this.storeUser)
    if (!this.client) await this.createClient()
    if (!this.clientPrepared) await this.startClient()
  }

  // How should I call storeUser vs matrixUser?
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

  get activeRoomMessages() {
    const messageList = this.activeRoom
      .getLiveTimeline()
      .getEvents()
      .reduce((messages, event, index) => {
        const content = event.getContent()
        const sender = event.getSender()
        const senderUser = this.client.getUser(sender)
        const author =
          this.storeUser.matrixId === senderUser.id
            ? 'me'
            : senderUser.displayName
        if (!content.body) {
          return messages
        }
        return [
          ...messages,
          {
            type: 'text',
            sender: author,
            id: event.getId(),
            content: content.body,
          },
        ]
      }, [])
    return messageList
  }

  async createClient() {
    if (!this.storeUser) {
      throw new Error('No user logged In')
    }

    if (!this.storeUser.matrixId || !this.storeUser.matrixAccessToken) {
      // What to do? login or throw error?
      this.$log.info('eagoraaa?')
      this.registerUser()
    }

    let opts = {}
    try {
      const store = new sdk.IndexedDBStore({
        indexedDB:
          window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB,
        dbName: this.storeUser.matrixId,
      })

      await store.startup()
      opts = { store }
    } catch (e) {
      // Change this to logg
      console.log('IndexDB error:', e)
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
    }
  }

  async startClient() {
    if (this.client) {
      await this.client.startClient({ initialSyncLimit: 20 })
      this.client.once('sync', (state, prevState, res) => {
        if (state === 'PREPARED') {
          this.$store.commit('setClientPrepared', true)
          this.$log.info('PREPARED')
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
        this.client
          .joinRoom(roomId)
          .then((room) => {
            this.setupActiveRoom(room)
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
        this.setActiveRoom(roomId)
      }, 2000)
    }
  }

  setupActiveRoom(room) {
    this.stopListeningRoomEvents()
    this.activeRoom = room
    this.$store.commit('setMessages', this.activeRoomMessages)
    this.$store.commit('setActiveRoom', room.roomId)
    this.startListeningRoomEvents()
  }

  roomTimelineEventHandler(event, room) {
    if (
      event.getType() !== 'm.room.message' ||
      event.room_id !== this.activeRoomId
    ) {
      return
    }
    this.$store.commit('setMessages', this.activeRoomMessages)
  }

  startListeningRoomEvents() {
    this.client.on('Room.timeline', (event, room) => {
      if (
        event.getType() !== 'm.room.message' ||
        event.getRoomId() !== this.activeRoomId
      ) {
        return
      }

      this.$store.commit('setMessages', this.activeRoomMessages)
    })
  }

  stopListeningRoomEvents() {
    // this.client.removeListener('Room.timeline')
  }

  sendTextMessage(txt) {
    this.client.sendTextMessage(this.activeRoomId, txt)
  }

  async createRoom({ name, topic = '' }) {
    // slugify name as alias?
    // passo pro backend aqui ou la na sala?2
    // isso tinha que ser num application service
    return await this.client.createRoom({ name, topic, visibility: 'private' })
  }

  registerUser({ force = true }) {
    if (!this.$storeUser.matrixAccessToken) {
      const method = force === true ? axios.put : axios.post
      return method(`/api/auth/${this.storeUser.githubId}/activateChat`)
        .then(({ data }) => {
          this.$auth.setUser(data)
          return data
        })
        .catch((error) => console.log(error))
    }
  }
}

const MatrixServiceInstance = new MatrixService()

export default MatrixServiceInstance

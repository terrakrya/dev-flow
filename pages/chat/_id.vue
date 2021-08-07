<template>
  <b-container>
    <b-row v-if="chatReady">
      <b-col md="9">
        <div class="d-flex flex-column justify-content-center chat-ui">
          <RoomHeader :room="activeRoom" />
          <Messages :messages="messages" />
          <InputBox @submit="sendMessage" />
        </div>
      </b-col>
      <b-col md="3">
        <ChatList :chat-list="chatList" />
        <CreateRoom @submit="createRoom" />
      </b-col>
    </b-row>
    <b-row v-else>
      <b-button block variant="primary" @click="activateChat(true)"
        >Ativar chat
      </b-button>
    </b-row>
  </b-container>
</template>

<script>
// <b-button @click="getChatList">Buscar lista</b-button>

export default {
  data() {
    return {
      showCreateRoom: false,
      chatList: [],
    }
  },
  computed: {
    chatReady() {
      return this.$store.state.clientPrepared
    },
    matrix() {
      return this.$matrix
    },
    messages() {
      return this.$store.state.activeRoomMessages
    },

    organizationId() {
      return this.$store.state.organization.id
    },
    activeRoom() {
      return this.$matrix.client.getRoom(this.$route.params.id)
    },
  },
  created() {
    this.activateChat()
  },
  methods: {
    async createRoom({ name, topic }) {
      await this.$matrix.createRoom
      this.$axios
        .post(`/api/chat/${this.organizationId}/rooms`, { name, topic })
        .then((response) => {
          this.getChatList()
        })

      // const roomId = this.$matrix.createRoom(data)
    },
    getChatList() {
      // should be in store already
      this.$log.info(this.$store.state.organization)

      return this.$axios
        .get(`/api/chat/${this.organizationId}/rooms`)
        .then((response) => {
          this.chatList = response.data.rooms.map((roomId) => {
            const room = this.$matrix.client.getRoom(roomId)
            console.log('roomID:', roomId)
            console.log('room', room)
            if (room) {
              return room
            } else {
              return this.$matrix.client
                .joinRoom(roomId)
                .then((room) => {
                  return room
                })
                .catch((err) => {
                  console.log('aee', err)
                  return false
                })
            }
          })
        })
    },

    async sendMessage(text) {
      if (text.length > 0) {
        // this.newMessagesCount = this.isChatOpen
        //   ? this.newMessagesCount
        //   : this.newMessagesCount + 1;
        await this.$matrix.sendTextMessage(text)
      }
    },
    async activateChat(force) {
      const initialized = await this.$matrix.init(force)
      if (initialized) await this.$matrix.setActiveRoom(this.$route.params.id)
      if (initialized) await this.getChatList()
    },
  },
}

// createProjectRoom() {},
// createClient() {},
// change room
// send message
// get room list
// get room messages
// get more rom messages (get past history)
// create room
// direct messages
</script>
<style>
.chat-ui {
  max-height: 700px;
  padding-bottom: 20px;
}
</style>

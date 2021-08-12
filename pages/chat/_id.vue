<template>
  <b-container>
    <b-row v-if="chatReady">
      <b-col md="12">
        <RoomHeader :room-name="activeRoom && activeRoom.name" />
      </b-col>
      <b-col md="9">
        <div class="d-flex flex-column justify-content-end chat-ui">
          <Messages v-if="!loading" :messages="messages" />
          <b-spinner v-else label="Carregando..." />
          <InputBox @submit="sendMessage" />
        </div>
      </b-col>
      <b-col md="3">
        <ChatList :chat-list="chatList" />
        <CreateRoom @submit="createRoom" />
      </b-col>
    </b-row>
    <b-row v-else>
      <b-button
        block
        variant="primary"
        :disabled="activating"
        @click="activateChat(true)"
      >
        <b-spinner v-if="activating" />
        <span v-else> Ativar chat </span>
      </b-button>
    </b-row>
  </b-container>
</template>

<script>
// <b-button @click="getChatList">Buscar lista</b-button>

export default {
  data() {
    return {
      chatList: [],
      loading: false,
      activating: false,
      showVideoCall: false,
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
      return this.chatReady
        ? this.$matrix.client.getRoom(this.$store.state.activeRoom)
        : null
    },
  },
  watch: {
    chatReady(current, old) {
      if (current === true) this.fetchChatData()
    },
    activeRoom(current, old) {
      if (current !== old) {
        if (this.chatReady) {
          this.fetchChatData()
        }
      }
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
    async getChatList() {
      // should be in store already
      const response = await this.$axios.get(
        `/api/chat/${this.organizationId}/rooms`
      )
      const organizationRoomsIds = response.data.rooms
      let chatList = []

      for (const roomId of organizationRoomsIds) {
        let room = this.$matrix.client.getRoom(roomId)
        this.$log.info(roomId)

        if (room) {
          chatList = [...chatList, room]
        } else {
          room = await this.$matrix.client
            .joinRoom(roomId)
            .catch((error) => console.log(error))

          if (room) chatList = [...chatList, room]
        }
      }

      this.chatList = chatList
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
      this.activating = true
      if (!this.chatReady) {
        await this.$matrix.init(force)
      }
      this.activating = false

      if (this.$store.state.isFirstMatrixUse) {
        this.loading = true
        setTimeout(async () => {
          // TODO: remover esse timeout safado
          await this.fetchChatData()
          this.loading = false
          this.$store.commit('setFirstMatrixUse', false)
        }, 3000)
      } else {
        await this.fetchChatData()
      }
    },
    async fetchChatData() {
      if (this.chatReady) {
        await this.$matrix.setActiveRoom(this.$route.params.id)
        await this.getChatList()
      }
    },
  },
}
</script>
<style>
.chat-ui {
  height: 700px;
  padding-bottom: 20px;
}
</style>

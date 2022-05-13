<template>
  <no-ssr>
    <b-container fluid class="main-container">
      <b-row v-if="chatReady && orgMainRoom">
        <b-col md="12" class="mb-3">
          <ChatRoomHeader
            :room-name="activeRoom && activeRoom.name"
            :room="activeRoom"
          />
        </b-col>
        <b-col md="9">
          <div class="d-flex flex-column justify-content-end chat-ui">
            <ChatMessages v-if="!loading" :messages="messages" />
            <b-spinner v-else label="Carregando..." />
            <ChatInputBox
              id="#dummy-page-bottom"
              @submit="sendMessage"
              @reply="replyMessage"
              @edit="editMessage"
            />
          </div>
        </b-col>
        <b-col md="3" class="chat-ui">
          <ChatList :chat-list="chatList" />
          <ChatCreateRoom @submit="createRoom" />
        </b-col>
      </b-row>
      <b-row
        v-else-if="!hasMatrixAccount"
        class="m-4 px-4 pt-4 d-flex justify-content-center"
      >
        <h4>Conectar conta Matrix existente</h4>
        <b-input v-model="loginForm.login" class="m-2" placeholder="Login" />
        <b-input
          v-model="loginForm.password"
          class="m-2"
          type="password"
          placeholder="Senha"
        />
        <b-button
          block
          class="m-2"
          variant="primary"
          :disabled="activating"
          @click="activateChat(true)"
        >
          <b-spinner v-if="activating" />
          <span v-else>Conectar</span>
        </b-button>
        <p class="text-muted m-2 align-center">
          Ou se preferir, clique abaixo para criar e salvar uma nova conta
          automaticamente.
        </p>
        <b-button
          block
          class="m-2"
          variant="primary"
          :disabled="activating"
          @click="registerMatrixUser(true)"
        >
          <b-spinner v-if="activating" />
          <span v-else>Criar e Conectar</span>
        </b-button>
      </b-row>
      <div
        v-else-if="!orgMainRoom"
        class="d-flex justify-content-center align-content-center mt-4 pt-4"
      >
        <div
          v-if="organization && organization.creator === user.email"
          class="d-flex flex-column justify-content-center align-content-center"
        >
          <h2>O chat ainda não foi ativado para essa organização.</h2>
          <b-button variant="success" @click="addSpace">
            Ativar chat organização
          </b-button>
        </div>
        <h2 v-else>
          Parece que o chat não foi ativado para essa organização, e você não
          tem permissão para ativar
        </h2>
      </div>
      <b-row
        v-else
        class="d-flex justify-content-center align-items-center m-4"
      >
        <b-spinner variant="success" type="grow" label="Spinning" />
      </b-row>
    </b-container>
  </no-ssr>
</template>

<script>
export default {
  data() {
    return {
      fetching: false,
      loading: false,
      activating: false,
      messagesLoaded: false,
      showVideoCall: false,
      loginForm: {
        login: '',
        password: '',
      },
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
    matrixId() {
      return this.$auth.user.matrixId
    },
    hasMatrixAccount() {
      return this.$auth.user.matrixId && this.$auth.user.matrixAccessToken
    },
    chatReady() {
      return this.$store.state.clientPrepared
    },
    matrix() {
      return this.$matrix
    },
    messages() {
      return this.$store.state.activeRoomMessages
    },
    organization() {
      return this.$store.state.organization
    },
    organizationId() {
      return this.$store.state.organization.id
    },
    orgMainRoom() {
      return this.organization?.mainRoom
    },
    activeRoom() {
      return this.chatReady
        ? this.$matrix.client.getRoom(this.$store.state.activeRoom)
        : null
    },
    activeRoomId() {
      return this.chatReady ? this.$store.state.activeRoom : null
    },
    chatList() {
      return this.$store.state.chat.spaceRooms || []
    },
  },
  watch: {
    'this.$route.params.id': {
      imediate: true,
      handler(id) {
        this.fetchChatData()
      },
    },
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
    if (
      !this.chatReady &&
      this.$auth.user.matrixId &&
      this.$auth.user.matrixAccessToken
    ) {
      this.$matrix.login({ authenticatedAxios: this.$axios })
    }
  },
  mounted() {
    this.fetchChatData()
  },
  methods: {
    async addSpace() {
      this.loading = true
      await this.$store.dispatch('chat/createSpaceForOrg')
      this.loading = false
    },
    parseMessages(messages) {
      return messages.map((message) => {
        return message
      })
    },
    async fetchMessages({ room }) {
      this.fetching = true
      if (this.$route.params.id === room.roomId) {
        await this.$matrix.fetchHistory()
      } else {
        this.$router.replace('/chat/' + room.roomId)
        await this.fetchChatData()
      }
      this.fetching = false
    },
    async createRoom({ name, topic }) {
      if (this.orgMainRoom) {
        await this.$matrix.createChildRoom({
          name,
          topic,
          parentSpaceId: this.orgMainRoom,
        })
        this.$store.dispatch('chat/fetchSpaceRooms')
      }
    },

    async sendMessage(text) {
      if (text.length > 0) {
        // this.newMessagesCount = this.isChatOpen
        //   ? this.newMessagesCount
        //   : this.newMessagesCount + 1;
        await this.$matrix.sendTextMessage(text)
      }
    },

    async replyMessage({ text, eventId }) {
      if (text.length > 0) {
        await this.$matrix.sendReplyMessage(text, eventId)
      }
    },

    async editMessage({ text, eventId }) {
      if (text.length > 0) {
        await this.$matrix.sendEditMessage(text, eventId)
      }
    },

    async activateChat(force) {
      this.activating = true

      if (!this.chatReady) {
        await this.$matrix.login(
          this.loginForm.login,
          this.loginForm.password,
          this.$axios
        )
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

    async registerMatrixUser() {
      await this.$matrix.registerUser({ authenticatedAxios: this.$axios })
      // await this.$matrix.login()
    },
    async fetchChatData() {
      if (this.chatReady) {
        if (this.chatList.length === 0) {
          await this.$store.dispatch('chat/fetchSpaceRooms')
        }
        if (this.$route.params.id !== 'index') {
          await this.$matrix.setActiveRoom(this.$route.params.id)
        } else if (this.chatList.length > 0 && !this.$matrix.activeRoom) {
          // Later should be able to retreive default room to open
          await this.$matrix.setActiveRoom(this.chatList[0].room_id)
        }
      }
      this.scrollToBottom()
    },
    scrollToBottom() {
      this.$nextTick(() => {
        window.scrollTo({
          left: 0,
          top: document.body.scrollHeight,
          behavior: 'smooth',
        })
      })
    },
  },
}
</script>
<style>
.chat-ui {
  height: 100%;
  max-height: 680px;
  margin-bottom: 30px;
}
.main-container {
  max-width: 1400px;
}
</style>

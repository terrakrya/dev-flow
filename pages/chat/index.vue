<template>
  <b-container fluid>
    <b-row v-if="chatReady">
      <b-col md="9">
        <h2>{{ matrix.activeRoom.name }}</h2>
        <Messages :messages="messages" />
        <InputBox @submit="sendMessage" />
      </b-col>
      <b-col md="3">
        <ChatList :chat-list="chatList" />
        <CreateRoom @submit="createRoom" />
      </b-col>
    </b-row>
    <b-row v-else>
      <b-button @click="activateChat"> Ativar chat </b-button>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      showCreateRoom: false,
    }
  },
  computed: {
    chatReady() {
      return this.$store.state.activeRoom
    },
    matrix() {
      return this.$matrix
    },
    messages() {
      return this.$store.state.activeRoomMessages
    },
    chatList() {
      return this.$store.state.chatList
    },
    organization() {
      return this.$store.state.organization
    },
  },
  async created() {},
  methods: {
    // async createOrganizationRoom({ name, topic }) {
    //   const newRoom = await this.$matrix.createRoom({ name, topic })
    //   this.$axios
    //     .put(`/api/organizations/${this.organization.githubId}`, {
    //       matrixRooms: [newRoom.room_id],
    //     })
    //     .then(this.$store.commit('setOrganization', response.data))
    //     .catch((error) => this.$log.error)
    // },
    // async setOrganizationMainRoom() {
    //   const activeRoomId = this.$store.state.activeRoomId
    //   await this.$axios
    //     .put(`/api/organizations/${this.organization.githubId}`, {
    //       mainRoom: [activeRoomId],
    //     })
    //     .then(this.$store.commit('setOrganization', response.data))
    //     .catch((error) => this.$log.error)
    // },

    createRoom(data) {
      console.log('data', data)
      // const roomId = this.$matrix.createRoom(data)
    },

    async sendMessage(text) {
      if (text.length > 0) {
        // this.newMessagesCount = this.isChatOpen
        //   ? this.newMessagesCount
        //   : this.newMessagesCount + 1;
        await this.$matrix.sendTextMessage(text)
      }
    },
    // async activateOrganizationChat() {
    //   await this.getOrganizationChat()
    //   await this.fetchCurrentRoom()
    // },
    async activateChat() {
      await this.$matrix.init()

      // await this.$matrix.setActiveRoom('!UrjMfYNLDtrtslKMOt:fractopia.org')
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

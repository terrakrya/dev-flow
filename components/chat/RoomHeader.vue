<template>
  <div class="chat-header p-3">
    <div class="d-flex flex-row justify-content-start align-items-center">
      <div class="d-flex flex-row align-items-center flex-grow-1">
        <Avatar :name="roomName" :src="getAvatar(room)" size="3rem" />
        <h2 class="ml-4">{{ roomName || 'Nome da Sala' }}</h2>
      </div>
      <b-button class="mx-4" variant="outline-success" @click="onCallClick">
        Chamada <b-icon icon="camera-video-fill"></b-icon>
      </b-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    roomName: { type: String, default: () => 'Entre em uma sala' },
    room: { type: Object, default: () => {} },
  },
  methods: {
    onCallClick() {
      this.$store.commit('startVideoCall')
    },
    getAvatar(room) {
      const avatarUrl = room?.getAvatarUrl()
      const baseUrl = this.$matrix.client.getHomeserverUrl()
      if (avatarUrl) {
        return avatarUrl.replace('undefined', baseUrl)
      } else {
        return false
      }
    },
  },
}
</script>

<style escoped>
.chat-header {
  border-bottom: 1px dashed grey;
}
.button {
  margin-bottom: 20px;
  z-index: 20;
}
</style>

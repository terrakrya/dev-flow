<template>
  <div class="d-flex flex-column justify-content-between chat-header">
    <h2>{{ roomName }}</h2>
    <div class="button align-self-end">
      <b-button @click="onCallClick">
        <b-icon icon="camera-video-fill"></b-icon> VideoChamada
      </b-button>
    </div>
  </div>
</template>
<script>
export default {
  props: { roomName: { type: String, default: () => 'Sala' } },
  methods: {
    onCallClick() {
      this.$store.commit('startVideoCall')
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
}
</style>

<template>
  <div class="messages d-flex flex-column">
    <b-button
      v-if="canLoadMoreHistory"
      pill
      :disabled="isFetchingHistory"
      @click="fetchHistory"
    >
      <b-spinner v-if="isFetchingHistory" />
      <span v-else> Carregar anteriores </span></b-button
    >
    <Message
      v-for="(msg, index) in messages"
      :key="index"
      :message="msg"
      :is-first-from-sender="
        index > 0 ? msg.sender != messages[index - 1].sender : true
      "
    />
    <div id="dummy-bottom" />
    <b-button variant="info" pill class="bottom-button" @click="scrollToBottom">
      <b-icon icon="arrow-down"></b-icon>
    </b-button>
  </div>
</template>

<script>
export default {
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isScrolledToBottom: true,
      canLoadMoreHistory: true,
      isFetchingHistory: false,
    }
  },
  watch: {
    messages() {
      if (this.isScrolledToBottom) this.scrollToBottom()
    },
  },
  created() {
    this.scrollToBottom()
  },
  methods: {
    async fetchHistory() {
      this.isScrolledToBottom = false
      this.isFetchingHistory = true
      const response = await this.$matrix.fetchHistory()
      this.canLoadMoreHistory = !!response
      this.isFetchingHistory = false
    },

    scrollToBottom() {
      this.$nextTick(() => {
        document.querySelector('#dummy-bottom').scrollIntoView()
      })
    },
  },
}
</script>
<style>
.messages {
  overflow-y: scroll;
  height: 700px;
  padding: 10px 0;
  margin-bottom: 10px;
}
.bottom-button {
  position: absolute;
  bottom: 130px;
  right: 50px;
}
</style>

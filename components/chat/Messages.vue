<template>
  <div class="messages">
    <Message
      v-for="(msg, index) in messages"
      :key="index"
      :message="msg"
      :first-from-sender="
        index > 0
          ? messages.sender != messages[index - 1].sender
          : messages.sender
      "
    />
    <div id="dummy-bottom" />
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
  watch: {
    messages() {
      this.scrollToBottom()
    },
  },
  created() {
    this.scrollToBottom()
  },
  methods: {
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
  max-height: 70%;
  padding: 10px 0;
  margin-bottom: 10px;
}
</style>

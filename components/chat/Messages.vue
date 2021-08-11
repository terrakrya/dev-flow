<template>
  <div class="messages d-flex flex-column justify-content-end">
    <Message
      v-for="(msg, index) in messages"
      :key="index"
      :message="msg"
      :is-continuation="
        index > 0 ? msg.sender != messages[index - 1].sender : true
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
  min-height: 70%;
  padding: 10px 0;
  margin-bottom: 10px;
}
</style>

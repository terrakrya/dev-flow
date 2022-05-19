<template>
  <ChatMessageBubble
    v-if="allowedTypes.includes(message.type)"
    :message="message"
    :is-first-from-sender="isFirstFromSender"
  >
    <ChatTextMessage v-if="message.type === 'm.text'" :message="message" />
    <ChatImageMessage
      v-else-if="message.type === 'm.image'"
      :message="message"
    />
    <ChatNoticeMessage
      v-else-if="message.type === 'm.notice'"
      :message="message"
    />
  </ChatMessageBubble>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => {},
    },
    isFirstFromSender: {
      type: Boolean,
    },
  },
  data() {
    return {
      showNotice: false,
    }
  },
  computed: {
    allowedTypes() {
      let allowed = ['m.text', 'm.image']
      if (this.showNotice) {
        allowed = [...allowed, 'm.notice']
      }
      return allowed
    },
  },
}
</script>
<style>
.message {
  margin-left: 20px;
}

.first {
  padding-top: 35px;
  border-top: 1px dashed rgba(80, 80, 80, 0.6);
}
.title {
  margin-left: 10px;
}
</style>

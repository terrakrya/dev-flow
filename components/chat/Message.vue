<template>
  <ChatMessageBubble
    v-if="['m.text', 'm.image'].includes(message.type)"
    :message="message"
    :is-first-from-sender="isFirstFromSender"
  >
    <ChatTextMessage v-if="message.type === 'm.text'" :message="message" />
    <ChatImageMessage
      v-else-if="message.type === 'm.image'"
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
}
</script>
<style>
.message {
  margin-left: 20px;

  /* border: 1px solid black;
  background-color: green;
  border-radius: 2; */
}

.first {
  padding-top: 35px;
  border-top: 1px dashed rgba(80, 80, 80, 0.6);
}
.title {
  margin-left: 10px;
}
</style>

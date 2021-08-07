<template>
  <div class="message">
    <h5 v-if="firstFromSender">
      {{ message.sender }}
    </h5>
    <p>
      {{ message.content }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => {},
    },
    firstFromSender: {
      type: Boolean,
    },
  },
}
</script>

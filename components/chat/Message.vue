<template>
  <div class="message">
    <h5 v-if="isContinuation">
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
    isContinuation: {
      type: Boolean,
    },
  },
  created() {},
}
</script>

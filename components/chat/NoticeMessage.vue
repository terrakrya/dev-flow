<template>
  <div>
    <small>{{ message.content }}</small>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => {},
    },
  },
  computed: {},
}
</script>

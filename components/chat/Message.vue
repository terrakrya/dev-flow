<template>
  <div :class="{ message: true, first: isFirstFromSender }">
    <div v-if="isFirstFromSender" class="d-flex justify-content-between">
      <h5 class="title">
        {{ message.sender }}
      </h5>
      <small>{{ date }}</small>
    </div>
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
    isFirstFromSender: {
      type: Boolean,
    },
  },
  computed: {
    date() {
      const d = new Date(this.message.timestamp)
      return d.toDateString()
    },
  },
  created() {},
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
  margin-left: -10px;
}
</style>

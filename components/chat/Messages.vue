<template>
  <div class="container">
    <div v-for="(msg, index) in messages" :key="index" class="message">
      <h5
        v-if="index > 0 ? msg.sender != messages[index - 1].sender : msg.sender"
      >
        {{ msg.sender }}
      </h5>
      <p>
        {{ msg.content }}
      </p>
    </div>
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
.container {
  height: 800px;
  overflow-y: scroll;
}
</style>

<template>
  <b-list-group>
    <b-list-group-item v-for="(chat, index) in chatList" :key="index">
      <b-avatar />
      <span class="mr-auto">{{ chat.name }}</span>
      <b-badge>{{ chat.unread }}</b-badge>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
export default {
  props: {
    chatList: {
      type: Array,
      default: () => [],
    },
  },
}
</script>

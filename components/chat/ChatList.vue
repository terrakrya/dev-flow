<template>
  <b-list-group>
    <b-list-group-item>
      <NuxtLink to="/chat/!wgWHBtEuZsOYCjtfaz:terrakrya.com">
        <b-avatar />
        <span class="mr-auto">Geral</span>
        <b-badge>0</b-badge>
      </NuxtLink>
    </b-list-group-item>

    <b-list-group-item v-for="(chat, index) in chatList" :key="index">
      <NuxtLink :to="'/chat/' + chat.roomId">
        <b-avatar />
        <span class="mr-auto">{{ chat.name }}</span>
        <b-badge>{{ chat.unread }}</b-badge>
      </NuxtLink>
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

<template>
  <div class="chat-list">
    <NuxtLink
      v-for="(chat, index) in chatList"
      :key="index"
      :to="'/chat/' + chat.room_id"
    >
      <div class="li-room" :class="{ current: isActive(chat.room_id) }">
        <b-avatar
          v-if="getAvatar(chat.room_id)"
          :src="getAvatar(chat.room_id)"
        />
        <b-avatar v-else> <b-icon-hash /></b-avatar>
        <span class="mr-auto ml-3">{{ chat.name }}</span>
        <b-badge>{{ chat.unread }}</b-badge>
      </div>
    </NuxtLink>
  </div>
</template>

<script>
export default {
  props: {
    chatList: {
      type: Array,
      default: () => [],
    },
  },

  methods: {
    isActive(chatId) {
      return this.$store.state.activeRoom === chatId
    },
    getAvatar(roomId) {
      const room = this.$matrix.client.getRoom(roomId)
      const avatarUrl = room?.getAvatarUrl()
      if (avatarUrl) {
        const baseUrl = this.$matrix.client.getHomeserverUrl()
        return avatarUrl.replace('undefined', baseUrl)
      } else {
        return false
      }
    },
  },
}
</script>
<style>
.li-room {
  cursor: pointer;
  border-radius: 8px;
  margin: 4px;
  margin-bottom: 8px;
  padding: 10px;
  padding-left: 16px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  font-weight: bold;
}
.chat-list a {
  color: inherit;
}
.chat-list {
  max-height: 610px;
  overflow-y: scroll;
  scrollbar-color: rgba(255, 255, 255, 0.06) rgba(255, 255, 255, 0);
  overscroll-behavior: contain;
}
.li-room:hover {
  background-color: rgba(255, 255, 255, 0.16);
}
.current {
  background-color: rgba(255, 255, 255, 0.16) !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.22) !important;
}
</style>

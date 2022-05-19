<template>
  <div
    :class="{
      message: true,
      first: isFirstFromSender,
    }"
    @mouseover="showOptions"
    @mouseleave="hideOptions"
  >
    <div v-if="isFirstFromSender" class="d-flex justify-content-between">
      <div class="d-flex flex-row pb-4">
        <Avatar size="2rem" :name="message.sender" />
        <h5 class="title">
          {{ message.sender }}
        </h5>
      </div>
      <small class="msg-timestamp mr-4">{{ date }}</small>
    </div>

    <div class="content pl-2" :class="{ highlighted: optionsVisible }">
      <div
        v-if="optionsVisible"
        class="d-flex flex-column align-items-end options"
      >
        <div class="pr-4">
          <b-icon-pencil
            v-if="message.canEdit"
            variant="outline-primary"
            class="reply-button mx-2"
            font-scale="1.3"
            @click="editMessage"
          />
          <b-icon-reply
            font-scale="1.7"
            class="reply-button mx-1"
            @click="replyMessage"
          />
        </div>
      </div>
      <slot></slot>
    </div>
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
  data() {
    return {
      optionsVisible: false,
    }
  },
  computed: {
    date() {
      const d = new Date(this.message.timestamp)
      return d.toDateString()
    },
  },
  methods: {
    replyMessage() {
      this.$store.dispatch('setReplyToMessage', { ...this.message })
    },
    editMessage() {
      this.$store.dispatch('setEditMessage', { ...this.message })
    },
    showOptions() {
      this.optionsVisible = true
    },
    hideOptions() {
      this.optionsVisible = false
    },
    getAvatar(user) {
      const avatarUrl = user?.getAvatarUrl()
      const baseUrl = this.$matrix.client.getHomeserverUrl()
      if (avatarUrl) {
        return avatarUrl.replace('undefined', baseUrl)
      } else {
        return false
      }
    },
  },
}
</script>
<style>
.msg-timestamp {
  color: grey;
  font-size: 10px !important;
}
.reply-button:hover {
  cursor: pointer;
}
.options {
  position: absolute;
  top: 0;
  right: 0;
}
.content {
  position: relative;
}
.highlighted {
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
}
</style>

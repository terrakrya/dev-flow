<template>
  <div
    class="messages d-flex flex-column"
    :class="{
      'no-scroll': isFetchingHistory,
    }"
  >
    <b-button
      v-if="!isFetchingHistory"
      v-observable:enter="fetchHistory"
      pill
      block
      :disabled="isFetchingHistory"
      @click="fetchHistory"
    >
      <b-spinner v-if="isFetchingHistory" />
      <span v-else> Carregar anteriores </span>
    </b-button>
    <ChatMessage
      v-for="(msg, index) in messagesWithoutLast"
      :key="index"
      :class="{
        'focus-before-fetch': previousLastEventId === msg.id,
      }"
      :message="msg"
      :is-first-from-sender="
        index > 0 ? msg.sender != messages[index - 1].sender : true
      "
    />
    <!-- the last message is apart because we want to observe it on viewport -->
    <ChatMessage
      id="last-message"
      v-observable="setScrolledToBottom"
      :message="lastMessage"
      :is-first-from-sender="
        messagesWithoutLast.length > 0
          ? lastMessage.sender !=
            messagesWithoutLast[messagesWithoutLast.length - 1].sender
          : true
      "
    />
    <b-button
      v-if="!isScrolledToBottom"
      variant="info"
      pill
      class="bottom-button"
      @click="scrollToBottom"
    >
      <b-icon icon="arrow-down"></b-icon>
    </b-button>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'
// import throttle from 'lodash/throttle'
export default {
  props: {
    messages: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isScrolledToBottom: true,
      canLoadMoreHistory: true,
      isFetchingHistory: false,
      previousLastEventId: null,
    }
  },
  computed: {
    messagesWithoutLast() {
      return this.messages.slice(0, this.messages.length - 1) || []
    },
    lastMessage() {
      return this.messages[this.messages.length - 1] || {}
    },
  },
  watch: {
    messages() {
      if (this.isScrolledToBottom) this.scrollToBottom()
    },
  },
  created() {
    this.scrollToBottom()
  },

  methods: {
    fetchHistory() {
      return throttle(
        async () => {
          console.log('fetching history')
          this.previousLastEventId = this.messagesWithoutLast[0]?.id
          this.isFetchingHistory = true
          await this.$matrix.fetchHistory()
          // this.canLoadMoreHistory = !!response
          this.isFetchingHistory = false
          this.scrollAfterFetch()
        },
        1500,
        { leading: true }
      )()
    },
    setScrolledToBottom(isEntering) {
      console.log('setScrolledToBottom', isEntering)
      this.isScrolledToBottom = isEntering
    },
    scrollToBottom() {
      this.$nextTick(() => {
        document.querySelector('#last-message')?.scrollIntoView()
        this.isScrolledToBottom = true
      })
    },
    scrollAfterFetch() {
      this.$nextTick(() => {
        if (this.previousLastEventId && !this.isScrolledToBottom) {
          const lastMessageElement = document.querySelector(
            '.focus-before-fetch'
          )
          if (lastMessageElement) {
            lastMessageElement.scrollIntoView()
            this.previousLastEventId = null
          }
        }
      })
    },
  },
}
</script>
<style>
.messages {
  height: 100%;
  padding: 10px 0;
  margin-bottom: 30px;
  overflow-y: scroll;
  overflow-x: hidden;
  scrollbar-color: rgba(255, 255, 255, 0.1) rgba(255, 255, 255, 0);
  overscroll-behavior: contain;
}
.bottom-button {
  position: absolute;
  bottom: 120px;
  right: 40px;
}
.scroller {
  height: 100%;
}
.no-scroll {
  overflow-y: hidden;
}
blockquote {
  margin: 40;
}
::-webkit-scrollbar {
  width: 6px;
  height: 60px;
}

::-webkit-scrollbar-track-piece {
  background-color: rgba(255, 255, 255, 0);
}

::-webkit-scrollbar-thumb:vertical {
  height: 30px;
  background-color: rgba(255, 255, 255, 0.08);
}
</style>

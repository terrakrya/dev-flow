<template>
  <div>
    <blockquote v-if="replyEvent">
      <a :href="`https://matrix.to/#/${activeRoomId}/${replyEvent.id}`"
        >Em resposta a</a
      >
      <a :href="`https://matrix.to/#/${replyEvent.senderId}`">{{
        replyEvent.senderUser.displayName
      }}</a>
      <br />
      <p>{{ replyEvent.content }}</p>
    </blockquote>
    <p v-linkify class="msg-text" v-html="message.content"></p>
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
  data() {
    return {
      relations: null,
    }
  },
  computed: {
    activeRoomId() {
      return this.$store.state.activeRoom
    },
    replyEvent() {
      const replyEvent = this.message.replyEvent
      return replyEvent
        ? {
            senderId: replyEvent.getSender(),
            senderUser: this.$matrix.client.getUser(replyEvent.getSender()),
            content: replyEvent.getContent()?.body,
            id: replyEvent.getId(),
          }
        : null
    },
  },
  mounted() {
    this.getRelations()
  },

  methods: {
    // when there is an edit it still doesnt update
    async getRelations() {
      // if (!this.relations)
      //   this.relations = await this.$matrix.client.fetchRelations(
      //     this.$store.state.activeRoom,
      //     this.message.id
      //   )
    },
  },
}
</script>
<style>
blockquote {
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  border-left: 2px solid #02d35f;
  quotes: '\201C''\201D''\2018''\2019';
}
.msg-text {
  word-wrap: break-word;
}
</style>

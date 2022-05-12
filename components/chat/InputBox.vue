<template>
  <b-form class="input-form" @submit="onClick">
    <b-input-group>
      <b-input-group-prepend>
        <b-button @click="attachment">
          <b-icon-paperclip />
        </b-button>
      </b-input-group-prepend>
      <b-form-input v-model="message" class="input" />

      <b-input-group-append>
        <b-button variant="success" @click="onClick">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"
            />
          </svg>
        </b-button>
        <!-- <b-button @click="onClick">
          <b-icon-three-dots />
        </b-button> -->
      </b-input-group-append>
      <div v-if="replyToMessage" class="reply-content">
        <div class="d-flex justify-content-between align-items-center">
          <small class="ml-2">
            Respondendo a <b>{{ replyToMessage.sender }}</b>
          </small>
          <b-icon-x font-scale="1.8" @click="cancelReply" />
        </div>
        <small class="ml-2" v-html="replyToMessage.content" />
      </div>
      <div v-if="editMessage" class="reply-content">
        <div class="d-flex justify-content-between align-items-center">
          <small class="ml-2"> <b>Editando</b> </small>
          <b-icon-x font-scale="1.8" @click="cancelEdit" />
        </div>
        <small class="ml-2" v-html="editMessage.content" />
      </div>
    </b-input-group>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      message: '',
    }
  },
  computed: {
    replyToMessage() {
      return this.$store.state.replyToMessage
    },
    editMessage() {
      return this.$store.state.editMessage
    },
  },
  watch: {
    editMessage() {
      this.message = this.editMessage?.content
    },
  },
  methods: {
    onClick(event) {
      event.preventDefault()
      if (this.replyToMessage) {
        this.$emit('reply', {
          text: this.message,
          eventId: this.replyToMessage.id,
          sender: this.replyToMessage.sender,
        })
        this.$store.dispatch('setReplyToMessage', null)
      } else if (this.editMessage) {
        this.$emit('edit', {
          text: this.message,
          eventId: this.editMessage.id,
        })
        this.$store.dispatch('setEditMessage', null)
      } else {
        this.$emit('submit', this.message)
      }

      this.message = ''
    },
    attachment() {
      this.$emit('attachment')
    },
    cancelReply() {
      this.$store.dispatch('setReplyToMessage', null)
    },
    cancelEdit() {
      this.$store.dispatch('setEditMessage', null)
    },
  },
}
</script>
<style>
.input-form {
  position: relative;
  width: 100%;
  border-radius: 6px;
}
.input {
  border-radius: 6px;
}
.reply-content {
  position: absolute;
  bottom: 40px;
  left: 0;
  background-color: white;
  width: 100%;
  color: black;
  padding: 6px;
  border-radius: 6px;
  margin-bottom: 6px;
}
</style>

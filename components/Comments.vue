<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <hr />
    <b-media v-for="comment in comments" :key="comment.id" class="pt-2">
      <template #aside>
        <Member :id="comment.member" />
      </template>
      <p>
        {{ comment.message }}
      </p>
    </b-media>
    <FormCommentForm :target="target" @change="commentSaved" />
  </div>
</template>
<script>
export default {
  props: {
    target: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      comments: null,
    }
  },
  created() {
    this.loadComments()
  },
  methods: {
    async loadComments() {
      this.comments = await this.$axios.$get('/api/comments', {
        params: { target: this.target },
      })
    },
    commentSaved(comment) {
      this.comments.push(comment)
      this.$emit('change', comment)
    },
  },
}
</script>

<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <b-media class="pt-2">
      <template #aside>
        <Member :id="$auth.user.id.toString()" />
      </template>
      <p>
        <b-form-textarea
          v-model="form.message"
          :placeholder="form.comment ? 'Responder' : 'Adicione um comentário'"
        />
        <b-btn v-if="form.message" block class="mt-2" @click="save">
          Salvar comentário
        </b-btn>
      </p>
    </b-media>
  </div>
</template>
<script>
export default {
  props: {
    comment: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      form: {
        organization: this.$store.state.organization?.id,
        comment: this.comment,
        target: this.target,
        message: null,
      },
    }
  },
  computed: {
    activeOrganization() {
      return this.$store.state.organization?.id
    },
  },
  methods: {
    async save() {
      if (this.form.message) {
        const comment = await this.$axios.$post('/api/comments', this.form)
        if (comment) {
          this.$toast.success('Comentário enviado!')
          this.$emit('change', comment)
          this.form.message = null
        }
      }
    },
  },
}
</script>

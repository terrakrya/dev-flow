<template>
  <b-container fluid>
    <b-row>
      <b-col md="8">
        <b-card v-if="note || editing">
          <b-btn @click="toggleEdit">{{ editing ? 'salvar' : 'editar' }}</b-btn>
          <b-btn v-if="note" @click="deleteNote">Apagar nota</b-btn>
          <div v-if="editing">
            <b-input v-model="form.title" placeholder="Titulo" />
            <quill-editor
              ref="quillEdit"
              v-model="form.content"
              toolbar="minimal"
            />
          </div>
          <div v-else-if="note">
            <h1>{{ note.title }}</h1>
            <p v-html="note.content" />
          </div>
        </b-card>
      </b-col>
      <b-col md="4">
        <b-btn v-if="!editing" @click="createNote">Nova nota</b-btn>

        <b-list-group>
          <b-list-group-item
            v-for="note in notes"
            :key="note.id"
            :to="'/wiki/' + note.id"
          >
            {{ note.title }}
          </b-list-group-item>
        </b-list-group>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      editing: false,
      note: null,
      form: { content: '' },
      notes: [],
    }
  },
  computed: {
    activeOrgId() {
      return this.$store.state.organization.id
    },
    noteId() {
      return this.$route.params.id
    },
  },
  created() {
    this.getNote()
    this.getNotes()
  },
  methods: {
    createNote() {
      this.editing = true
      this.form = { content: '', title: '', id: null }
      this.note = null
      this.$nextTick(() => {
        this.$refs.quillEdit.quill.focus()
      })
    },
    async saveNote() {
      if (this.form.id) {
        await this.$axios
          .put('/api/notes/' + this.form.id, this.form)
          .catch(this.showError)
      } else {
        const response = await this.$axios
          .post('/api/notes/', { ...this.form, organization: this.activeOrgId })
          .catch(this.showError)

        this.$router.push('/wiki/' + response.data.id)
      }
      this.getNote()
      this.getNotes()
    },
    async deleteNote() {
      await this.$axios
        .delete('/api/notes/' + this.$route.params.id, { ...this.form })
        .catch(this.showError)
      this.note = null
      this.getNotes()
    },
    async getNote() {
      if (this.$route.params.id) {
        const response = await this.$axios
          .get('/api/notes/' + this.$route.params.id, {
            params: { organization: this.activeOrgId },
          })
          .catch(this.showError)
        this.note = response.data
      }
    },
    async getNotes() {
      const response = await this.$axios
        .get('/api/notes/', {
          params: { organization: this.activeOrgId },
        })
        .catch(this.showError)
      this.notes = response.data
    },
    toggleEdit() {
      if (this.editing) {
        this.editing = false
        this.saveNote()
      } else {
        this.editing = true
        this.form = {}
        this.form.content = this.note.content
        this.form.id = this.note.id
        this.form.title = this.note.title
      }
    },
  },
}
</script>

<template>
  <b-container fluid>
    <b-row>
      <b-col md="8">
        <b-card v-if="note || editing">
          <div v-if="editing">
            <b-row>
              <b-col md="11">
                <b-input v-model="form.title" placeholder="Titulo" />
              </b-col>
              <b-col md="1">
                <b-btn pill variant="success" @click="toggleEdit">
                  <b-icon-check
                /></b-btn>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <quill-editor
                  ref="quillEdit"
                  v-model="form.content"
                  class="mt-4"
                  toolbar="minimal"
                />
              </b-col>
            </b-row>
          </div>
          <div v-else-if="note">
            <b-row>
              <b-col md="10">
                <h1>{{ note.title }}</h1>
              </b-col>
              <b-col md="2" class="d-flex justify-content-end">
                <b-btn pill variant="success" @click="toggleEdit">
                  <b-icon-pencil
                /></b-btn>
                <b-btn
                  v-if="note"
                  class="ml-2"
                  pill
                  variant="outline-danger"
                  @click="deleteNote"
                >
                  <b-icon-trash
                /></b-btn>
              </b-col>
            </b-row>
            <b-row>
              <b-col md="12">
                <p v-html="parsedMarkdown" />
              </b-col>
            </b-row>
          </div>
        </b-card>
      </b-col>
      <b-col md="4">
        <!-- TODO: change this to create data entry -->
        <b-btn
          v-if="!editing"
          v-b-modal.newLink
          variant="outline-success"
          class="my-2"
          ><b-icon-plus /> Link</b-btn
        >
        <!-- popup dialog -->
        <b-modal id="newLink" title="Adicionar link">
          <b-form @submit.prevent="addLink">
            <!-- form for a link, consisting in label, description, shouldEmbed, and tags -->
            <b-form-group label="Nome">
              <b-form-input v-model="newLink.label" required />
            </b-form-group>
            <b-form-group label="Descrição">
              <b-form-textarea v-model="newLink.description" />
            </b-form-group>
            <b-form-group label="Embedar pagina?">
              <b-form-checkbox v-model="newLink.shouldEmbed" />
            </b-form-group>
            <!-- <b-form-group label="Tags">
              <b-form-input v-model="newLink.tags" />
            </b-form-group> -->
          </b-form>
          <template #modal-footer>
            <b-btn
              variant="outline-secondary"
              @click="
                () => {
                  $bvModal.hide('newLink')
                  clearNewLinkForm()
                }
              "
              >Cancelar</b-btn
            >
            <b-btn variant="outline-success" @click="createFolder"
              >Confirmar</b-btn
            >
          </template>
        </b-modal>

        <b-btn
          v-if="!editing"
          variant="outline-success"
          class="my-2"
          @click="createNote"
          ><b-icon-plus /> Nova nota</b-btn
        >
        <b-btn v-b-modal.newFolder variant="outline-success" class="my-2"
          ><b-icon-folder /> Nova pasta</b-btn
        >
        <!-- popup dialog -->
        <b-modal id="newFolder" title="Criar nova pasta">
          <div>
            <label for="newFolderName">Nome:</label>
            <input id="folderName" v-model="newFolderName" type="text" />
          </div>
          <template #modal-footer>
            <b-btn
              variant="outline-secondary"
              @click="
                () => {
                  $bvModal.hide('newFolder')
                  newFolderName = ''
                }
              "
              >Cancelar</b-btn
            >
            <b-btn variant="outline-success" @click="createFolder"
              >Confirmar</b-btn
            >
          </template>
        </b-modal>

        <!-- <iframe
          :src="`https://sementesdoxingu.org.br`"
          width="80%"
          height="800px"
        ></iframe> -->

        <b-list-group>
          <Folder v-for="folder in folders" :key="folder.id" :data="folder" />
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
      folders: [],
      newFolderName: '',
      newLink: {
        label: '',
        description: '',
        shouldEmbed: false,
        tags: [],
      },
    }
  },
  computed: {
    activeOrgId() {
      return this.$store.state.organization.id
    },
    noteId() {
      return this.$route.params.id
    },
    parsedMarkdown() {
      return this.$md.render(this.note.content)
    },
    selectedFolder() {
      return this.$store.state.wiki.selectedFolder
    },
  },
  created() {
    this.getFolders()
    this.getNote()
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

        if (response.data?._id) {
          this.$store.dispatch('wiki/addFolderChild', {
            label: response.data.title,
            type: 'Note',
            item: response.data._id,
          })
        }
        this.$router.push('/wiki/' + response.data.id)
      }
      this.getFolders()
      this.getNote()
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
        const response = await this.$axios.get(
          '/api/notes/' + this.$route.params.id,
          {
            params: { organization: this.activeOrgId },
          }
        )
        // .catch(this.showError)
        this.note = response.data
      }
    },
    async getFolders() {
      const response = await this.$axios.get('/api/folders/', {
        params: { organization: this.activeOrgId },
      })

      // .catch(this.showError)
      this.folders = response.data.map((folder) => ({
        item: folder._id,
        label: folder.label,
        type: 'Folder',
      }))
      console.log(this.folders)
    },
    async createFolder() {
      const newFolder = {
        label: this.newFolderName,
        organization: this.activeOrgId,
        // parent
      }
      if (!this.selectedFolder) {
        newFolder.root = true
      }
      await this.$axios
        .post('/api/folders', newFolder)
        .then((response) => {
          console.log('response', response)
          if (this.selectedFolder) {
            this.$store.dispatch('wiki/addFolderChild', {
              label: this.newFolderName,
              organization: this.activeOrgId,
              item: response.data._id,
              type: 'Folder',
            })
          }
          this.$bvModal.hide('newFolder')
          this.getFolders()
        })
        .catch((err) => {
          console.log('error', err)
        })
    },
    async addLink() {
      // create another kind of entry
      // for now, an url, which you can embed, description and tags
      await this.$axios
        .get('/api/links/', {
          params: { organization: this.activeOrgId, ...this.newLink },
        })
        .catch((err) => {
          console.log('error', err)
        })
      this.clearNewLinkForm()

      this.$$bvModal.hide('newLink')
    },
    clearNewLinkForm() {
      this.newLink = {
        label: '',
        description: '',
        shouldEmbed: false,
        tags: [],
      }
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

<template>
  <b-container fluid>
    <b-row>
      <b-col md="12" class="p-6">
        <b-card class="d-flex align-items-center">
          <h1>Meu Perfil</h1>
          <div class="d-flex justify-content-center">
            <Upload
              v-if="isEditing"
              v-model="uploadedImage"
              avatar
              type="images"
              @input="handleAvatarUpload"
            />
            <Avatar
              v-else
              :src="user.avatarUrl"
              :name="user.name"
              size="8rem"
            />
          </div>
          <div v-if="isEditing">
            <b-input class="mt-2" v-model="form.name" placeholder="Nome" />
            <b-input
              v-model="form.email"
              class="mt-2"
              placeholder="Email"
              disabled
            />
          </div>
          <div class="mt-4" v-else>
            <p class="m-2">Nome: {{ user.name }}</p>
            <p class="m-2">Email: {{ user.email }}</p>
          </div>
          <b-button class="mt-4" block variant="success" @click="toggleEdit">{{
            isEditing ? 'Salvar' : 'Editar'
          }}</b-button>
        </b-card>
      </b-col>

      <b-col md="4"> </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      uploadedImage: null,
      form: {
        name: '',
        email: '',
        avatarUrl: null,
      },
      isEditing: false,
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
  },
  methods: {
    toggleEdit() {
      if (this.isEditing) {
        this.updateUser(this.form)
        this.isEditing = false
      } else {
        this.form.name = this.user.name
        this.form.email = this.user.email
        this.form.avatarUrl = this.user.avatarUrl
        this.uploadedImage = { thumb: this.user.avatarUrl }
        this.isEditing = true
      }
    },
    async updateUser() {
      await this.$axios.$put('/api/auth/me', this.form)
      await this.$auth.fetchUser()
      this.isEditing = false
    },
    handleAvatarUpload(file) {
      if (file?.url) {
        this.form.avatarUrl = file.url
      }
    },
  },
}
</script>

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
            <b-input v-model="form.name" class="mt-2" placeholder="Nome" />
            <b-input
              v-model="form.email"
              class="mt-2"
              placeholder="Email"
              disabled
            />
          </div>
          <div v-else class="mt-4">
            <p class="m-2">Nome: {{ user.name }}</p>
            <p class="m-2">Email: {{ user.email }}</p>

            <h5>Matrix</h5>
            <p v-if="user.matrixId && !showChangeMxUser" class="m-2">
              Conta: {{ user.matrixId }}
            </p>
            <p v-if="!showChangeMxUser" class="m-2">
              Status: {{ isLoggedMatrix ? 'Conectado' : 'Desconectado' }}
            </p>

            <div v-if="showChangeMxUser">
              <b-input v-model="mxForm.matrixId" placeholder="Your matrix Id" />
              <b-input
                v-model="mxForm.password"
                placeholder="password"
                type="password"
              />
            </div>

            <b-btn
              v-if="isLoggedMatrix"
              :disabled="loading"
              @click="handleChangeMxAccount"
              >{{
                showChangeMxUser
                  ? 'Confirmar'
                  : 'Conectar com outra conta Matrix'
              }}</b-btn
            >
            <b-btn v-else to="/chat/index">Conectar com uma conta Matrix</b-btn>

            <b-btn v-if="isLoggedMatrix && !showChangeMxUser"
              >Remover conta</b-btn
            >
          </div>

          <b-button
            :disabled="loading"
            class="mt-4"
            block
            variant="success"
            @click="toggleEdit"
            >{{ isEditing ? 'Salvar' : 'Editar' }}</b-button
          >
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
      mxForm: {
        matrixId: '',
        password: '',
      },
      showChangeMxUser: false,
      isEditing: false,
      loading: false,
    }
  },
  computed: {
    user() {
      return this.$auth.user
    },
    isLoggedMatrix() {
      return this.$matrix?.client?.isLoggedIn()
    },
  },
  methods: {
    async handleChangeMxAccount() {
      if (this.showChangeMxUser) {
        await this.updateMxAccount()
        this.showChangeMxUser = false
      } else {
        this.showChangeMxUser = true
      }
    },
    async updateMxAccount() {
      this.loading = true
      // await this.$matrix.client.logout()
      await this.$matrix
        .loginExistentUser(
          this.mxForm.matrixId,
          this.mxForm.password,
          this.$axios
        )
        .catch(this.showError)
      await this.$auth.fetchUser()
      this.loading = false
    },
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

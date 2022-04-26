<template>
  <b-container fluid>
    <b-row>
      <b-col md="12" class="p-6">
        <b-card class="d-flex align-items-center">
          <h1>Meu Perfil</h1>
          <div class="d-flex justify-content-center">
            <b-avatar size="4rem" class="m-4" />
          </div>
          <div v-if="isEditing">
            <b-input v-model="form.name" placeholder="Nome" />
            <b-input v-model="form.email" placeholder="Email" />
          </div>
          <div v-else>
            <p>Nome: {{ user.name }}</p>
            <p>Email: {{ user.email }}</p>
          </div>
          <b-button @click="toggleEdit">{{
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
      form: {
        name: '',
        email: '',
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
        this.isEditing = true
        this.form.name = this.user.name
        this.form.email = this.user.email
      }
    },
    async updateUser() {
      await this.$axios.$put('/api/auth', this.form)
      await this.$auth.fetchUser()
      this.isEditing = false
    },
  },
}
</script>

<template>
  <div class="container login">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <b-spinner v-if="authenticating" label="Busy"></b-spinner>
        <div v-else-if="!$auth.loggedIn">
          <h2>Registrar</h2>
          <b-input required class="m-2" v-model="name" placeholder="Nome" />
          <b-input required class="m-2" v-model="email" placeholder="Email" />
          <b-input
            required
            class="m-2"
            v-model="password"
            placeholder="Senha"
            type="password"
          />
          <b-btn class="btn btn-primary" @click="localRegister">
            Confirmar
          </b-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'front',
  data() {
    return {
      authenticating: false,
      email: '',
      password: '',
      name: '',
    }
  },
  methods: {
    async localRegister() {
      try {
        await this.$axios.$post('api/auth/register', {
          email: this.email,
          password: this.password,
          name: this.name,
        })
        await this.$auth.loginWith('local', {
          data: {
            email: this.email,
            password: this.password,
          },
        })
      } catch (error) {
        this.showError(error)
      }
      this.authenticating = false
    },
  },
}
</script>

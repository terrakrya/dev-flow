<template>
  <div class="container login">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <b-spinner v-if="authenticating" label="Busy"></b-spinner>
        <div v-else-if="!$auth.loggedIn">
          <h2>Entrar</h2>
          <b-input class="m-4" placeholder="Email" v-model="username" />
          <b-input class="m-4" placeholder="Senha" v-model="password" />
          <b-btn class="btn btn-primary" @click="localLogin"> Entre </b-btn>
          <b-btn to="/register" class="btn btn-primary" @click="localLogin">
            Registrar
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
      username: '',
      password: '',
    }
  },
  methods: {
    async localLogin() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: {
            email: this.username,
            password: this.password,
          },
        })
        console.log('response', response)
        this.$router.push('/admin')
      } catch (error) {
        this.showError(error)
      }
      this.authenticating = false
    },
  },
}
</script>

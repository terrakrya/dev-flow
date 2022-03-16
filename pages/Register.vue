<template>
  <div class="container login">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <b-spinner v-if="authenticating" label="Busy"></b-spinner>
        <div v-else-if="!$auth.loggedIn">
          <b-input v-model="email" />
          <b-input v-model="password" />
          <b-btn class="btn btn-primary" @click="localRegister">
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
      email: '',
      password: '',
    }
  },
  methods: {
    async localRegister() {
      try {
        await this.$axios.$post('api/auth/register', {
          email: this.email,
          password: this.password,
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

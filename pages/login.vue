<template>
  <div class="container login">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <b-spinner v-if="authenticating" label="Busy"></b-spinner>
        <div v-else-if="!$auth.loggedIn">
          <b-form title="Entrar" @submit.prevent="localLogin">
            <b-input v-model="username" class="m-4" placeholder="Email" />
            <b-input
              v-model="password"
              class="m-4"
              placeholder="Senha"
              type="password"
            />
            <b-btn class="btn btn-primary" type="submit">Entrar</b-btn>
            <b-btn to="/register" class="btn btn-primary"> Registrar </b-btn>
          </b-form>
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
  created() {
    if (this.$auth.loggedIn) {
      this.$router.push('/admin')
    }
  },
  methods: {
    async localLogin() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            email: this.username,
            password: this.password,
          },
        })
        if (this.$store.state.organizationInvite) {
          this.$router.push(this.$store.state.organizationInvite)
          this.$store.commit('setOrganizationInvite', null)
        } else {
          this.$router.push('/admin')
        }
      } catch (error) {
        this.showError(error)
      }
      this.authenticating = false
    },
  },
}
</script>

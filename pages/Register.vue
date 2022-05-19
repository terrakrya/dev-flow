<template>
  <div class="container login">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <b-spinner v-if="authenticating" label="Busy"></b-spinner>
        <div v-else-if="!$auth.loggedIn">
          <h2>Registrar</h2>
          <b-input v-model="name" required class="m-2" placeholder="Nome" />
          <b-input v-model="email" required class="m-2" placeholder="Email" />
          <b-input
            v-model="password"
            required
            class="m-2"
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
        if (this.$store.state.organizationInvite) {
          this.$router.push(this.$store.state.organizationInvite)
          this.$store.commit('setOrganizationInvite', null)
        }
      } catch (error) {
        this.showError(error)
      }
      this.authenticating = false
    },
  },
}
</script>

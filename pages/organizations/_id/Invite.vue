<template>
  <div>
    <div
      class="d-flex flex-column justify-content-center align-items-center my-5 py-5"
    >
      <Logo class="m-4" />

      <h1>Convite</h1>
      <p>Você recebeu um convite para essa organização</p>
      <div v-if="!isLoggedIn" class="d-flex flex-column justify-content-center">
        <p class="text-muted">Entre ou crie uma conta para aceitar</p>
        <div class="d-flex justify-content-center">
          <b-button variant="success" to="/login">Login</b-button>
          <b-button to="/register">Registrar</b-button>
        </div>
      </div>
      <div v-else-if="alreadyJoinedOrg">
        <p class="text-muted">Você já está nessa organização</p>
        <b-button variant="success" @click="navigateToOrganization">
          Ver organização
        </b-button>
      </div>
      <div v-else>
        <b-button variant="success" @click="joinOrganization"
          >Entrar na Organização</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import find from 'lodash/find'

export default {
  layout: 'front',
  computed: {
    isLoggedIn() {
      return this.$auth?.user
    },
    organizationId() {
      return this.$route.params.id
    },
    alreadyJoinedOrg() {
      return find(this.$auth.user.organizations, ['id', this.organizationId])
    },
  },
  created() {
    if (!this.isLoggedIn) {
      this.$store.commit('setOrganizationInvite', this.$route.fullPath)
    }
  },
  methods: {
    async joinOrganization() {
      if (this.alreadyJoinedOrg) {
        return
      }
      const joinedOrg = await this.$axios.$post(
        `/api/organizations/${this.organizationId}/join`
      )
      await this.$auth.fetchUser()
      console.log('join', joinedOrg)
      this.$store.dispatch('setActiveOrganization', joinedOrg)
      this.$router.push('/organizations')
    },
    navigateToOrganization() {
      this.$store.dispatch('setActiveOrganization', this.alreadyJoinedOrg)
      this.$router.push(`/organizations`)
    },
  },
}
</script>

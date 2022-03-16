<template>
  <b-container fluid>
    <b-row>
      <b-col md="8">
        <h1>Organizações</h1>
        <ul>
          <li v-for="organization in organizations" :key="organization.id">
            {{ organization.name }}
            {{ organization.id }}

            <b-btn
              v-if="organization.id !== activeOrganization.id"
              @click="setOrganizationAsActive(organization)"
              >Ativar</b-btn
            >
            <b-btn v-else disabled>Ativa</b-btn>

            <b-btn @click="leaveOrganization(organization.id)"
              >Sair da Organização</b-btn
            >
          </li>
        </ul>
        <b-input v-model="newOrganization.name" placeholder="Nome" />
        <b-input
          v-model="newOrganization.description"
          placeholder="Descrição"
        />

        <b-btn @click="createOrganization">Criar Organização</b-btn></b-col
      >

      <b-col md="4">
        <b-input v-model="joinOrganizationLink" />
        <b-btn placeholder="Identifica" @click="joinOrganization"
          >Entrar em Organização por link</b-btn
        >
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      joinOrganizationLink: '',
      newOrganization: { name: '' },
    }
  },
  computed: {
    organizations() {
      return this.$auth.user.organizations || []
    },
    activeOrganization() {
      return this.$store.state.organization || []
    },
  },
  methods: {
    async createOrganization() {
      await this.$axios.$post('/api/organizations/new', {
        name: this.newOrganization.name,
      })
      await this.$auth.fetchUser()
    },
    async leaveOrganization(organizationId) {
      await this.$axios.$post(`/api/organizations/${organizationId}/leave`)
      await this.$auth.fetchUser()
    },
    async joinOrganization() {
      await this.$axios.$post(
        `/api/organizations/${this.joinOrganizationLink}/join`
      )
      await this.$auth.fetchUser()
    },
    setOrganizationAsActive(organization) {
      this.$store.dispatch('setActiveOrganization', organization)
    },
  },
}
</script>

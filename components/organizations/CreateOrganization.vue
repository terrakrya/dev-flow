<template>
  <div>
    <b-input v-model="newOrganization.name" placeholder="Nome" />

    <b-input v-model="newOrganization.description" placeholder="Descrição" />

    <b-btn @click="createOrganization">Criar Organização</b-btn>
    >
  </div>
</template>
<script>
export default {
  data() {
    return {
      newOrganization: {
        name: '',
        description: '',
      },
    }
  },
  methods: {
    async createOrganization() {
      await this.$axios.$post('/api/organizations/new', {
        name: this.newOrganization.name,
        description: this.newOrganization.description,
      })
      await this.$auth.fetchUser()
    },
  },
}
</script>

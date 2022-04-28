<template>
  <b-container fluid>
    <b-row>
      <b-col md="8">
        <div>
          <OrganizationInfo :organization="activeOrganization" />
        </div>
      </b-col>
      <b-col md="4">
        <OrganizationsList :organizations="organizations" />

        <b-btn variant="outline-success" class="m-4" v-b-modal.modal-add
          >Adicionar Organização</b-btn
        >
        <b-modal
          @ok="joinOrganization"
          id="modal-add"
          title="Adicionar Organização"
        >
          <b-input
            placeholder="ID da organização. Ex: 623219de495b346fae1d45ff"
            v-model="joinOrganizationLink"
          />
        </b-modal>
        <b-btn class="ml-4 mt-2" variant="outline-success" v-b-modal.modal-create>Criar Organização</b-btn>
        <b-modal
          @ok="createOrganization"
          id="modal-create"
          title="Criar Organização"
        >
          <b-input
            class="m-2"
            placeholder="Nome da Organização"
            v-model="newOrganization.name"
          />
          <b-input
            required
            class="m-2"
            placeholder="Descrição"
            v-model="newOrganization.description"
          />
        </b-modal>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      joinOrganizationLink: '',
      newOrganization: { name: '', description: '' },
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
    async leaveOrganization(organizationId) {
      if (this.organizations.length === 0) {
        return
      }
      await this.$axios.$post(`/api/organizations/${organizationId}/leave`)
      this.setOrganizationAsActive(this.organizations[0])
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
    createOrganization() {
      this.$axios
        .$post('/api/organizations/new', {
          name: this.newOrganization.name,
          description: this.newOrganization.description,
        })
        .then((created) => {
          this.$auth.fetchUser()

          this.setOrganizationAsActive(created)
          this.newOrganization.name = ''
          this.newOrganization.description = ''
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
}
</script>

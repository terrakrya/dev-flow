<template>
  <div>
    <b-card>
      <b-card-body>
        <b-row>
          <b-col md="3">
            <b-row class="d-flex p-4 justify-content-center align-items-center">
              <b-avatar size="8rem" />
            </b-row>
            <b-row>
              <b-button variant="success" to="/members" block>
                <b-icon-people />
                Ver Membros
              </b-button>
              <b-btn
                @click="leaveOrganization(organization.id)"
                block
                variant="danger"
              >
                Sair da organização
              </b-btn>
              <p class="mt-4">ID: {{ organization.id }}</p>
            </b-row>
          </b-col>
          <b-col md="8">
            <h1>{{ organization.name }}</h1>
            <p>{{ organization.description }}</p>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
export default {
  props: {
    organization: {
      type: Object,
      default: () => {},
    },
  },
  methods: {
    async leaveOrganization(organizationId) {
      await this.$axios.$post(`/api/organizations/${organizationId}/leave`)
      await this.$auth.fetchUser()
    },
  },
}
</script>

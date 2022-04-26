<template>
  <div class="organizations">
    <div class="organizations-list">
      <b-row>
        <b-col md="12">
          <h3>Outras Organizações</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-col>
            <b-card
              v-for="organization in otherOrganizations"
              :key="organization.id"
            >
              <b-card-body>
                <b-row>
                  <b-col md="8">
                    <h5>{{ organization.name }}</h5>
                    <p>{{ organization.description }}</p>
                  </b-col>
                  <b-col md="4">
                    <b-btn
                      @click="setOrganizationAsActive(organization)"
                      size="sm"
                      variant="outline-primary"
                    >
                      Selecionar
                    </b-btn>
                  </b-col>
                </b-row>
              </b-card-body>
            </b-card>
          </b-col>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    organizations: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    activeOrganization() {
      return this.$store.state.organization || []
    },
    otherOrganizations() {
      return this.organizations.filter((organization) => {
        return organization.id !== this.activeOrganization.id
      })
    },
  },
  methods: {
    setOrganizationAsActive(organization) {
      this.$store.dispatch('setActiveOrganization', organization)
    },
  },
}
</script>

<template>
  <div class="organizations">
    <div class="organizations-list">
      <b-row>
        <b-col md="12">
          <h3>Suas Organizações</h3>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12">
          <b-col>
            <b-list-group>
              <b-list-group-item
                v-for="organization in organizations"
                :key="organization.id"
                button
                :active="organization.id === activeOrganization.id"
                :disabled="organization.id === activeOrganization.id"
                @click="setOrganizationAsActive(organization)"
              >
                <b-row>
                  <b-col md="2">
                    <Avatar
                      :name="organization.name"
                      :src="organization.avatarUrl"
                      size="3rem"
                    />
                  </b-col>
                  <b-col
                    md="10"
                    class="d-flex align-items-center justify-content-between"
                  >
                    <h5>{{ organization.name }}</h5>
                    <div class="d-flex align-items-center">
                      <b-icon-person-fill />
                      <b-badge variant="primary" pill
                        >{{ organization.members.length }}
                      </b-badge>
                    </div>
                  </b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
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

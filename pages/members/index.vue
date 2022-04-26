<template>
  <b-container fluid>
    <b-row>
      <b-col md="8">
        <h1>Membros de {{ activeOrganization.name }}</h1>

        <!-- card components for each members of activeOrganization  -->
        <b-container class="d-flex justify-content-end">
          <b-card
            v-for="member in activeOrganization.members"
            :key="member.id"
            class="member-card m-2"
          >
            <b-card-body>
              <b-row>
                <b-col md="8">
                  <b-avatar class="m-2" />
                  <h5>{{ member.name }}</h5>
                  <p>{{ member.email }}</p>
                </b-col>
                <b-col md="4">
                  <b-btn variant="outline-primary" size="sm">
                    <b-icon-user-edit />
                    ver mais
                  </b-btn>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-container>
      </b-col>
      <b-col md="4"> </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  computed: {
    activeOrganization() {
      return this.$store.state.organization || {}
    },
  },
}
</script>
<style>
.member-card {
  width: 400px;
}
</style>

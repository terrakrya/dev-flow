<template>
  <b-container fluid>
    <b-row>
      <b-col md="8">
        <h1>Integrantes de {{ activeOrganization.name }}</h1>

        <!-- card components for each members of activeOrganization  -->
        <b-container class="d-flex justify-content-end">
          <b-card
            v-for="member in activeOrganization.members"
            :key="member.id"
            class="member-card m-2"
          >
            <b-card-body>
              <div
                class="
                  d-flex
                  flex-column
                  justify-content-center
                  align-items-center
                "
              >
                <Avatar
                  class="mb-2"
                  :src="member.avatarUrl"
                  :name="member.name"
                />
                <h3>{{ member.name }}</h3>
                <p>{{ member.email }}</p>
                <b-btn variant="outline-primary" size="sm" block>
                  ver mais
                </b-btn>
              </div>
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

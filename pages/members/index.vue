<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <b-row>
          <b-col
            v-for="member in activeOrganization.members"
            :key="member.id"
            class="member-card m-2"
            md="3"
          >
            <b-card>
              <b-card-body>
                <div>
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
          </b-col>
        </b-row>
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
  created() {
    this.$store.dispatch('loadOrganization')
  },
}
</script>
<style>
.card {
  width: 100%;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-body {
  flex-grow: 1;
}
</style>

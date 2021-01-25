<template>
  <b-card v-if="members" class="mb-3">
    <b-card-title>
      <span class="title">Membros</span>
    </b-card-title>
    <div>
      <b-avatar
        v-for="member in members"
        :key="member.id"
        :src="member.avatar_url"
        class="mr-1"
      />
    </div>
  </b-card>
</template>
<script>
export default {
  computed: {
    members() {
      return this.$store.state.members
    },
  },
  created() {
    this.octokit.orgs
      .listMembers({
        org: this.org,
      })
      .then((resp) => {
        this.$store.commit('setMembers', resp.data)
      })
  },
}
</script>

<template>
  <div class="admin">
    <Header />
    <div class="main">
      <Organization />
      <Nav />
      <Nuxt />
    </div>
  </div>
</template>
<script>
import Header from '~/components/Header.vue'
export default {
  components: { Header },
  middleware: 'auth',
  created() {
    if (this.$auth.loggedIn) {
      this.octokit.repos
        .listForOrg({
          org: this.org,
        })
        .then((resp) => {
          this.$store.commit('setRepositories', resp.data.reverse())
        })

      this.octokit.orgs
        .get({
          org: this.org,
        })
        .then((res) => {
          this.$store.commit('setOrganization', res.data)
        })

      this.octokit.orgs
        .listMembers({
          org: this.org,
        })
        .then((resp) => {
          this.$store.commit('setMembers', resp.data)
        })
      this.$store.dispatch('loadProjects')
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
}
</script>

<template>
  <div class="admin">
    <Header />
    <div class="main">
      <Nav />
      <Nuxt />
      <!-- dummy div to help scroll page to bottom when needed-->
      <Onboarding />
      <div id="dummy-page-bottom" />
    </div>
  </div>
</template>
<script>
import Header from '~/components/Header.vue'
export default {
  components: { Header },
  middleware: 'auth',
  created() {
    if (this.$auth.loggedIn && !this.$store.state.organization) {
      this.$store.dispatch('activateDefaultOrganization')
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
}
</script>

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
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
}
</script>

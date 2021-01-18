<template>
  <div class="admin">
    <Nuxt />
  </div>
</template>
<script>
export default {
  middleware: 'auth',
  methods: {
    logout() {
      this.$auth.logout()
    },
  },
}
</script>

<template>
  <div class="container login">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <b-spinner v-if="authenticating" label="Busy"></b-spinner>
        <a
          v-else-if="!$auth.loggedIn"
          class="btn btn-primary"
          href="/api/auth/github"
        >
          <b-icon-github /> Entre com GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'front',
  data() {
    return {
      authenticating: true,
    }
  },
  async created() {
    await this.$auth
      .loginWith('local', {
        user: 'user',
        pass: 'github',
      })
      .catch(() => {})
    this.authenticating = false
  },
}
</script>

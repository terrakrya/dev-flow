<template>
  <div class="container login">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <a class="btn btn-primary" href="/api/auth/github">
          <b-icon-github /> Entre com GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async created() {
    try {
      const user = await this.$auth.loginWith('local', {
        user: 'user',
        pass: 'github',
      })
      console.log(user)
      console.log(this.$auth.loggedIn)
      console.log(this.$auth.user)
    } catch (error) {
      console.log(error)
    }
  },
  methods: {
    login() {
      this.$auth.loginWith('github')
    },
  },
}
</script>

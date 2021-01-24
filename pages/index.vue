<template>
  <div class="container login">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <a class="btn btn-primary" @click="login">
          <b-icon-github /> Entre com GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      console.log(this.$auth)
      // this.$auth.loginWith('github')
    }
  }
}
</script>

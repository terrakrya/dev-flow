<template>
  <div class="container">
    <div>
      <Logo />
      <h4><small>by</small> Terrakrya</h4>
      <div class="mt-4">
        <a class="btn btn-primary" @click="$auth.loginWith('github')">
          <b-icon-github /> Entre com GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="sass" scoped>
.container
  margin: 0 auto
  min-height: 100vh
  display: flex
  justify-content: center
  align-items: center
  text-align: center
  .logo
    max-height: 150px
</style>

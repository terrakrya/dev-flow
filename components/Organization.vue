<template>
  <b-container v-if="organization" fluid>
    <div class="mt-1 ml-4 d-flex justify-content-start relative">
      <Logo class="logo-top" />
      <Avatar
        :src="organization.avatarUrl"
        :name="organization.name"
        size="62px"
        class="mr-3 ml-5"
      />
      <div>
        <h3>{{ organization.name }}</h3>
        <p :class="{ hide: !organization.description }">
          {{ organization.description || 'descrição' }}
        </p>
      </div>
    </div>
  </b-container>
</template>
<script>
export default {
  computed: {
    organization() {
      return this.$store.state.organization
    },
  },
}
</script>
<style>
.logo-top {
  position: absolute;
  bottom: 20px;
  left: -30px;
  height: auto;
  z-index: 0;
  opacity: 0.9;
}
.navbar-brand {
  margin-bottom: -16px;
}
.hide {
  visibility: hidden;
}
</style>

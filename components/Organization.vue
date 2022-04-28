<template>
  <b-container v-if="organization" fluid>
    <div class="mt-4 ml-4 d-flex justify-content-start">
      <Avatar
        :src="organization.avatarUrl"
        :name="organization.name"
        class="logo mr-3"
      />
      <div>
        <h3>{{ organization.name }}</h3>
        <p>{{ organization.description }}</p>
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

<template>
  <b-container v-if="organization" fluid>
    <div class="mt-4">
      <b-img
        left
        :src="organization.avatar_url"
        class="logo mr-3"
        :alt="organization.name"
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

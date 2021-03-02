<!-- eslint-disable vue/no-v-html -->
<template>
  <n-link v-if="member" :to="'/members/' + member.id">
    <b-avatar
      :src="member.avatar_url"
      class="ml-1"
      size="2rem"
      :alt="member.name"
    />
  </n-link>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  computed: {
    member() {
      return this.members.find((member) => member.id.toString() === this.id)
    },
    members() {
      return this.$store.state.members
    },
  },
}
</script>

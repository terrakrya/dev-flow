<!-- eslint-disable vue/no-v-html -->
<template>
  <b-avatar
    v-if="member"
    :src="member.avatar_url"
    class="mr-1"
    size="2rem"
    :alt="member.name"
  />
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

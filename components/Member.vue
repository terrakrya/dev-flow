<!-- eslint-disable vue/no-v-html -->
<template>
  <b-avatar
    v-if="member"
    :src="avatarSrc"
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
      return this.$store.state.organization?.members
    },
    avatarSrc() {
      if (!this.member.avatarUrl) {
        return null
      }
      return `${process.env.DEFAULT_STORAGE_BUCKET_FULL_URL}${this.member.avatarUrl}`
    },
  },
}
</script>

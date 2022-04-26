<template>
  <b-card v-if="members" class="mb-3">
    <b-card-title>
      <span class="title">Membros</span>
    </b-card-title>
    <div>
      <Avatar
        v-for="member in members"
        :key="member.id"
        :src="member.avatarUrl"
        :name="member.name"
        class="mr-1"
        size="3rem"
      />
    </div>
  </b-card>
</template>
<script>
export default {
  computed: {
    members() {
      return this.$store.state.organization?.members || []
    },
  },
}
</script>

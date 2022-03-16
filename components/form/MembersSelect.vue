<template>
  <div class="members-select">
    <a v-for="member in members" :key="member.id" @click="select(member)">
      <b-avatar
        :src="member.avatar_url"
        class="mr-1"
        :class="{ inactive: !value.includes(member.id.toString()) }"
      />
    </a>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    members() {
      return this.$store.state.organization?.members || []
    },
  },
  methods: {
    select(member) {
      const id = member.id.toString()
      if (this.value.includes(id)) {
        this.$emit(
          'input',
          this.value.filter((m) => m !== id)
        )
      } else {
        this.$emit('input', [...this.value, id])
      }
    },
  },
}
</script>

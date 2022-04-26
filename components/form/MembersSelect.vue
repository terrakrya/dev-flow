<template>
  <div class="members-select">
    <a v-for="(member, key) in members" :key="key" @click="select(member)">
      <Avatar
        :src="member.avatarUrl"
        :name="member.name"
        class="mr-1"
        :class="{ inactive: !value.includes(getMemberId(member)) }"
      />
      {{ member.name || member.email }}
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
    getMemberId(member) {
      // In case the members come as string instead the whole object (should not happen)
      let id
      if (typeof member === 'string') {
        id = member
      } else if (typeof member === 'object') {
        id = member.id
      }
      return id
    },
    select(member) {
      const id = this.getMemberId(member)
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

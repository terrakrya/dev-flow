<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="rounded px-3 pt-3 pb-2 border border-white">
    <div class="d-flex justify-content-between">
      <p v-if="card.note" v-html="$md.render(card.note)"></p>
      <Member v-for="member in card.members" :id="member" :key="member" />
    </div>
    <div>
      <n-link v-if="multiple" :to="`/projects/${card.project._id}`">
        <b-badge variant="secondary">{{ card.project.name }}</b-badge>
      </n-link>
    </div>
    <div class="flex mt-4 justify-between items-center">
      <span class="text-sm text-gray-600">{{ card.id }}</span>
    </div>
  </div>
</template>
<script>
import Member from './Member.vue'
export default {
  components: { Member },
  props: {
    card: {
      type: Object,
      default: () => ({}),
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    members() {
      return this.$store.state.members
    },
  },
}
</script>

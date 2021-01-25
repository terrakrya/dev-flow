<template>
  <div class="rounded px-3 pt-3 pb-2 border border-white">
    <div class="d-flex justify-content-between">
      <p v-if="card.note" v-html="$md.render(card.note)"></p>
      <b-avatar
        :src="card.creator.avatar_url"
        class="ml-1"
        size="2rem"
        :alt="card.creator.name"
      />
    </div>
    <div class="flex mt-4 justify-between items-center">
      <span class="text-sm text-gray-600">{{ card.date }}</span>
      <badge v-if="card.type" :color="badgeColor">{{ card.type }}</badge>
    </div>
  </div>
</template>
<script>
import Badge from './Badge.vue'
export default {
  components: {
    Badge,
  },
  props: {
    card: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    badgeColor() {
      const mappings = {
        Design: 'purple',
        'Feature Request': 'teal',
        Backend: 'blue',
        QA: 'green',
        default: 'teal',
      }
      return mappings[this.card.type] || mappings.default
    },
  },
}
</script>

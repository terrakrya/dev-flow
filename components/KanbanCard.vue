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
      <span class="text-sm text-gray-600">{{ card.description }}</span>
      <n-link :to="`/projects/${card.project_id}`">
        <b-badge v-if="multiple" variant="secondary">{{
          card.project_name
        }}</b-badge>
      </n-link>
    </div>
  </div>
</template>
<script>
export default {
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

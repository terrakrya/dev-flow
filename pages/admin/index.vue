<template>
  <b-container fluid>
    <b-row>
      <b-col md="8">
        <div class="kanban">
          <div class="bg-dark rounded-lg p-3 column w-100">
            <p
              class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
            >
              <strong>Meus cartões ativos</strong>
            </p>
            <kanban-card
              v-for="card in cards"
              :key="card.id"
              :card="card"
              class="mt-3 cursor-move"
              multiple
              @change="loadCards"
            ></kanban-card>
          </div>
        </div>
      </b-col>
      <b-col md="4">
        <Sidebar />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      cards: [],
    }
  },
  created() {
    this.loadCards()
  },
  methods: {
    async loadCards() {
      const activeOrganizationId = this.$store.state.organization?.id
      this.cards = await this.$axios.$get(
        `/api/cards/my?organization=${activeOrganizationId}`
      )
    },
  },
}
</script>

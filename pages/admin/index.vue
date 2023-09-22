<template>
  <b-container fluid>
    <b-row v-if="cards">
      <b-col lg="2">
        <Sidebar />
      </b-col>
      <b-col lg="5">
        <div class="kanban mb-3">
          <div class="bg-dark rounded-lg p-3 column w-100">
            <p
              class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
            >
              <strong>Minha fila</strong>
            </p>
            <kanban-card
              v-for="card in cards.backlog"
              :key="card.id"
              :card="card"
              class="mt-3 cursor-move"
              multiple
              @change="loadCards"
            ></kanban-card>
            <div
              v-if="!cards.backlog || !cards.backlog.length"
              class="text-center mt-3"
            >
              <p><small>Nenhum item na fila</small></p>
            </div>
          </div>
        </div>
      </b-col>
      <b-col lg="5">
        <div class="kanban mb-3">
          <div class="bg-dark rounded-lg p-3 column w-100">
            <p
              class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
            >
              <strong>Meus ativos</strong>
            </p>
            <kanban-card
              v-for="card in cards.active"
              :key="card.id"
              :card="card"
              class="mt-3 cursor-move"
              multiple
              @change="loadCards"
            ></kanban-card>
            <div
              v-if="!cards.backlog || !cards.backlog.length"
              class="text-center mt-3"
            >
              <p><small>Nenhum item ativo</small></p>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      cards: null,
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

<template>
  <div>
    <div class="d-flex justify-content-center">
      <div class="min-h-screen d-flex overflow-x-scroll py-3 kanban">
        <div
          v-for="(column, column_id) in columnsWithCards"
          :key="column.name"
          class="bg-dark rounded-lg p-3 mr-1 column"
        >
          <p
            class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
          >
            <strong> {{ column.name }}</strong>
          </p>

          <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
          <draggable
            :id="column_id"
            :animation="200"
            ghost-class="ghost-card"
            group="cards"
            @end="
              (event) => {
                cardMoved(event)
              }
            "
          >
            <kanban-card
              v-for="card in column.cards"
              :key="card.id"
              :card="card"
              class="mb-3 cursor-move"
              :multiple="multiple"
              @change="cardChanged"
            ></kanban-card>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import columns from '@/content/columns.json'
import KanbanCard from './KanbanCard.vue'

export default {
  components: {
    KanbanCard,
    draggable,
  },
  props: {
    cards: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns,
    }
  },
  computed: {
    columnsWithCards() {
      const cols = { ...columns }
      for (const cid of Object.keys(cols)) {
        cols[cid].cards = this.cards.filter((card) =>
          cols[cid].status.find((status) => status.id === card.status)
        )
      }
      return cols
    },
  },
  methods: {
    cardChanged(card) {
      this.$emit('change', card)
    },
    async cardMoved(event) {
      // pega o card
      let card = this.cards.find((c) => c.id === event.item.id)

      // se o card foi movido pra uma coluna diferente da atual altera o status
      if (
        !columns[event.to.id].status.find((status) => status.id === card.status)
      ) {
        card = await this.$axios
          .$put('/api/cards/' + card._id, {
            status: columns[event.to.id].status[0].id,
          })
          .catch(this.showError)
        // se o card foi movido para a mesma coluna reordena coluna
      }

      // roda nos filhos da coluna e pega os ids/ordem
      const cardsToReorder = []
      event.to.children.forEach((child, order) => {
        cardsToReorder.push({ id: child.id, order })
      })

      // passa a lista de id + order de cada card pra ser reordenado na api
      await this.$axios
        .$put('/api/cards/reorder', {
          cards: cardsToReorder,
        })
        .catch(this.showError)

      this.$emit('change', card)
    },
  },
}
</script>

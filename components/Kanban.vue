<template>
  <div>
    <div class="d-flex justify-content-center">
      <div class="min-h-screen d-flex overflow-x-scroll py-3 kanban">
        <div
          v-for="(column, column_id) in columnsWithCards"
          :key="column.name"
          class="bg-dark rounded-lg px-3 pt-2 pb-3 mr-1 column"
        >
          <p
            class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
          >
            <strong>{{ column.name }}</strong>
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
              class="mt-3 cursor-move"
              :multiple="multiple"
              @change="cardChanged"
              @nextstatus="nextStatus"
            ></kanban-card>
          </draggable>
        </div>
      </div>
    </div>
    <pre>{{ columnsWithCards }} </pre>
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
    statusList() {
      const statusList = []
      Object.keys(columns).forEach((cid) => {
        columns[cid].status.forEach((status) => {
          statusList.push(status.id)
        })
      })
      return statusList
    },
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
      let card = this.cards.find((c) => c.id === event.item.id)
      if (
        !columns[event.to.id].status.find((status) => status === card.status)
      ) {
        card = await this.$axios
          .$put('/api/cards/' + card._id, {
            status: columns[event.to.id].status[0].id,
          })
          .catch(this.showError)
      }
      this.$emit('change', card)
    },
    async nextStatus(card) {
      console.log(card.status)
      console.log(this.statusList)
      const statusIndex = this.statusList.indexOf(card.status)
      console.log(statusIndex)
      console.log(this.statusList[statusIndex + 1])
      await this.$axios
        .$put('/api/cards/' + card._id, {
          status: this.statusList[statusIndex + 1],
        })
        .catch(this.showError)
      this.$emit('change', card)
    },
  },
}
</script>

<template>
  <div>
    <div class="d-flex justify-content-center">
      <div class="min-h-screen d-flex overflow-x-scroll py-3 kanban">
        <div
          v-for="column in columns"
          :key="column.name"
          class="bg-dark rounded-lg px-3 pt-2 pb-3 column-width mr-1 column"
        >
          <p
            class="text-gray-700 font-semibold font-sans tracking-wide text-sm"
          >
            <strong>{{ column.name }} s{{ column.id }}</strong>
          </p>
          <!-- Draggable component comes from vuedraggable. It provides drag & drop functionality -->
          <draggable
            :list="column.cards"
            :animation="200"
            ghost-class="ghost-card"
            group="cards"
            @change="
              (item) => {
                cardChanged(item, column.name)
              }
            "
          >
            <!-- Each element from here will be draggable and animated. Note :key is very important here to be unique both for draggable and animations to be smooth & consistent. -->
            <kanban-card
              v-for="card in column.cards"
              :key="card.id"
              :card="card"
              class="mt-3 cursor-move"
              :multiple="multiple"
            ></kanban-card>
            <!-- </transition-group> -->
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import KanbanCard from './KanbanCard.vue'
export default {
  components: {
    KanbanCard,
    draggable,
  },
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    cardChanged(action, columnName) {
      const card = action.added || action.moved
      if (card) {
        const column = this.columns.find((column) => {
          return (
            column.name === columnName &&
            column.project_url.endsWith(card.element.project_id)
          )
        })
        this.octokit.projects
          .moveCard({
            position:
              card.newIndex === 0 ? 'top' : 'after:' + (card.newIndex - 1),
            card_id: card.element.id,
            column_id: column.id,
          })
          .then((resp) => {
            // this.$store.dispatch('loadProjects')
          })
      }
    },
  },
}
</script>

<style lang="sass" scoped>
.column-width
  min-width: 320px
  width: 320px
.ghost-card
  opacity: 0.5
  background: #f7fafc
  border: 1px solid #4299e1
.kanban
  .column > div
    min-height: calc(100% - 16px)
</style>

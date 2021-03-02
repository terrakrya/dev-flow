<template>
  <div>
    <div class="d-flex justify-content-center">
      <div class="min-h-screen d-flex overflow-x-scroll py-3 kanban">
        <div
          v-for="column in columns"
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
            :list="columnCards(column)"
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
              v-for="card in columnCards(column)"
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
      columns: {
        backlog: {
          name: 'Fila',
          status: [
            {
              id: 'waiting',
              name: 'Aguardando',
            },
          ],
        },
        dev: {
          name: 'Desenvolvimento',
          status: [
            {
              id: 'ready_to_dev',
              name: 'Pronto para desenvolver',
            },
            {
              id: 'developing',
              name: 'Em desenvolvimento',
            },
          ],
        },
        test: {
          name: 'Teste',
          status: [
            {
              id: 'ready_to_test',
              name: 'Pronto para testar',
            },
            {
              id: 'testing',
              name: 'Testando',
            },
          ],
        },
        prod: {
          name: 'Produção',
          status: [
            {
              id: 'ready_to_prod',
              name: 'Pronto para publicar',
            },
            {
              id: 'published',
              name: 'Em produção',
            },
          ],
        },
      },
    }
  },
  methods: {
    columnCards(column) {
      return this.cards.filter((card) => {
        return column.status.find((status) => status.id === card.status)
      })
    },
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
.ghost-card
  opacity: 0.5
  background: #f7fafc
  border: 1px solid #4299e1
.kanban
  width: 100%
  .column
    min-width: 320px
    width: 25%
    & > div
      min-height: calc(100% - 16px)
</style>

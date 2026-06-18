<template>
  <div>
    <div class="kanban-filters bg-dark rounded-lg p-3 mb-3">
      <b-row class="align-items-center">
        <b-col sm="12" md="4" class="mb-2 mb-md-0">
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon-person />
            </b-input-group-prepend>
            <b-form-select
              v-model="selected_member"
              :options="memberFilterOptions"
            />
          </b-input-group>
        </b-col>
        <b-col sm="12" md="4" class="mb-2 mb-md-0">
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon-funnel />
            </b-input-group-prepend>
            <b-form-select
              v-model="selected_status"
              :options="statusFilterOptions"
            />
          </b-input-group>
        </b-col>
        <b-col sm="12" md="4" class="mb-2 mb-md-0">
          <b-input-group>
            <b-input-group-prepend is-text>
              <b-icon-tags />
            </b-input-group-prepend>
            <b-form-select v-model="selected_tag" :options="tagFilterOptions" />
          </b-input-group>
        </b-col>
      </b-row>
      <b-row v-if="hasActiveFilters" class="align-items-center mt-2">
        <b-col>
          <small class="text-muted">
            Exibindo {{ filteredCards.length }} de {{ cards.length }} cartões
          </small>
        </b-col>
        <b-col class="text-right">
          <b-btn variant="outline-secondary" size="sm" @click="clearFilters">
            <b-icon-x-circle class="mr-1" /> Limpar
          </b-btn>
        </b-col>
      </b-row>
    </div>
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
import forEach from 'lodash/forEach'
import columns from '@/content/columns.json'

export default {
  components: {
    draggable,
  },
  props: {
    cards: {
      type: Array,
      default: () => [],
    },
    project: {
      type: Object,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns,
      selected_member: '',
      selected_status: '',
      selected_tag: '',
    }
  },
  computed: {
    members() {
      return this.$store.state.organization?.members || []
    },
    memberFilterOptions() {
      const options = [
        { value: '', text: 'Todos os membros' },
        { value: 'me', text: 'Meus cartões' },
      ]
      for (const member of this.members) {
        options.push({
          value: member.id?.toString(),
          text: member.name || member.email,
        })
      }
      return options
    },
    statusFilterOptions() {
      const options = [{ value: '', text: 'Todos os status' }]
      Object.keys(columns).forEach((cid) => {
        columns[cid].status.forEach((status) => {
          options.push({ value: status.id, text: status.name })
        })
      })
      return options
    },
    tagFilterOptions() {
      const tagSet = new Set()
      if (this.project?.tags) {
        this.project.tags.forEach((tag) => tagSet.add(tag))
      }
      this.cards.forEach((card) => {
        card.tags?.forEach((tag) => tagSet.add(tag))
      })
      const options = [{ value: '', text: 'Todas as tags' }]
      Array.from(tagSet)
        .sort()
        .forEach((tag) => {
          options.push({ value: tag, text: `${tag}` })
        })
      return options
    },
    hasActiveFilters() {
      return Boolean(
        this.selected_member || this.selected_status || this.selected_tag
      )
    },
    filteredCards() {
      return this.cards.filter(
        (card) =>
          this.matchesMemberFilter(card) &&
          this.matchesStatusFilter(card) &&
          this.matchesTagFilter(card)
      )
    },
    columnsWithCards() {
      const cols = { ...columns }
      for (const cid of Object.keys(cols)) {
        cols[cid].cards = this.filteredCards.filter((card) =>
          cols[cid].status.find((status) => status.id === card.status)
        )
      }
      return cols
    },
  },
  methods: {
    matchesMemberFilter(card) {
      if (!this.selected_member) {
        return true
      }
      const userId =
        this.selected_member === 'me'
          ? this.$auth.user?.id?.toString()
          : this.selected_member
      if (!userId) {
        return true
      }
      return card.members?.some((member) => {
        const memberId =
          typeof member === 'object' ? member._id || member.id : member
        return memberId?.toString() === userId
      })
    },
    matchesStatusFilter(card) {
      if (!this.selected_status) {
        return true
      }
      return card.status === this.selected_status
    },
    matchesTagFilter(card) {
      if (!this.selected_tag) {
        return true
      }
      return card.tags?.includes(this.selected_tag)
    },
    clearFilters() {
      this.selected_member = ''
      this.selected_status = ''
      this.selected_tag = ''
    },
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
      forEach(event.to.children, (child, order) => {
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

<style scoped>
.kanban-filters .input-group-text {
  background-color: #21262d;
  border-color: #30363d;
  color: #8b949e;
}

.kanban-filters .custom-select {
  background-color: #0d1117;
  border-color: #30363d;
  color: #c9d1d9;
}
</style>

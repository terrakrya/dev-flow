<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    :id="card.id"
    class="rounded p-3 border kanban-card"
    @click.self="show_card_form = true"
    @dblclick="show_card_form = true"
  >
    <div>
      <div class="d-flex justify-content-between items-center mb-3">
        <div>
          <Member v-for="member in card.members" :id="member" :key="member" />
        </div>
        <div>
          <n-link v-if="multiple" :to="`/projects/${card.project._id}`">
            <b-badge
              variant="secondary"
              :style="`background-color: ${card.project.color} !important`"
              >{{ card.project.name }}</b-badge
            >
          </n-link>
        </div>
      </div>
      <a
        v-if="card.note"
        @click="show_card_form = true"
        v-html="$md.render(card.note)"
      ></a>
    </div>
    <div class="d-flex justify-content-between items-center">
      <div>
        <b-btn
          variant="outline"
          size="sm"
          @click="show_comments = !show_comments"
        >
          <b-icon-chat />
          <span v-if="comments.length">{{ comments.length }}</span>
        </b-btn>
      </div>
      <div>
        <a @click="show_card_form = true">
          <small>{{
            statusList.find((status) => card.status == status.id).name
          }}</small>
        </a>
        <b-btn
          v-if="['ready_to_dev', 'ready_to_test'].includes(card.status)"
          size="sm"
          variant="outline"
          title="Iniciar"
          @click="nextStatus(card)"
        >
          <b-icon-play-circle />
        </b-btn>
        <b-btn
          v-if="
            ['developing', 'testing', 'ready_to_prod'].includes(card.status)
          "
          size="sm"
          variant="success"
          title="Finalizar"
          @click="nextStatus(card)"
        >
          <b-icon-check-circle />
        </b-btn>
      </div>
    </div>
    <div class="pt-1">
      <Comments v-if="show_comments" :target="target" @change="commentSaved" />
    </div>
    <b-modal v-model="show_card_form" title="Editar cartão" hide-footer>
      <card-form :project="card.project" :edit="card" @change="cardChanged" />
    </b-modal>
  </div>
</template>
<script>
import columns from '@/content/columns.json'
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
  data() {
    return {
      target: `card-${this.card.id}`,
      show_comments: false,
      show_card_form: false,
      comments: [],
    }
  },
  computed: {
    members() {
      return this.$store.state.members
    },
    statusList() {
      const statusList = []
      Object.keys(columns).forEach((cid) => {
        columns[cid].status.forEach((status) => {
          statusList.push(status)
        })
      })
      return statusList
    },
  },
  async created() {
    this.comments = await this.$axios.$get('/api/comments', {
      params: { target: this.target },
    })
  },
  methods: {
    cardChanged(card) {
      this.show_card_form = false
      this.$emit('change', card)
    },
    async nextStatus(card) {
      const statusIndex = this.statusList
        .map((status) => status.id)
        .indexOf(card.status)
      await this.$axios
        .$put('/api/cards/' + card._id, {
          status: this.statusList[statusIndex + 1].id,
        })
        .catch(this.showError)
      this.$emit('change', card)
    },
    commentSaved(comment) {
      this.comments.push(comment)
    },
  },
}
</script>

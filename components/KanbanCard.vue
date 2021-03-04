<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    :id="card.id"
    class="rounded p-3 border kanban-card"
    @click.self="show_card_form = true"
    @dblclick="show_card_form = true"
  >
    <div>
      <n-link v-if="multiple" :to="`/projects/${card.project._id}`">
        <b-badge
          variant="secondary"
          :style="`background-color: ${card.project.color} !important`"
          >{{ card.project.name }}</b-badge
        >
      </n-link>
      <a
        v-if="card.note"
        @click="show_card_form = true"
        v-html="$md.render(card.note)"
      ></a>
    </div>
    <div class="d-flex justify-content-between items-center">
      <div>
        <Member v-for="member in card.members" :id="member" :key="member" />
      </div>
      <div>
        <a @click="show_card_form = true">
          {{ statusList.find((status) => card.status == status.id).name }}
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
    <b-modal v-model="show_card_form" title="Editar cartão" hide-footer>
      <card-form :project="card.project" :edit="card" @change="cardChanged" />
    </b-modal>
  </div>
</template>
<script>
import columns from '@/content/columns.json'
import Member from './Member.vue'
export default {
  components: { Member },
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
      show_card_form: false,
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
  },
}
</script>

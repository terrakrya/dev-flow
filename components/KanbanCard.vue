<!-- eslint-disable vue/no-v-html -->
<template>
  <div :id="card.id" class="rounded p-3 border kanban-card" @dblclick="open()">
    <div class="dateBadge">
      <h5>
        <b-badge
          v-if="cardDueDate"
          :variant="
            timeToDueDate > 0
              ? 'danger'
              : warningDaysInMili * -1 < timeToDueDate
              ? 'warning'
              : ''
          "
        >
          {{ cardDueDate }}</b-badge
        >
      </h5>
    </div>
    <div class="pointer" @click="open()">
      <div v-if="cardTitle" class="text-white mb-2" style="font-size: 16px">
        {{ cardTitle }}
      </div>
      <div class="d-flex justify-content-end items-center mb-3">
        <div class="text-right">
          <Member v-for="member in members" :id="member" :key="member" />
        </div>
      </div>
    </div>
    <hr />
    <div class="d-flex justify-content-between align-items-center">
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

      <div class="text-right">
        <div v-if="multiple" class="mb-2">
          <n-link :to="`/projects/${card.project._id}`">
            <b-badge
              variant="secondary"
              :style="`background-color: ${card.project.color} !important; font-size: 11px`"
              >{{ card.project.name }}</b-badge
            >
          </n-link>
        </div>
        <div>
          <div v-if="card.status === 'backlog'">
            <div v-if="card.reviewed">
              <b-badge variant="success">Revisado</b-badge>
            </div>
            <div v-else>
              <small>Aguardando revisão</small>
            </div>
          </div>
          <div v-else>
            <a @click="open()">
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
      </div>
    </div>
    <div v-if="show_next_status && card.status === 'developing'" class="pt-3">
      <b-form-group label="Como testar essa funcionalidade?">
        <b-textarea v-model="test_instructions" rows="5"></b-textarea>
      </b-form-group>
      <b-btn variant="success" block @click="nextStatus(card)"
        ><b-icon-check-circle /> Finalizar</b-btn
      >
    </div>
    <div class="pt-1">
      <Comments v-if="show_comments" :target="target" @change="commentSaved" />
    </div>
    <b-modal
      :visible="showCard"
      title="Editar cartão"
      hide-footer
      size="lg"
      @hide="close"
    >
      <form-card-form
        :project="card.project"
        :edit="card"
        @change="cardChanged"
      />
    </b-modal>
    <h5 class="estimateBadge">
      <b-badge v-if="card.time_estimate" variant="info">
        {{ card.time_estimate }}
      </b-badge>
    </h5>
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
      show_next_status: false,
      test_instructions: this.card.test_instructions,
      comments: [],
    }
  },
  computed: {
    cardTitle() {
      return (this.card.title || this.card.note).replace(/(<([^>]+)>)/gi, '')
    },
    warningDaysInMili() {
      return 3 * 24 * 60 * 60 * 1000
    },
    timeToDueDate() {
      const today = new Date().getTime()
      const dueDate = new Date(this.card.due_date).getTime()
      return today - dueDate
    },
    cardDueDate() {
      // return formated date like dd/mm from this.card.due_date
      return this.card.due_date
        ? new Date(this.card.due_date).toLocaleDateString()
        : null
    },
    showCard() {
      return this.$route.query.card && this.$route.query.card === this.card.id
    },
    members() {
      return this.card.members
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
    // this.comments = await this.$axios.$get('/api/comments', {
    //   params: { target: this.target },
    // })
  },
  methods: {
    cardChanged(card) {
      this.close()
      this.$emit('change', card)
    },
    async nextStatus(card) {
      if (
        card.status === 'developing' &&
        !card.test_instructions &&
        !this.show_next_status
      ) {
        this.show_next_status = true
      } else {
        const statusIndex = this.statusList
          .map((status) => status.id)
          .indexOf(card.status)
        const members = card.members
        if (
          card.status.startsWith('ready_to_') &&
          !members.find((member) => member === this.$auth.user.id.toString())
        ) {
          members.push(this.$auth.user.id.toString())
        }
        await this.$axios
          .$put('/api/cards/' + card._id, {
            status: this.statusList[statusIndex + 1].id,
            test_instructions: this.test_instructions,
            members,
          })
          .catch(this.showError)
        this.$emit('change', card)
      }
    },
    commentSaved(comment) {
      this.comments.push(comment)
    },
    open() {
      this.$router.push(this.$route.path + '?card=' + this.card.id)
    },
    close() {
      this.$router.push(this.$route.path)
    },
  },
}
</script>
<style>
.kanban-card {
  position: relative;
}
.dateBadge {
  position: absolute;
  top: -14px;
  right: -6px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
}
.estimateBadge {
  position: absolute;
  bottom: 14px;
  right: -12px;
}
</style>

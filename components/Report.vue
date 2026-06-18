<template>
  <div>
    <b-row>
      <b-col sm="12">
        <b-btn variant="dark" class="float-right" @click="openHistory()">
          <b-icon-kanban /> Histórico
        </b-btn>
        <b-btn variant="dark" class="float-right" @click="openCalendar()">
          <b-icon-calendar /> Calendário
        </b-btn>
        <b-btn variant="dark" class="float-right" @click="openTimeline()">
          <b-icon-hourglass-bottom /> Timeline
        </b-btn>
        <b-btn variant="dark" class="float-right" @click="openFilter()">
          <b-icon-journal-check /> Filtros
        </b-btn>
      </b-col>
    </b-row>
    <b-row v-if="show_time_table">
      <b-col sm-12><Timetable :cards="cards" /></b-col>
    </b-row>
    <b-row v-if="show_calendar">
      <b-col sm-12><Calendar :cards="cards" /></b-col>
    </b-row>
    <b-row v-if="show_filters" class="mt-3">
      <b-col sm="12">
        <div class="mb-5">
          <div class="report-filters bg-dark rounded-lg p-3 mb-4">
            <b-row>
              <b-col md="4" class="mb-3 mb-md-0">
                <h6 class="filter-title">
                  <b-icon-funnel class="mr-1" /> Status
                </h6>
                <div class="filter-options">
                  <b-btn
                    v-for="status in statusOptions"
                    :key="status.id"
                    size="sm"
                    :variant="
                      isStatusSelected(status.id)
                        ? 'success'
                        : 'outline-secondary'
                    "
                    class="filter-chip mr-1 mb-1"
                    @click="toggleStatus(status.id)"
                  >
                    {{ status.name }}
                  </b-btn>
                  <small v-if="!statusOptions.length" class="text-muted">
                    Nenhum status disponível
                  </small>
                </div>
              </b-col>
              <b-col md="4" class="mb-3 mb-md-0">
                <h6 class="filter-title"><b-icon-tags class="mr-1" /> Tags</h6>
                <div class="filter-options">
                  <b-btn
                    v-for="tag in canvasTags"
                    :key="tag"
                    size="sm"
                    :variant="
                      isTagSelected(tag) ? 'success' : 'outline-secondary'
                    "
                    class="filter-chip mr-1 mb-1"
                    @click="toggleTag(tag)"
                  >
                    {{ tag }}
                  </b-btn>
                  <small v-if="!canvasTags.length" class="text-muted">
                    Nenhuma tag disponível
                  </small>
                </div>
              </b-col>
              <b-col md="4">
                <h6 class="filter-title">
                  <b-icon-person class="mr-1" /> Membros
                </h6>
                <div class="filter-options">
                  <b-btn
                    v-for="member in canvasMembers"
                    :key="member._id"
                    size="sm"
                    :variant="
                      isMemberSelected(member) ? 'success' : 'outline-secondary'
                    "
                    class="filter-chip filter-chip-member mr-1 mb-1"
                    @click="toggleMember(member)"
                  >
                    <Avatar
                      :src="member.avatarUrl"
                      :name="member.name"
                      size="18"
                      class="mr-1"
                    />
                    {{ member.name }}
                  </b-btn>
                  <small v-if="!canvasMembers.length" class="text-muted">
                    Nenhum membro disponível
                  </small>
                </div>
              </b-col>
            </b-row>
            <b-row
              v-if="hasActiveFilters"
              class="align-items-center mt-2 pt-2 border-top border-secondary"
            >
              <b-col>
                <small class="text-muted">
                  Exibindo {{ filteredCards.length }} de
                  {{ cards.length }} cartões
                </small>
              </b-col>
              <b-col class="text-right">
                <b-btn
                  variant="outline-secondary"
                  size="sm"
                  @click="clearFilters"
                >
                  <b-icon-x-circle class="mr-1" /> Limpar filtros
                </b-btn>
              </b-col>
            </b-row>
          </div>
          <div class="filter-actions mb-3">
            <b-btn variant="dark" class="float-right mb-2" @click="exportToCSV">
              <b-icon-cloud-download /> Exportar CSV
            </b-btn>
            <b-btn
              variant="dark"
              class="float-right mb-2 mr-2"
              @click="show_rel_pdf = !show_rel_pdf"
            >
              <b-icon-file-earmark-pdf-fill /> Editar PDF
            </b-btn>
            <div class="filter hide">
              <label>Data de Início:</label>
              <input v-model="startDate" type="date" @change="applyFilters" />

              <label>Data de Fim:</label>
              <input v-model="endDate" type="date" @change="applyFilters" />
            </div>
            <b-modal
              v-model="show_rel_pdf"
              size="lg"
              title="Editar Relatório PDF"
              hide-footer
            >
              <b-row>
                <b-col md="12">
                  <b-btn
                    variant="dark"
                    class="float-right"
                    @click="exportToPDF"
                  >
                    <b-icon-cloud-download /> Exportar
                  </b-btn>
                </b-col>
                <b-col md="12">
                  <b-input
                    v-model="form.title"
                    label="Titulo dado para o relatório"
                    class="m-2"
                  />
                </b-col>
                <b-col md="12">
                  <quill-editor
                    ref="quillEdit"
                    v-model="form.html"
                    class="mt-4"
                    toolbar="minimal"
                  />
                </b-col>
              </b-row>
            </b-modal>
          </div>
          <table v-if="filteredCards.length > 0" class="report-table">
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Status</th>
                <th>Tags</th>
                <th>Membros</th>
                <th>Data Entregue</th>
                <th>Horas Gastas</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in filteredCards" :key="item._id || item.id">
                <td>
                  <a
                    href="#"
                    class="card-title-link text-decoration-none"
                    @click.prevent="openCard(item)"
                  >
                    {{ item.title }}
                  </a>
                </td>
                <td>{{ item.status }}</td>
                <td>
                  <div v-for="tag in item.tags" :key="tag">
                    {{ tag }}
                  </div>
                </td>
                <td>
                  <div v-for="memberId in item.members" :key="memberId">
                    {{ findMemberNameById(memberId) }}
                  </div>
                </td>
                <td>{{ formatDate(item.end_date) }}</td>
                <td>{{ item.time_spent }}</td>
              </tr>
              <tr>
                <td colspan="4"></td>
                <td><strong>Total de Horas Gastas:</strong></td>
                <td>{{ calculateTotalHours() }}</td>
              </tr>
            </tbody>
          </table>
          <b-modal
            v-model="show_card_modal"
            title="Editar cartão"
            hide-footer
            size="lg"
            @hide="selectedCard = null"
          >
            <form-card-form
              v-if="selectedCard"
              :project="project"
              :edit="selectedCard"
              @change="cardChanged"
            />
          </b-modal>
        </div>
      </b-col>
    </b-row>
    <b-row v-if="show_history">
      <b-col sm="12">
        <h5>Historicos de relatórios gerados do projeto</h5>
        <table class="report-table">
          <thead>
            <tr>
              <th>Titulo</th>
              <th>Data de criação</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in historical" :key="index">
              <td>{{ item.title }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
              <td>
                <b-link
                  variant="dark"
                  :href="`/api/projects/pdf?report=${item._id}`"
                  target="_blank"
                >
                  <b-icon-file-earmark-pdf-fill />
                </b-link>
                <b-link variant="dark" @click="deleteReport(item.id)">
                  <b-icon-trash-fill />
                </b-link>
              </td>
            </tr>
          </tbody>
        </table>
      </b-col>
    </b-row>
    <b-row v-if="show_timeline">
      <b-col sm="12">
        <h4 class="mb-4">Timeline</h4>
        <Timeline :cards="cards" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import columns from '@/content/columns.json'

export default {
  props: {
    cards: {
      type: Array,
      default: () => [],
    },
    project: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedStatus: [],
      selectedTags: [],
      startDate: '',
      endDate: '',
      selectedMembers: [],
      filteredCards: [],
      show_filters: true,
      show_history: false,
      show_timeline: false,
      show_calendar: false,
      show_rel_pdf: false,
      show_time_table: false,
      show_card_modal: false,
      selectedCard: null,
      groupedCards: {},
      form: {
        title: '',
        html: '',
      },
      historical: [],
    }
  },
  computed: {
    members() {
      return this.$store.state.organization?.members || []
    },
    canvasMembers() {
      const canvasMemberIds = this.cards.reduce((ids, card) => {
        return [...ids, ...card.members]
      }, [])
      return this.members.filter((member) =>
        canvasMemberIds.includes(member._id)
      )
    },
    canvasStatus() {
      const statusSet = new Set()

      this.cards.forEach((card) => {
        statusSet.add(card.status)
      })

      return [...statusSet]
    },
    statusOptions() {
      return this.canvasStatus.map((id) => ({
        id,
        name: this.getStatusName(id),
      }))
    },
    hasActiveFilters() {
      return (
        this.selectedStatus.length > 0 ||
        this.selectedTags.length > 0 ||
        this.selectedMembers.length > 0
      )
    },
    canvasTags() {
      const tagSet = new Set()

      this.cards.forEach((card) => {
        card.tags?.forEach((tag) => {
          tagSet.add(tag)
        })
      })

      return [...tagSet].sort()
    },
    baseURL() {
      return process.env.baseUrl
    },
  },
  watch: {
    cards: {
      handler() {
        this.applyFilters()
      },
      deep: true,
    },
    filteredCards: {
      handler() {
        this.groupedCards = this.groupCardsByTagsWithBracket(this.filteredCards)
        this.generatePDFContent()
      },
      deep: true,
    },
  },
  methods: {
    getStatusName(statusId) {
      for (const cid of Object.keys(columns)) {
        const status = columns[cid].status.find((s) => s.id === statusId)
        if (status) {
          return status.name
        }
      }
      return statusId
    },
    isStatusSelected(statusId) {
      return this.selectedStatus.includes(statusId)
    },
    isTagSelected(tag) {
      return this.selectedTags.includes(tag)
    },
    isMemberSelected(member) {
      return this.selectedMembers.some((m) => m._id === member._id)
    },
    toggleStatus(statusId) {
      const index = this.selectedStatus.indexOf(statusId)
      if (index >= 0) {
        this.selectedStatus.splice(index, 1)
      } else {
        this.selectedStatus.push(statusId)
      }
      this.applyFilters()
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index >= 0) {
        this.selectedTags.splice(index, 1)
      } else {
        this.selectedTags.push(tag)
      }
      this.applyFilters()
    },
    toggleMember(member) {
      const index = this.selectedMembers.findIndex((m) => m._id === member._id)
      if (index >= 0) {
        this.selectedMembers.splice(index, 1)
      } else {
        this.selectedMembers.push(member)
      }
      this.applyFilters()
    },
    clearFilters() {
      this.selectedStatus = []
      this.selectedTags = []
      this.selectedMembers = []
      this.applyFilters()
    },
    openCard(card) {
      this.selectedCard = card
      this.show_card_modal = true
    },
    cardChanged() {
      this.show_card_modal = false
      this.selectedCard = null
      this.$emit('change')
    },
    formatDate(date) {
      if (date) {
        return new Date(date).toLocaleDateString('pt-BR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      }
    },
    applyFilters() {
      this.filteredCards = this.cards.filter((item) => {
        const statusMatch =
          this.selectedStatus.length === 0 ||
          this.selectedStatus.includes(item.status)
        const startDateMatch =
          !this.startDate ||
          new Date(item.updatedAt) >= new Date(this.startDate)
        const endDateMatch =
          !this.endDate || new Date(item.updatedAt) <= new Date(this.endDate)
        const membersMatch = this.membersMatch(item.members)
        const tagsMatch =
          this.selectedTags.length === 0 ||
          item.tags.some((tag) => this.selectedTags.includes(tag))
        return (
          statusMatch &&
          startDateMatch &&
          endDateMatch &&
          membersMatch &&
          tagsMatch
        )
      })
    },
    membersMatch(memberIds) {
      if (this.selectedMembers.length === 0) {
        return true // No member filter selected, so all members are allowed
      }

      const selectedMemberIds = this.selectedMembers.map((member) => member._id)
      return memberIds.some((id) => selectedMemberIds.includes(id))
    },
    calculateTotalHours() {
      let totalHours = 0
      for (const item of this.filteredCards) {
        totalHours += item.time_spent ? item.time_spent : 0
      }
      return totalHours
    },
    getMemberNames(memberIds) {
      return memberIds
        .map((memberId) => this.findMemberNameById(memberId))
        .join(', ')
    },
    exportToCSV() {
      const csvData = this.filteredCards.map((item) => {
        return [
          item.title,
          item.status,
          item.tags,
          this.formatDate(item.updatedAt),
          this.getMemberNames(item.members),
          this.formatDate(item.due_date),
          item.time_estimate,
          item.time_spent,
        ]
      })

      const csvRows = [
        ['Título', 'Status', 'Tags', 'Membros', 'Data Limite', 'Horas Gastas'],
        ...csvData,
      ]
      const csvContent = csvRows.map((row) => row.join(';')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'report.csv'
      a.click()
      URL.revokeObjectURL(url)
    },
    async exportToPDF() {
      const response = await this.$axios.$post(
        `/api/projects/${this.project.id}/report`,
        {
          title: this.form.title,
          html: this.form.html,
        }
      )
      this.show_rel_pdf = false
      this.openHistory()
      window.open(this.baseURL + '/api/projects/pdf?report=' + response._id)
    },
    groupCardsByTagsWithBracket(cards) {
      const groupedCards = {
        published: {},
        others: {},
      }

      cards.forEach((card) => {
        const tagWithBracket = card.tags.find((tag) => tag.includes('['))

        if (card.status === 'published') {
          if (!groupedCards.published[tagWithBracket]) {
            groupedCards.published[tagWithBracket] = []
          }
          groupedCards.published[tagWithBracket].push(card)
        } else {
          if (!groupedCards.others[tagWithBracket]) {
            groupedCards.others[tagWithBracket] = []
          }
          groupedCards.others[tagWithBracket].push(card)
        }
      })

      return groupedCards
    },
    generatePDFContent() {
      const pathFile = process.env.DEFAULT_STORAGE_BUCKET_FULL_URL
      this.form.title = `${this.project.name} - Relatório de Tarefas realizadas no periodo de xx/xx a xx/xx Ciclo XX`
      // input chatgpt
      // Em um paragrafo faça uma sintaxe resumida do que foi feita nesse ciclo de desenvolvimento de software:
      let htmlContent = `
        <h1>Contexto</h1>
        <p></p>
        <h1>Resumo da tarefas realizadas no ciclo:</h1>
      `
      let htmlDetal = `<hr />
        <h1>Detalhamento das tarefas entregues:</h1>`
      let count = 0

      for (const [tag, cards] of Object.entries(this.groupedCards.published)) {
        htmlContent += `
          <h3>${tag} - Entregue ${cards.length} tarefas.</h3>
        `
        for (const card of cards) {
          htmlContent += `
            <p>- ${card.title}. Entregue em ${this.formatDate(card.end_date)}.`
          if (card.time_spent) {
            htmlContent += ` Resultando ${card.time_spent} horas gastas de trabalho.`
          }
          htmlContent += `</p>`

          if (card.note || card.test_instructions || card.images.length > 0) {
            count = count + 1

            htmlDetal += `<h2>${count} - ${card.title}</h2>`
            if (card.note) {
              htmlDetal += `<h4>Descrição da tarefa:</h4><p>${card.note}</p>`
            }

            if (card.test_instructions) {
              htmlDetal += `<h4>Instruções de teste:</h4><p>${card.test_instructions}</p>`
            }

            for (const image of card.images) {
              htmlDetal += `<img src="${pathFile}${image.url}" alt="${count}" class="report-image" /><br />`
            }
            htmlDetal += `<hr />`
          }
        }
      }

      let htmlForecast = `
        <h1>Previsão das atividades para o próximo ciclo:</h1>`

      for (const [tag, cards] of Object.entries(this.groupedCards.others)) {
        htmlForecast += `
          <h3>${tag} - Previstas ${cards.length} tarefas.</h3>
        `

        for (const card of cards) {
          htmlForecast += `<p>- ${card.title}.`
          if (card.due_date) {
            htmlForecast += ` Previsão de conclusão ${this.formatDate(
              card.due_date
            )}. `
          }
          if (card.time_estimate) {
            htmlForecast += `Previstas ${card.time_estimate} horas gastas de trabalho.`
          }
          htmlForecast += `</p>`
        }
      }

      this.form.html = htmlContent + htmlDetal + htmlForecast
    },

    findMemberNameById(memberId) {
      const member = this.members.find((m) => m._id === memberId)
      return member ? member.name : 'Membro não encontrado'
    },
    openFilter() {
      this.show_filters = true
      this.show_history = false
      this.show_timeline = false
      this.show_calendar = false
    },
    openHistory() {
      this.show_filters = false
      this.show_history = true
      this.show_timeline = false
      this.show_calendar = false
      this.getHistory()
    },
    openTimeline() {
      this.show_timeline = true
      this.show_filters = false
      this.show_history = false
      this.show_calendar = false
    },
    openCalendar() {
      this.show_calendar = true
      this.show_timeline = false
      this.show_filters = false
      this.show_history = false
    },
    async getHistory() {
      this.historical = await this.$axios.$get(
        '/api/projects/reports/' + this.project.id
      )
    },
    async deleteReport(id) {
      if (window.confirm('Tem certeza de que deseja excluir o relatório?')) {
        await this.$axios.$delete('/api/projects/delete/' + id)
        this.getHistory()
      }
    },
  },
}
</script>

<style>
.report-table {
  margin-top: 26px;
  width: 100%;
  border-collapse: collapse;
}

.report-table th,
.report-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}

.report-table th {
  font-weight: bold;
}

.report-table a {
  color: #fff;
}

.report-table a.card-title-link {
  cursor: pointer;
  text-decoration: underline;
}

.report-table a.card-title-link:hover {
  opacity: 0.85;
}

.report-table a svg {
  font-size: 125%;
}

.report-filters .filter-title {
  color: #8b949e;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

.report-filters .filter-options {
  display: flex;
  flex-wrap: wrap;
}

.report-filters .filter-chip {
  border-radius: 999px;
  font-size: 0.8rem;
}

.report-filters .filter-chip-member {
  display: inline-flex;
  align-items: center;
}

.report-filters .border-top {
  border-color: #30363d !important;
}
</style>

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
    <b-row v-if="show_filters">
      <b-col sm="12">
        <div class="mb-5">
          <div class="filter-form">
            <div class="filter">
              <label>Status:</label>
              <div>
                <label v-for="status in canvasStatus" :key="status">
                  <input
                    v-model="selectedStatus"
                    type="checkbox"
                    :value="status"
                    @change="applyFilters"
                  />
                  {{ status }}
                </label>
              </div>
            </div>
            <div class="filter">
              <label>Tags:</label>
              <div>
                <label v-for="tag in canvasTags" :key="tag">
                  <input
                    v-model="selectedTags"
                    type="checkbox"
                    :value="tag"
                    @change="applyFilters"
                  />
                  {{ tag }}
                </label>
              </div>
            </div>
            <div class="filter">
              <label>Membros:</label>
              <div>
                <label v-for="member in canvasMembers" :key="member._id">
                  <input
                    v-model="selectedMembers"
                    type="checkbox"
                    :value="member"
                    @change="applyFilters"
                  />
                  {{ member.name }}
                </label>
              </div>
            </div>
            <div class="filter hide">
              <label>Data de Início:</label>
              <input v-model="startDate" type="date" @change="applyFilters" />

              <label>Data de Fim:</label>
              <input v-model="endDate" type="date" @change="applyFilters" />
            </div>
            <b-btn variant="dark" class="float-right mb-2" @click="exportToCSV">
              <b-icon-cloud-download /> Exportar CSV
            </b-btn>
            <b-btn
              variant="dark"
              class="float-right mb-2"
              @click="show_rel_pdf = !show_rel_pdf"
            >
              <b-icon-file-earmark-pdf-fill /> Editar PDF
            </b-btn>
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
              <tr v-for="(item, index) in filteredCards" :key="index">
                <td>{{ item.title }}</td>
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
    canvasTags() {
      const tagSet = new Set()

      this.cards.forEach((card) => {
        card.tags.forEach((tag) => {
          tagSet.add(tag)
        })
      })

      return [...tagSet]
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

.report-table a svg {
  font-size: 125%;
}

.filter-form {
  margin-bottom: 10px;
}

.filter-form label {
  margin-right: 10px;
}
.filter-form .filter {
  border: 1px solid #161b22;
  padding: 5px 20px;
  border-radius: 20px;
  margin-bottom: 4px;
}
</style>

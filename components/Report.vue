<template>
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
      <div class="filter">
        <label>Data de Início:</label>
        <input v-model="startDate" type="date" @change="applyFilters" />

        <label>Data de Fim:</label>
        <input v-model="endDate" type="date" @change="applyFilters" />
      </div>
      <b-btn variant="dark" class="float-right" @click="exportToCSV">
        <b-icon-cloud-download /> Exportar CSV
      </b-btn>
      <b-btn
        variant="dark"
        class="float-right"
        @click="show_rel_pdf = !show_rel_pdf"
      >
        <b-icon-file-earmark-pdf-fill /> Exportar PDF
      </b-btn>
      {{ filteredCards }}
      <b-modal
        v-model="show_rel_pdf"
        size="lg"
        title="Visualizar Relatório"
        hide-footer
      >
        <div>
          <h4>Contexto</h4>
          <p></p>
          <h4>Resultados do ciclo:</h4>
          <div v-for="(line, tag) in groupedCards.published" :key="tag">
            <h5>{{ tag }}</h5>
            <p v-for="card in line" :key="card._id">
              -
              {{ card.title }} Entregue em {{ formatDate(card.end_date) }}.
              Resultando {{ card.time_spent }} horas gastas de trabalho.
            </p>
          </div>

          <h4>Previsão das atividades para o próximo ciclo:</h4>
          <div v-for="(line, tag) in groupedCards.others" :key="tag">
            <h5>{{ tag }}</h5>
            <p v-for="card in line" :key="card._id">
              -
              {{ card.title }}. Previsão de conclusão
              {{ formatDate(card.due_date) }}. Previstas
              {{ card.time_estimate }} horas gastas de trabalho.
            </p>
          </div>
        </div>
      </b-modal>
    </div>
    <table class="report-table">
      <thead>
        <tr>
          <th>Titulo</th>
          <th>Status</th>
          <th>Tags</th>
          <th>Data Atualização</th>
          <th>Membros</th>
          <th>Data Limite</th>
          <th>Horas Estimadas</th>
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
          <td>{{ formatDate(item.updatedAt) }}</td>
          <td>
            <div v-for="memberId in item.members" :key="memberId">
              {{ findMemberNameById(memberId) }}
            </div>
          </td>
          <td>{{ formatDate(item.due_date) }}</td>
          <td>{{ item.time_estimate }}</td>
          <td>{{ item.time_spent }}</td>
        </tr>
        <tr>
          <td colspan="6"></td>
          <td><strong>Total de Horas Gastas:</strong></td>
          <td>{{ calculateTotalHours() }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    cards: {
      type: Array,
      default: () => [],
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
      show_rel_pdf: false,
      groupedCards: {},
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
        [
          'Título',
          'Status',
          'Tags',
          'Data Atualização',
          'Membros',
          'Data Limite',
          'Horas Estimadas',
          'Horas Gastas',
        ],
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

    findMemberNameById(memberId) {
      const member = this.members.find((m) => m._id === memberId)
      return member ? member.name : 'Membro não encontrado'
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

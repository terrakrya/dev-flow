<template>
  <div class="mb-5">
    <div class="filter-form">
      <label>Status:</label>
      <div>
        <label>
          <input
            v-model="selectedStatus"
            type="checkbox"
            value="backlog"
            @change="applyFilters"
          />
          Backlog
        </label>
        <label>
          <input
            v-model="selectedStatus"
            type="checkbox"
            value="developing"
            @change="applyFilters"
          />
          Desenvolvimento
        </label>
        <label>
          <input
            v-model="selectedStatus"
            type="checkbox"
            value="ready_to_test"
            @change="applyFilters"
          />
          Teste
        </label>
        <label>
          <input
            v-model="selectedStatus"
            type="checkbox"
            value="ready_to_prod"
            @change="applyFilters"
          />
          Produção
        </label>
      </div>

      <label>Data de Início:</label>
      <input v-model="startDate" type="date" @change="applyFilters" />

      <label>Data de Fim:</label>
      <input v-model="endDate" type="date" @change="applyFilters" />

      <b-btn variant="dark" class="float-right" @click="exportToCSV">
        <b-icon-cloud-download /> Exportar
      </b-btn>
    </div>

    <table class="report-table">
      <thead>
        <tr>
          <th>Titulo</th>
          <th>Status</th>
          <th>Data Atualização</th>
          <th>Membros</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredCards" :key="index">
          <td>{{ item.title }}</td>
          <td>{{ item.status }}</td>
          <td>{{ formatDate(item.updatedAt) }}</td>
          <td>
            <div v-for="memberId in item.members" :key="memberId">
              {{ findMemberNameById(memberId) }}
            </div>
          </td>
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
      startDate: '',
      endDate: '',
      filteredCards: [],
    }
  },
  computed: {
    members() {
      return this.$store.state.organization?.members || []
    },
  },
  watch: {
    cards: {
      handler() {
        this.applyFilters()
      },
      deep: true,
    },
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
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

        return statusMatch && startDateMatch && endDateMatch
      })
    },
    exportToCSV() {
      const csvData = this.filteredCards.map((item) => {
        return [item.title, item.status, this.formatDate(item.updatedAt)]
      })

      const csvRows = [['Título', 'Status', 'Data Atualização'], ...csvData]
      const csvContent = csvRows.map((row) => row.join(';')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'report.csv'
      a.click()
      URL.revokeObjectURL(url)
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
</style>
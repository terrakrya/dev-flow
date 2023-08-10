<template>
  <div class="mb-5">
    <div class="filter-form">
      <label>Status:</label>
      <select v-model="selectedStatus" @change="applyFilters">
        <option value="">Todos</option>
        <option value="backlog">Backlog</option>
        <option value="developing">Desenvolvimento</option>
        <option value="ready_to_test">Teste</option>
        <option value="ready_to_prod">Produção</option>
      </select>

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
          <th>Nota</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in filteredCards" :key="index">
          <td>{{ item.title }}</td>
          <td>{{ item.status }}</td>
          <td>{{ formatDate(item.updatedAt) }}</td>
          <td>{{ item.note }}</td>
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
      selectedStatus: '',
      startDate: '',
      endDate: '',
      filteredCards: [],
    }
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
          this.selectedStatus === '' || item.status === this.selectedStatus
        const startDateMatch =
          !this.startDate ||
          new Date(item.updatedAt) >= new Date(this.startDate)
        const endDateMatch =
          !this.endDate || new Date(item.updatedAt) <= new Date(this.endDate)

        return statusMatch && startDateMatch && endDateMatch
      })
    },
    exportToCSV() {
      const csvData = this.filteredCards.map((item) => [
        item.title,
        item.status,
        this.formatDate(item.updatedAt),
      ])

      const csvRows = [['Título', 'Status', 'Data Atualização'], ...csvData]
      const csvContent = csvRows.map((row) => row.join(',')).join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'report.csv'
      a.click()
      URL.revokeObjectURL(url)
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

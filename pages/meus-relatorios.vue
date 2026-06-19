<template>
  <b-container fluid>
    <b-row class="mb-4">
      <b-col>
        <h4>Meus relatórios</h4>
        <p class="text-muted mb-0">
          Horas registradas nos cartões em que você é membro
        </p>
      </b-col>
      <b-col class="text-right">
        <h5 v-if="report" class="mb-0">
          <b-icon-clock class="mr-1" />
          {{ formatHours(report.totalHours) }} h no total
        </h5>
      </b-col>
    </b-row>

    <div v-if="loading" class="text-center py-5">
      <b-spinner label="Carregando..." />
    </div>

    <div v-else-if="report">
      <div
        v-if="report.byProject.length"
        class="report-panel bg-dark rounded-lg p-3 mb-4"
      >
        <h6 class="panel-title">
          <b-icon-kanban class="mr-1" /> Resumo por projeto
        </h6>
        <table class="report-table">
          <thead>
            <tr>
              <th>Projeto</th>
              <th>Cartões</th>
              <th>Horas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in report.byProject" :key="item.id">
              <td>
                <nuxt-link
                  v-if="item.id !== 'unknown'"
                  :to="`/projects/${item.id}`"
                  class="report-link"
                >
                  {{ item.name }}
                </nuxt-link>
                <span v-else>{{ item.name }}</span>
              </td>
              <td>{{ item.cards }}</td>
              <td>{{ formatHours(item.hours) }} h</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td><strong>Total</strong></td>
              <td>{{ totalProjectCards }}</td>
              <td>
                <strong>{{ formatHours(report.totalHours) }} h</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div
        v-for="project in report.byProject"
        :key="`tags-${project.id}`"
        class="report-panel bg-dark rounded-lg p-3 mb-4"
      >
        <div class="project-header">
          <h6 class="panel-title mb-0">
            <b-icon-tags class="mr-1" />
            <nuxt-link
              v-if="project.id !== 'unknown'"
              :to="`/projects/${project.id}`"
              class="report-link"
            >
              {{ project.name }}
            </nuxt-link>
            <span v-else>{{ project.name }}</span>
          </h6>
          <small class="text-muted">
            {{ project.cards }} cartões · {{ formatHours(project.hours) }} h
          </small>
        </div>
        <table v-if="project.tags.length" class="report-table mt-3">
          <thead>
            <tr>
              <th>Tag</th>
              <th>Cartões</th>
              <th>Horas</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tag in project.tags" :key="tag.tag">
              <td>#{{ tag.tag }}</td>
              <td>{{ tag.cards }}</td>
              <td>{{ formatHours(tag.hours) }} h</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="text-muted mb-0 mt-3">
          Nenhuma tag registrada neste projeto.
        </p>
      </div>

      <p v-if="!report.byProject.length" class="text-muted">
        Nenhuma hora registrada em projetos.
      </p>

      <small v-if="report.byProject.length" class="text-muted d-block">
        Cartões com várias tags têm as horas distribuídas entre elas.
      </small>
    </div>

    <div v-else class="text-center py-5 text-muted">
      Não foi possível carregar os relatórios.
    </div>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      report: null,
    }
  },
  computed: {
    totalProjectCards() {
      if (!this.report?.byProject) {
        return 0
      }
      return this.report.byProject.reduce((sum, item) => sum + item.cards, 0)
    },
  },
  created() {
    this.loadReport()
  },
  methods: {
    async loadReport() {
      this.loading = true
      try {
        const organizationId = this.$store.state.organization?.id
        this.report = await this.$axios.$get('/api/cards/my-reports', {
          params: { organization: organizationId },
        })
      } catch (error) {
        this.showError(error)
        this.report = null
      } finally {
        this.loading = false
      }
    },
    formatHours(hours) {
      if (!hours) {
        return '0'
      }
      const rounded = Math.round(hours * 10) / 10
      return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1)
    },
  },
}
</script>

<style scoped>
.report-panel .panel-title {
  color: #8b949e;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 1rem;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th,
.report-table td {
  border: 1px solid #30363d;
  padding: 8px 12px;
  text-align: left;
}

.report-table th {
  color: #8b949e;
  font-weight: 600;
  font-size: 0.85rem;
}

.report-table tfoot td {
  border-top: 2px solid #30363d;
}

.report-link {
  color: #58a6ff;
  text-decoration: none;
}

.report-link:hover {
  text-decoration: underline;
}
</style>

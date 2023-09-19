<template>
  <div v-if="project">
    <b-container fluid class="mb-4">
      <b-row>
        <b-col sm="8">
          <h4>
            {{ project.name }}
          </h4>
          <p v-if="project.description">
            {{ project.description }}
          </p>
          <b-modal
            v-model="show_project_form"
            title="Editar projeto"
            hide-footer
          >
            <form-project-form
              :edit="project"
              @change="projectSaved"
              @archived="projectArchived"
            />
          </b-modal>
        </b-col>
        <b-col class="text-right">
          <b-btn variant="dark" @click="show_project_form = !show_project_form">
            <b-icon-pencil />
          </b-btn>
          <b-btn variant="dark" @click="show_card_form = !show_card_form">
            <b-icon-plus /> Adicionar cartão
          </b-btn>
          <b-modal
            v-model="show_card_form"
            title="Adicionar cartão"
            hide-footer
          >
            <form-card-form :project="project" @change="cardSaved" />
          </b-modal>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="8">
          <b-btn variant="dark" class="p-4">
            <b-icon-info-square /> Informações
          </b-btn>
          <b-btn variant="dark" class="p-4" @click="openKanban()">
            <b-icon-kanban /> Kanban
          </b-btn>
          <b-btn variant="dark" class="p-4" @click="openReport()">
            <b-icon-journal-check /> Relatórios
          </b-btn>
          <b-btn variant="dark" class="p-4"><b-icon-card-text /> Notas</b-btn>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid>
      <div v-if="show_kanban">
        <Kanban :cards="cards" @change="cardSaved" />
      </div>
      <div v-if="show_report">
        <Report :cards="cards" />
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show_project_form: false,
      show_card_form: false,
      show_kanban: false,
      show_report: false,
      cards: [],
    }
  },
  computed: {
    projects() {
      return this.$store.state.projects
    },
    project() {
      if (this.projects) {
        return this.projects.find(
          (project) => project._id === this.$route.params.id
        )
      }
      return null
    },
  },
  created() {
    this.loadCards()
  },
  methods: {
    async loadCards() {
      this.cards = await this.$axios.$get('/api/cards', {
        params: { project: this.$route.params.id },
      })
    },
    cardSaved() {
      this.loadCards()
      this.show_card_form = false
    },
    projectSaved() {
      this.show_project_form = false
      this.$store.dispatch('loadProjects')
    },
    projectArchived() {
      this.projectSaved()
      this.$router.push('/projects')
    },
    openKanban() {
      this.show_kanban = true
      this.show_report = false
    },
    openReport() {
      this.show_kanban = false
      this.show_report = true
    },
  },
}
</script>

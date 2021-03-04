<template>
  <b-container fluid>
    <div>
      <template v-if="projects">
        <b-button
          v-for="project in projects"
          :key="project._id"
          variant="dark"
          :to="`/projects/${project._id}`"
          class="mb-1"
          :style="`background-color: ${project.color} !important`"
          >{{ project.name }}</b-button
        >
      </template>
      <a
        class="btn btn-black mb-1"
        @click="show_project_form = !show_project_form"
      >
        <b-icon-plus />
        Adicionar projeto
      </a>
    </div>
    <b-modal v-model="show_project_form" title="Adicionar projeto" hide-footer>
      <project-form @change="projectSaved" />
    </b-modal>
    <Kanban :cards="cards" multiple @change="loadCards" />
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      show_project_form: false,
      cards: [],
    }
  },
  computed: {
    projects() {
      return this.$store.state.projects
    },
  },
  created() {
    this.loadCards()
  },
  methods: {
    async loadCards() {
      this.cards = await this.$axios.$get('/api/cards')
    },
    projectSaved() {
      this.show_project_form = false
      this.$store.dispatch('loadProjects')
    },
  },
}
</script>

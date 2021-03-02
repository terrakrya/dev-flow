<template>
  <b-container fluid>
    <div>
      <template v-if="projects">
        <b-button
          variant="dark"
          v-for="project in projects"
          :key="project._id"
          :to="`/projects/${project._id}`"
          class="mb-1"
          >{{ project.name }}</b-button
        >
      </template>
      <a @click="show_project_form = !show_project_form">
        <b-icon-plus />
        Adicionar projeto
      </a>
    </div>
    <b-modal v-model="show_project_form" title="Adicionar projeto" hide-footer>
      <project-form @change="projectSaved" />
    </b-modal>
    <Kanban :cards="cards" multiple />
    <pre>{{ cards }}</pre>
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
  async created() {
    this.cards = await this.$axios.$get('/api/cards')
  },
  methods: {
    projectSaved() {
      this.show_project_form = false
      this.$store.dispatch('loadProjects')
    },
  },
}
</script>

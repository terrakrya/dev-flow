<template>
  <b-container fluid>
    <div v-if="projects">
      <b-button
        v-for="project in projects"
        :key="project._id"
        :to="`/projects/${project._id}`"
        >{{ project.name }}</b-button
      >
    </div>
    <b-button @click="show_project_form = !show_project_form"
      >Adicionar projeto</b-button
    >
    <b-modal v-model="show_project_form" title="Adicionar projeto" hide-footer>
      <project-form @saved="show_project_form = false" />
    </b-modal>
    <!-- <Kanban :cards="cards" multiple /> -->
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
}
</script>

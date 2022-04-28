<template>
  <b-container fluid>
    <b-row>
      <b-col sm="10">
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
          class="btn btn-dark mb-1"
          @click="show_project_form = !show_project_form"
        >
          <b-icon-plus />
        </a>
      </b-col>
      <b-col class="text-right">
        <b-btn variant="dark" @click="show_card_form = !show_card_form">
          <b-icon-plus /> Adicionar cartão
        </b-btn>
        <b-modal v-model="show_card_form" title="Adicionar cartão" hide-footer>
          <card-form @change="cardSaved" />
        </b-modal>
      </b-col>
    </b-row>
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
      show_card_form: false,
      show_project_form: false,
      cards: [],
    }
  },
  computed: {
    projects() {
      return this.$store.state.projects
    },
    activeOrganizationId() {
      return this.$store.state.organization.id
    },
  },
  created() {
    this.loadCards()
  },
  methods: {
    async loadCards() {
      this.cards = await this.$axios.$get(
        `/api/cards?organization=${this.activeOrganizationId}`
      )
    },
    projectSaved() {
      this.show_project_form = false
      this.$store.dispatch('loadProjects')
    },
    cardSaved() {
      this.show_card_form = false
      this.loadCards()
    },
  },
}
</script>

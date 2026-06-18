<template>
  <b-container fluid>
    <b-row>
      <b-col sm="10">
        <template v-if="projects">
          <b-row>
            <b-col v-for="project in projects" :key="project._id" sm="3">
              <b-button
                variant="dark"
                block
                :to="`/projects/${project._id}`"
                class="mb-4 d-flex align-items-center justify-content-center"
                size="lg"
                style="height: 100px"
                ><small>{{ project.name }}</small></b-button
              >
            </b-col>
          </b-row>
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
        <b-modal
          v-model="show_card_form"
          title="Adicionar cartão"
          size="lg"
          hide-footer
        >
          <form-card-form @change="cardSaved" />
        </b-modal>
      </b-col>
    </b-row>
    <b-modal v-model="show_project_form" title="Adicionar projeto" hide-footer>
      <form-project-form @change="projectSaved" />
    </b-modal>
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
    // this.loadCards()
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

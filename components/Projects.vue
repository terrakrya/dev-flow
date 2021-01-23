<template>
  <b-card v-if="projects" class="mb-3" no-body>
    <b-card-body>
      <b-card-title class="mb-0">
        <span class="title">Projetos</span>
      </b-card-title>
    </b-card-body>
    <b-list-group flush>
      <b-list-group-item
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.id}`"
      >
        {{ project.name }}
        <b-icon-lock-fill v-if="project.private" />
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>
<script>
export default {
  computed: {
    projects() {
      return this.$store.state.projects
    },
  },
  created() {
    this.octokit.projects
      .listForOrg({
        org: this.org,
      })
      .then((resp) => {
        this.$store.commit('setProjects', resp.data.reverse())
      })
  },
}
</script>

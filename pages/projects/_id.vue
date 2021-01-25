<template>
  <b-container>
    <b-row>
      <b-col md="8">
        <div v-if="project">
          <h4>{{ project.name }}</h4>
          <p v-if="project.body">{{ project.body }}</p>
          <pre>{{ project }}</pre>
          <pre>{{ columns }}</pre>
          <pre>{{ cards }}</pre>
        </div>
      </b-col>
      <b-col md="4">
        <Sidebar />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      project: null,
      columns: null,
      cards: [],
    }
  },
  async created() {
    this.octokit.projects
      .get({
        project_id: this.$route.params.id,
      })
      .then((resp) => {
        this.project = resp.data
      })
    this.columns = (
      await this.octokit.projects.listColumns({
        project_id: this.$route.params.id,
      })
    ).data
    this.columns.forEach((column) => {
      this.octokit.projects
        .listCards({
          column_id: column.id,
        })
        .then((resp) => {
          const cards = resp.data
          cards.forEach((card) => {
            this.cards.push(card)
          })
        })
    })
  },
}
</script>

<template>
  <div>
    <b-container>
      <div v-if="project">
        <h4>{{ project.name }}</h4>
        <p v-if="project.body">{{ project.body }}</p>
      </div>
    </b-container>
    <b-container fluid>
      <div v-if="project">
        <Kanban :columns="columns" />
        <!-- <pre>{{ project }}</pre> -->
        <pre>{{ columns }}</pre>
        <!-- <pre>{{ cards }}</pre> -->
      </div>
    </b-container>
  </div>
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
    const columns = (
      await this.octokit.projects.listColumns({
        project_id: this.$route.params.id,
      })
    ).data
    for (const column of columns) {
      const resp = await this.octokit.projects.listCards({
        column_id: column.id,
      })
      const cards = resp.data
      column.cards = cards
      cards.forEach((card) => {
        this.cards.push(card)
      })
    }
    this.columns = columns
  },
}
</script>

<template>
  <b-container fluid>
    <div v-if="projects">
      <b-button
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.id}`"
        >{{ project.name }}</b-button
      >
    </div>
    <Kanban :columns="columns" :projects="projects" multiple />
    <pre>{{ columns }}</pre>
  </b-container>
</template>

<script>
export default {
  computed: {
    projects() {
      return this.$store.state.projects
    },
    columns() {
      const columns = {}
      if (this.projects) {
        for (const project of this.projects) {
          for (const column of project.columns) {
            const cards = column.cards
            if (columns[column.name]) {
              columns[column.name] = [...columns[column.name], ...cards]
            } else {
              columns[column.name] = cards
            }
          }
        }
      }
      return Object.keys(columns).map((columnName) => {
        return {
          name: columnName,
          cards: columns[columnName],
        }
      })
    },
  },
}
</script>

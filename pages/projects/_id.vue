<template>
  <div>
    <b-container fluid>
      <div v-if="project">
        <h4>{{ project.name }}</h4>
        <p v-if="project.body">{{ project.body }}</p>
      </div>
    </b-container>
    <b-container fluid>
      <div v-if="project">
        <Kanban :columns="project.columns" />
        <!-- <pre>{{ project }}</pre> -->
        <pre>{{ columns }}</pre>
        <!-- <pre>{{ cards }}</pre> -->
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: null,
    }
  },
  computed: {
    projects() {
      return this.$store.state.projects
    },
    project() {
      if (this.projects) {
        return this.projects.find(
          (project) => project.id.toString() === this.$route.params.id
        )
      }
      return null
    },
  },
}
</script>

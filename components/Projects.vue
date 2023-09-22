<template>
  <div v-if="projects" class="mb-3">
    <b-list-group flush>
      <b-list-group-item
        v-for="project in projects"
        :key="project.id"
        :to="`/projects/${project.id}`"
      >
        <small>{{ project.name }}</small>
      </b-list-group-item>
    </b-list-group>
  </div>
</template>
<script>
export default {
  computed: {
    projects() {
      const projects = [...this.$store.state.projects]
      if (projects) {
        return projects.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
      }
      return null
    },
  },
}
</script>

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
      return this.$store.state.projects
    },
  },
}
</script>

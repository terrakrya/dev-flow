<template>
  <b-container fluid class="mt-4 mb-4">
    <b-nav tabs>
      <b-nav-item to="/admin"> <b-icon-bar-chart /> Dashboard </b-nav-item>
      <b-nav-item v-if="projects" to="/projects" class="text-dark">
        <b-icon-kanban />
        Projetos <b-badge> {{ projects.length }} </b-badge>
      </b-nav-item>
      <b-nav-item v-if="repositories" to="/repositories">
        <b-icon-journal-bookmark />
        Repositórios <b-badge> {{ repositories.length }} </b-badge>
      </b-nav-item>
      <b-nav-item v-if="members" to="/members">
        <b-icon-people />
        Membros <b-badge> {{ members.length }} </b-badge>
      </b-nav-item>
      <b-nav-item to="/chat/!idEFgMgKIeSobaPypm:terrakrya.com">
        <b-icon-people />
        Chat
      </b-nav-item>
    </b-nav>
  </b-container>
</template>

<script>
export default {
  computed: {
    repositories() {
      return this.$store.state.repositories
    },
    projects() {
      return this.$store.state.projects
    },
    members() {
      return this.$store.state.members
    },
  },
}
</script>

<template>
  <b-container fluid class="mb-2 mt-1">
    <b-nav tabs>
      <b-nav-item to="/admin"> <b-icon-bar-chart /> Dashboard </b-nav-item>
      <b-nav-item v-if="projects" to="/projects" class="text-dark">
        <b-icon-kanban />
        Projetos <b-badge> {{ projects.length }} </b-badge>
      </b-nav-item>
      <!--
      <b-nav-item v-if="repositories" to="/repositories">
        <b-icon-journal-bookmark />
        Repositórios <b-badge> {{ repositories.length }} </b-badge>
      </b-nav-item>
      -->
      <b-nav-item to="/wiki">
        <b-icon-people />
        Wiki
      </b-nav-item>
      <b-nav-item to="/organizations">
        <b-icon-people />
        Organização
      </b-nav-item>
      <b-nav-item v-if="members" to="/members">
        <b-icon-people />
        Membros <b-badge> {{ members.length }} </b-badge>
      </b-nav-item>

      <b-nav-item to="/chat/index">
        <b-icon-people />
        Chat (beta)
      </b-nav-item>
    </b-nav>
    <ChatJitsiMeet />
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
      return this.$store.state.organization?.members || []
    },
  },
}
</script>

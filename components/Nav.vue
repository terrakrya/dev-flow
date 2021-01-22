<template>
  <div class="container">
    <b-nav>
      <b-nav-item active> Dashboard </b-nav-item>
      <b-nav-item v-if="projects">
        Projetos <b-badge> {{ projects.length }} </b-badge>
      </b-nav-item>
      <b-nav-item v-if="repositories">
        Repositórios <b-badge> {{ repositories.length }} </b-badge>
      </b-nav-item>
      <b-nav-item v-if="members">
        Membros <b-badge> {{ members.length }} </b-badge>
      </b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      repositories: null,
      projects: null,
      members: null,
    }
  },
  async created() {
    const org = 'terrakrya'
    this.repositories = (
      await this.octokit.repos.listForOrg({
        org,
      })
    ).data

    this.projects = (
      await this.octokit.projects.listForOrg({
        org,
      })
    ).data

    this.members = (
      await this.octokit.orgs.listMembers({
        org,
      })
    ).data
  },
}
</script>

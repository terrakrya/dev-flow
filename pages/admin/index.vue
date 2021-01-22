<template>
  <div class="container">
    <div v-if="projects">
      <h3>Projetos</h3>
      <ul class="projects">
        <li v-for="project in projects" :key="project.id">
          {{ project.name }} <b-icon-lock-fill v-if="project.private" />
        </li>
      </ul>
    </div>
    <div v-if="repositories">
      <h3>Repositórios {{ repositories.length }}</h3>
      <ul class="repositories">
        <li v-for="repository in repositories" :key="repository.id">
          {{ repository.name }} <b-icon-lock-fill v-if="repository.private" />
        </li>
      </ul>
    </div>
    <div v-if="members">
      <h3>Membros {{ members.length }}</h3>
      <b-row class="members">
        <b-col v-for="member in members" :key="member.id" md="2">
          <b-img fluid :src="member.avatar_url" :alt="member.login" />
        </b-col>
      </b-row>
    </div>
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

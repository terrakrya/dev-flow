<template>
  <div class="container">
    <div v-if="user">
      {{ user.name }}
    </div>
    <a class="button--grey" @click="$auth.logout()"> Sair </a>
    <div v-if="projects">
      <h3>Projetos {{ projects.length }}</h3>
      <ul class="projects">
        <li v-for="project in projects" :key="project.id">
          {{ project.name }}
        </li>
      </ul>
    </div>
    <div v-if="repositories">
      <h3>Repositórios {{ repositories.length }}</h3>
      <ul class="repositories">
        <li v-for="repository in repositories" :key="repository.id">
          {{ repository.name }}
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
    <div v-if="events">
      <h3>Atividades {{ events.length }}</h3>
      <ul class="events">
        <li v-for="event in events" :key="event.id">
          {{ event.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  data() {
    return {
      user: null,
      repositories: null,
      projects: null,
      members: null,
    }
  },
  async created() {
    const { Octokit } = require('@octokit/rest')

    const octokit = new Octokit({
      auth: this.$auth.strategy.token.get(),
    })

    this.user = (await octokit.request('/user')).data

    const org = 'terrakrya'
    this.repositories = (
      await octokit.repos.listForOrg({
        org,
      })
    ).data

    this.projects = (
      await octokit.projects.listForOrg({
        org,
      })
    ).data

    this.members = (
      await octokit.orgs.listMembers({
        org,
      })
    ).data
    octokit.orgs.listMembers({
      org,
    })

    // this.events = (await octokit.activity.listPublicEvents()).data
  },
}
</script>

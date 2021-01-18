<template>
  <div class="container">
    <div v-if="user">
      {{ user.name }}
      <a class="button--grey" @click="$auth.logout()"> Sair </a>
    </div>
    <ul v-if="repositories" class="repositories">
      {{
        repositories.length
      }}
      <li v-for="repository in repositories" :key="repository.id">
        {{ repository.name }}
      </li>
    </ul>
    <ul v-if="projects" class="projects">
      {{
        projects.length
      }}
      <li v-for="project in projects" :key="project.id">
        {{ project.name }}
      </li>
    </ul>
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
    }
  },
  async created() {
    const { Octokit } = require('@octokit/rest')

    const octokit = new Octokit({
      auth: this.$auth.strategy.token.get(),
    })

    const org = 'terrakrya'
    this.repositories = (
      await octokit.repos.listForOrg({
        org,
        type: 'all',
      })
    ).data

    this.projects = (
      await octokit.request('/orgs/{org}/projects', {
        org,
        mediaType: {
          previews: ['inertia'],
        },
      })
    ).data

    this.user = (await octokit.request('/user')).data
  },
}
</script>

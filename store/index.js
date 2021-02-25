export const state = () => ({
  organization: null,
  members: null,
  projects: [],
  repositories: null,
})

export const mutations = {
  setOrganization(state, organization) {
    state.organization = organization
  },
  setMembers(state, members) {
    state.members = members
  },
  setProjects(state, projects) {
    state.projects = projects
  },
  setRepositories(state, repositories) {
    state.repositories = repositories
  },
}

export const actions = {
  async loadProjects({ commit, auth }) {
    const projects = await this.$axios.$get('/api/projects')
    commit('setProjects', projects)
  },
}

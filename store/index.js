export const state = () => ({
  organization: null,
  members: null,
  projects: null,
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

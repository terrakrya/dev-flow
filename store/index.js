const { Octokit } = require('@octokit/rest')

const org = 'terrakrya'

function octokit(state) {
  return new Octokit({
    auth: 'Token ' + state.auth.user.token,
  })
}

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
  async loadProjects(state) {
    const kit = octokit(state)
    const resp = await kit.projects.listForOrg({
      org,
    })
    const projects = resp.data.reverse()
    for (const project of projects) {
      const projectColumns = (
        await kit.projects.listColumns({
          project_id: project.id,
        })
      ).data
      for (const column of projectColumns) {
        const resp = await kit.projects.listCards({
          column_id: column.id,
        })
        column.cards = resp.data.map((card) => ({
          column_id: column.id,
          project_id: project.id,
          project_name: project.name,
          ...card,
        }))
      }
      project.columns = projectColumns
    }
    state.projects = projects
  },
  setRepositories(state, repositories) {
    state.repositories = repositories
  },
}

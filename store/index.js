export const state = () => ({
  organization: null,
  members: [],
  projects: [],
  repositories: [],
  clientPrepared: false,
  activeRoom: null,
  activeRoomMessages: [],
  chatList: [],
  isFirstMatrixUse: false,
  showVideoCall: false,
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
  // MATRIX
  setActiveRoom(state, roomId) {
    state.activeRoom = roomId
  },
  setMessages(state, messages) {
    state.activeRoomMessages = messages
  },
  setClientPrepared(state, clientState) {
    state.clientPrepared = clientState
  },
  setFirstMatrixUse(state, isFirstUse) {
    state.isFirstMatrixUse = isFirstUse
  },
  startVideoCall(state) {
    state.showVideoCall = true
  },
  stopVideoCall(state) {
    state.showVideoCall = false
  },
}

export const actions = {
  async loadProjects({ commit, auth }) {
    const projects = await this.$axios.$get('/api/projects')
    commit('setProjects', projects)
  },
  async loadOrganization({ commit, auth }) {
    const organization = await this.$axios.$get('/api/organizations/')
    commit('setOrganization', organization)
  },
}

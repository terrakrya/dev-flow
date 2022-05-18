export const state = () => ({
  organization: null,
  members: [],
  projects: [],
  repositories: [],
  clientPrepared: false,
  activeRoom: null,
  activeRoomMessages: [],
  chatList: [],
  replyToMessage: null,
  editMessage: null,
  isFirstMatrixUse: true,
  showVideoCall: false,
  organizationInvite: null,
})

export const getters = {
  members(state) {
    return state.organization?.members
  },
}

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
  setReplyToMessage(state, message) {
    state.replyToMessage = message
  },
  setEditMessage(state, message) {
    state.editMessage = message
  },
  setOrganizationInvite(state, invite) {
    state.organizationInvite = invite
  },
}

export const actions = {
  async loadProjects({ commit, state, auth }) {
    const organizationId = state.organization?.id
    if (organizationId) {
      const projects = await this.$axios.$get(
        `/api/organizations/${organizationId}/projects`
      )
      commit('setProjects', projects)
    }
  },
  async loadOrganizations({ commit, auth }) {
    // const organization = await this.$axios.$get('/api/organizations/')
    // commit('setOrganization', organization)
  },
  async loadOrganization({ commit, state }) {
    const organizationId = state.organization?.id
    if (organizationId) {
      const organization = await this.$axios.$get(
        `/api/organizations/${organizationId}`
      )
      console.log('organization', organization)
      commit('setOrganization', organization)
    }
  },
  setActiveOrganization({ commit, dispatch, auth }, organization) {
    commit('setOrganization', organization)
    commit('setActiveRoom', null)
    dispatch('loadProjects')
    this.$matrix.activeRoom = null
    dispatch('chat/fetchSpaceRooms', [], { root: true })
  },
  activateDefaultOrganization({ commit, dispatch, rootState }) {
    if (rootState.auth.user.organizations.length > 0) {
      const defaultOrganization = rootState.auth.user.organizations[0] // procurar
      commit('setOrganization', defaultOrganization)
      dispatch('loadProjects')
    }
  },
  setReplyToMessage({ commit }, message) {
    commit('setReplyToMessage', message)
  },
  setEditMessage({ commit }, message) {
    commit('setEditMessage', message)
  },
}

export const state = () => ({
  selectedFolder: null,
})

export const mutations = {
  setSelectedFolder(state, folderId) {
    state.selectedFolder = folderId
  },
}

export const actions = {
  selectFolder({ commit }, folder) {
    commit('setSelectedFolder', folder)
  },
  clearSelectedFolder({ commit }) {
    commit('setSelectedFolder', null)
  },
}

export const state = () => ({
  selectedFolder: null,
  folders: {},
})

export const mutations = {
  setSelectedFolder(state, folderId) {
    state.selectedFolder = folderId
  },
  updateFolder(state, folder) {
    state.folders[folder.item] = folder
  },
}

export const actions = {
  selectFolder({ commit }, folder) {
    commit('setSelectedFolder', folder)
  },
  clearSelectedFolder({ commit }) {
    commit('setSelectedFolder', null)
  },
  async addFolderChild({ state }, { label, type, item, order, parentId }) {
    // api call add a child to a folder
    const folderId = parentId || state.selectedFolder
    if (!folderId) return
    const response = await this.$axios
      .put('/api/folders/' + folderId + '/addChild', {
        label,
        type,
        item,
        order,
      })
      .catch((err) => {
        console.log('error', err)
      })
    console.log('response', response)
  },
  updateFolderTree({ commit, state }, folderParams) {
    console.log('updateFolderTree', folderParams)
    let folder = state.folders[folderParams.item] ?? {}
    folder = { ...folder, ...folderParams }
    commit('updateFolder', folder)
    console.log('folder', folder)
  },
}

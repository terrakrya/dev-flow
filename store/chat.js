export const state = () => ({
  spaceRooms: [],
})

export const getters = {}
export const mutations = {
  setSpaceRooms(state, rooms) {
    state.spaceRooms = rooms
  },
}
export const actions = {
  setSpaceRooms({ commit }, rooms) {
    commit('setSpaceRooms', rooms)
  },
}

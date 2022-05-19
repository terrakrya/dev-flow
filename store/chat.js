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
  async fetchSpaceRooms({ commit, rootState }) {
    if (!rootState.organization?.mainRoom) return false

    let roomList = []
    const spaceSummary =
      (
        await this.$matrix.client?.getRoomHierarchy(
          rootState.organization.mainRoom
        )
      )?.rooms || []

    for (const entry of spaceSummary) {
      // const room = this.$matrix.client.getRoom(entry.room_id)
      if (entry.room_type !== 'm.space') roomList = [...roomList, entry]
    }
    commit('setSpaceRooms', roomList)
  },
  async createSpaceForOrg({ commit, dispatch, rootState }) {
    if (!rootState.organization || !this.$matrix.client?.isLoggedIn())
      return false

    const firstRoom = await this.$matrix.createRoom({
      name: rootState.organization?.name,
    })
    const spaceRoom = await this.$matrix.createSpace({
      name: rootState.organization?.name,
      childRoom: firstRoom.room_id,
    })

    if (spaceRoom) {
      await this.$axios.put(
        `/api/organizations/${rootState.organization?.id}`,
        {
          mainRoom: spaceRoom.room_id,
        }
      )
      // commit('setSpaceRooms', [
      //   { name: firstRoom.name, room_id: firstRoom.room_id },
      // ])

      commit(
        'setOrganization',
        { ...rootState.organization, mainRoom: spaceRoom.room_id },
        { root: true }
      )
      await dispatch('fetchSpaceRooms')
      commit('setActiveRoom', firstRoom.room_id, { root: true })
      return true
    } else {
      return false
    }
  },
}

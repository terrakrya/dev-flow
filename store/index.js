export const state = () => ({})

export const mutations = {
  SET_USER(state, user) {
    this.$auth.setUser(user)
  },
}

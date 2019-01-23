export const state = () => ({
  areas: [],
  area: null
})

export const getters = {
  // activeReport(state) {
  //   return state.reports.find(report => report.resolvedAt === null)
  // }
}

export const actions = {
  getAreas ({ commit }) {
    return this.$axios.$get('/resolver/areas').then(response => {
      commit('SET_AREAS', response.data)
    })
  }
}

export const mutations = {
  SET_AREAS (state, areas) {
    state.areas = areas
  }
}

export const state = () => ({
  areas: [],
  area: null,
  reports: [],
  report: null
})

export const actions = {
  getAreas ({ commit }) {
    return this.$axios.$get('/api/v1/resolver/areas').then(response => {
      commit('SET_AREAS', response.data)
    })
  },
  getReports ({ commit }) {
    return this.$axios.$get('/api/v1/resolver/reports').then(response => {
      commit('SET_REPORTS', response.data)
      commit(
        'SET_REPORT',
        response.data.find(report => report.resolvedAt === null)
      )
    })
  },
  getReport ({ commit }, id) {
    return this.$axios.$get(`/api/v1/resolver/reports/${id}`).then(response => {
      commit('SET_REPORT', response.data)
    })
  }
}

export const mutations = {
  SET_AREAS (state, areas) {
    state.areas = areas
  },
  SET_REPORTS (state, reports) {
    state.reports = reports
  },
  SET_REPORT (state, report) {
    if (!report) {
      state.report = null
      return
    }

    const lat = report.location ? report.location.coordinates[1] : 14.59804
    const lng = report.location ? report.location.coordinates[0] : 120.98385

    report.map = {
      center: [lat, lng],
      zoom: 13,
      minZoom: 13,
      maxZoom: 18,
      maxBoundsViscosity: 1.0
    }

    state.report = report
  }
}

import Vue from 'vue'

export const state = () => ({
  unresolvedReports: [],
  resolvedReports: [],
  report: null,
  isLoadMoreVisible: false
})

export const getters = {
  // unresolvedReports(state) {
  //   return state.reports.filter(report => report.resolvedAt === null)
  // }
}

export const actions = {
  getResolvedReports({ commit }) {
    return this.$axios.$get('/reports?resolvedOnly=true').then(response => {
      commit('SET_RESOLVED_REPORTS', response.data)
      commit('SET_LOAD_MORE_STATUS', response.data)
    })
  },
  getUnresolvedReports({ commit, dispatch }) {
    return this.$axios.$get('/reports?unresolvedOnly=true').then(response => {
      commit('SET_UNRESOLVED_REPORTS', response.data)
    })
  },
  getReport({ commit }, id) {
    return this.$axios.$get(`/reports/${id}`).then(response => {
      commit('SET_REPORT', response.data)
    })
  }
}

export const mutations = {
  SET_RESOLVED_REPORTS(state, reports) {
    state.resolvedReports = reports
  },
  SET_UNRESOLVED_REPORTS(state, reports) {
    state.unresolvedReports = reports
  },
  SET_REPORT(state, report) {
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
  },
  UNSHIFT_RESOLVED_REPORT(state, report) {
    state.resolvedReports.push(report)
  },
  SET_LOAD_MORE_STATUS(state, reports) {
    state.isLoadMoreVisible = !(reports.length < 10)
  },
  UPDATE_REPORT_MILESTONE(state, payload) {
    const reportIndex = state.unresolvedReports.findIndex(
      report => report._id === payload.reportId
    );

    let responseIndex = state.unresolvedReports[reportIndex].responses.findIndex(
      response => response._id === payload.response._id
    );

    Vue.set(
      state.unresolvedReports[reportIndex].responses,
      responseIndex,
      payload.response
    );
  },
  REPORT_RESOLVED(state, report) {
    const index = state.unresolvedReports.find(item => item._id === report._id)

    state.unresolvedReports.splice(index, 1)
  }
}

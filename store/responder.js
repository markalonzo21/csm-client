export const state = () => ({
  reports: [],
  report: null,
  loadingMarkAsDone: false
})

export const getters = {
  activeReport(state) {
    return state.reports.find(report => report.resolvedAt === null)
  }
}

export const actions = {
  getReports({ commit }) {
    return this.$axios.$get('/responder/reports').then(response => {
      commit('SET_REPORTS', response.data)
      commit('SET_REPORT', response.data.find(report => report.resolvedAt === null))
    })
  },
  getReport({ commit }, id) {
    return this.$axios.$get(`/responder/reports/${id}`).then(response => {
      commit('SET_REPORT', response.data)
    })
  },
  markAsDone({ state, commit }, id) {
    commit('LOADING_MARK_AS_DONE', true)
    this.$axios
      .$post('/responder/respond', {
        reportId: state.report._id,
        responseId: id
      })
      .then(response => {
        commit('SET_REPORT', response.data)
        commit('LOADING_MARK_AS_DONE', false)

        if (state.report.resolvedAt !== null) {
          alert('incident is resolved!')
        }
      })
      .catch(error => {
        commit('LOADING_MARK_AS_DONE', false)
      })
  }
}

export const mutations = {
  SET_REPORTS(state, reports) {
    state.reports = reports
  },
  SET_REPORT(state, report) {
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
  },
  LOADING_MARK_AS_DONE(state, trueOrFalse) {
    state.loadingMarkAsDone = trueOrFalse
  }
}

export const state = () => ({
  report: null,
  loadingMarkAsDone: false
})

export const actions = {
  getActiveReport ({ state, commit }) {
    return this.$axios.$get(`/respondent/active-report`).then(response => {
      commit('SET_ACTIVE_REPORT', response.data)
    })
  },
  markAsDone ({ state, commit }, id) {
    commit('LOADING_MARK_AS_DONE', true)
    this.$axios
      .$post('/respondent/respond', {
        reportId: state.report._id,
        responseId: id
      })
      .then(response => {
        commit('SET_ACTIVE_REPORT', response.data)
        commit('LOADING_MARK_AS_DONE', false)

        if (state.report.resolvedAt !== null) {
          alert('incident is resolved!')
          commit('SET_ACTIVE_REPORT', null)
        }
      })
      .catch(error => {
        console.log(error.response)
        commit('LOADING_MARK_AS_DONE', false)
      })
  }
}

export const mutations = {
  SET_ACTIVE_REPORT (state, report) {
    state.report = report
  },
  NEW_RESPONSE (state, milestoneId) {
    state.report.responses.push(milestoneId)
  },
  LOADING_MARK_AS_DONE (state, trueOrFalse) {
    state.loadingMarkAsDone = trueOrFalse
  }
}

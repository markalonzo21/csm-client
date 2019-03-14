export const state = () => ({
  form: {
    emailOrMobile: '',
    verificationCode: ''
  }
})

export const getters = {
  emailOrMobile (state) {
    if (state.form.emailOrMobile.includes('@')) {
      return 'Email'
    }
    return 'Mobile Number'
  },
  emailOrMobileSlug (state, getters) {
    return getters['emailOrMobile'].toLowerCase().replace(' ', '-')
  }
}

export const actions = {
  // getAreas ({ commit }) {
  //   return this.$axios.$get('/api/v1/resolver/areas').then(response => {
  //     commit('SET_AREAS', response.data)
  //   })
  // }
}

export const mutations = {
  SET_EMAIL_OR_MOBILE (state, value) {
    state.form.emailOrMobile = value
  },
  SET_VERIFICATION_CODE (state, value) {
    state.form.verificationCode = value
  }
}

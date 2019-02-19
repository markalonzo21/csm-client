export const state = () => ({
  settings: {
    logo: '/img/sentinel-logo.png'
  },
  loading: false,
  modals: {
    login: false,
    registration: false
  }
})

export const actions = {
  async nuxtServerInit ({ commit }, context) {
    let logoPath = '/img/sentinel-logo.png'
    if (process.env.APP_NAME === 'CSM') {
      logoPath = '/img/megaworld-logo.png'
    }
    commit('SET_LOGO', logoPath)
  }
}

export const mutations = {
  SET_LOGO (state, logoPath) {
    state.settings.logo = logoPath
  },
  TOGGLE_LOGIN_MODAL (state) {
    state.modals.login = !state.modals.login
  },
  TOGGLE_REGISTRATION_MODAL (state) {
    state.modals.registration = !state.modals.registration
  }
}

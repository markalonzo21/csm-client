export const state = () => ({
  loading: false,
  modals: {
    login: false,
    registration: false
  }
})

export const mutations = {
  TOGGLE_LOGIN_MODAL(state) {
    state.modals.login = !state.modals.login
  },
  TOGGLE_REGISTRATION_MODAL(state) {
    state.modals.registration = !state.modals.registration
  }
}

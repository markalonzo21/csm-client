export const state = () => ({
  loading: false,
  modals: {
    login: false,
    registration: false
  }
})

export const getters = {
  showPhoto: state => photo => {
    if (photo.indexOf("https://") > -1) {
      photo = photo.split('/')

      const lastSegment = photo.pop()
      const beforeLastSegment = photo.pop()

      photo.push('w_200,h_200')

      photo.push(beforeLastSegment)
      photo.push(lastSegment)

      return photo.join('/')
    }

    const baseUrl = process.env.API_URL
      ? process.env.API_URL
      : 'https://irs-api.now.sh'
    return `${baseUrl}/${photo}`
  }
}

export const mutations = {
  TOGGLE_LOGIN_MODAL(state) {
    state.modals.login = !state.modals.login
  },
  TOGGLE_REGISTRATION_MODAL(state) {
    state.modals.registration = !state.modals.registration
  }
}

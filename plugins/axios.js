require('dotenv').config()

export default function ({ $axios, app }) {
  $axios.onRequest(config => {
    if (!process.env.API_URL) {
      config.url = `/api${config.url}`
    }

    return config
  })

  $axios.onError(error => {
    if (
      error.response.status === 401 &&
      error.response.data.message === 'E_LOGIN_FAILED: Invalid Token'
    ) {
      app.$auth.reset()
    }
    // console.log({ 'error-response': error.response.data })
  })
}

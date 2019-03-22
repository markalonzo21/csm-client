require('dotenv').config()

export default function ({ $axios, app }) {
  $axios.onRequest(config => {
    console.log(config.url)
    if (!process.env.API_URL) {
      config.url = `${config.url}`
    }

    return config
  })

  $axios.onError(error => {
    if (
      error.response &&
      error.response.data.message === 'E_LOGIN_FAILED: Invalid Token'
    ) {
      app.$auth.reset()
    }
    console.log({ 'error-response': error.response })
  })
}

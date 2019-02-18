require('dotenv').config()

export default function ({ $axios }) {
  $axios.onRequest(config => {
    if (!process.env.API_URL) {
      config.url = `/api${config.url}`
    }

    return config
  })

  $axios.onError(error => {
    console.log({ 'error-response': error.response.body })
  })
}

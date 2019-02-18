import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

module.exports = {
  mode: 'universal',
  serverMiddleware: ['~/serverMiddleware/selectiveSsr.js'],
  env: {
    NODE_ENV: process.env.NODE_ENV,
    API_PROXY: process.env.API_PROXY,
    API_PROXY_TARGET: process.env.API_PROXY_TARGET,
    API_URL: process.env.API_URL,
    API_URL_BROWSER: process.env.API_URL_BROWSER
  },
  /*
   ** Headers of the page
   */
  head: {
    title: 'CSM Report',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'CSM Report Application'
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#3B8070' },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/tailwind.css',
    '~/node_modules/ant-design-vue/dist/antd.css',
    '~/node_modules/bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/leaflet.css',
    {
      src: '~/assets/sass/app.scss',
      lang: 'sass'
    }
  ],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/axios.js',
    '~/plugins/globals.js',
    '~/plugins/utils.js',
    '~/plugins/vue-svgicon.js',
    '~/plugins/uiv.js',
    '~/plugins/ant.js',
    '~/plugins/vue-chance.client.js',
    '~/plugins/vue2-leaflet.client.js',
    '~/plugins/vue2-leaflet-heatmap.client.js',
    '~/plugins/socket.client.js',
    '~/plugins/vue-geolocation.client.js',
    '~/plugins/leaflet-draw.client.js'
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/dotenv',
    '@nuxtjs/moment',
    '@cknow/nuxt-modular'
  ],

  /**
   * Axios and Proxy Module
   */
  axios: {
    baseURL: process.env.API_URL ? process.env.API_URL : 'http://localhost:3000/api/v1',
    browserBaseURL: process.env.API_URL_BROWSER ? process.env.API_URL_BROWSER : 'http://localhost:3000/api/v1',
    https: process.NODE_ENV === 'production',
    proxy: process.env.API_PROXY == 'true',
    debug: process.env.API_DEBUG == 'true'
  },
  proxy: {
    '/api': process.env.API_PROXY_TARGET
      ? process.env.API_PROXY_TARGET
      : 'http://localhost:3333',
    '/swagger': process.env.API_PROXY_TARGET
      ? process.env.API_PROXY_TARGET
      : 'http://localhost:3333'
  },

  router: {
    middleware: ['auth']
  },

  auth: {
    redirect: false,
    watchLoggedIn: false,
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'data.token'
          },
          logout: false,
          // logout: {
          //   url: '/auth/logout',
          //   method: 'post'
          // },
          user: {
            url: '/auth/me',
            method: 'get',
            propertyName: 'data'
          }
        }
      }
    }
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend (config, ctx) {
      ;(config.node = {
        fs: 'empty'
      }),
      (config.resolve.alias['leaflet'] = path.join(
        __dirname,
        'node_modules/leaflet'
      ))
    }
  }
}

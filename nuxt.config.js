const pkg = require('./package')
import dotenv from 'dotenv'
dotenv.config()

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#3B8070' },

  /*
   ** Global CSS
   */
  css: ['~/assets/css/tailwind.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/vue-chance.js', ssr: false },
    // { src: '~/plugins/leaflet-heat.js', ssr: false },
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/dotenv',
    // 'nuxt-leaflet',
  ],

  /*
   ** Axios module configuration
   */
  axios: {
    https: process.NODE_ENV === 'production' ? true : false,
    // debug: true,
  },

  router: {
    middleware: ['auth'],
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post',
            propertyName: 'data.token',
          },
          logout: {
            url: '/auth/logout',
            method: 'post',
          },
          user: {
            url: '/auth/me',
            method: 'get',
            propertyName: 'data',
          },
        },
      },
    },
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
}

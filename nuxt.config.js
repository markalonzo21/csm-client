import path from 'path'
import dotenv from 'dotenv'
const pkg = require('./package')
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
      { hid: 'description', name: 'description', content: pkg.description }
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
    { src: '~/plugins/vue-svgicon', ssr: true },
    { src: '~/plugins/uiv.js', ssr: true },
    { src: '~/plugins/ant', ssr: true },
    { src: '~/plugins/vue-chance.js', ssr: false },
    { src: '~/plugins/vue2-leaflet.js', ssr: false },
    { src: '~/plugins/vue2-leaflet-heatmap.js', ssr: false },
    { src: '~/plugins/socket', ssr: false },
    { src: '~/plugins/vue-geolocation', ssr: false },
    { src: '~/plugins/leaflet-draw', ssr: false }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/dotenv',
    '@nuxtjs/moment'
  ],

  /*
   ** Axios module configuration
   */
  axios: {
    https: process.NODE_ENV === 'production'
    // debug: true,
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
      config.resolve.alias['./images/layers.png$'] = path.resolve(
        __dirname,
        'node_modules/leaflet/dist/images/layers.png'
      )
      config.resolve.alias['./images/layers-2x.png$'] = path.resolve(
        __dirname,
        'node_modules/leaflet/dist/images/layers-2x.png'
      )
      config.resolve.alias['./images/marker-icon.png$'] = path.resolve(
        __dirname,
        'node_modules/leaflet/dist/images/marker-icon.png'
      )
      config.resolve.alias['./images/marker-icon-2x.png$'] = path.resolve(
        __dirname,
        'node_modules/leaflet/dist/images/marker-icon-2x.png'
      )
      config.resolve.alias['./images/marker-shadow.png$'] = path.resolve(
        __dirname,
        'node_modules/leaflet/dist/images/marker-shadow.png'
      )
    }
  }
}

import dotenv from "dotenv";
const pkg = require("./package");
dotenv.config();

module.exports = {
  mode: "universal",

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: pkg.description }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#3B8070" },

  /*
   ** Global CSS
   */
  css: ["~/assets/css/tailwind.css"],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: "~/plugins/vue-chance.js", ssr: false },
    { src: "~/plugins/vue2-leaflet-heatmap.js", ssr: false },
    { src: "~/plugins/uiv.js", ssr: true }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/auth", "@nuxtjs/dotenv", "nuxt-leaflet"],

  /*
   ** Axios module configuration
   */
  axios: {
    https: process.NODE_ENV === "production"
    // debug: true,
  },

  router: {
    middleware: ["auth"]
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {
            url: "/auth/login",
            method: "post",
            propertyName: "data.token"
          },
          logout: false,
          // logout: {
          //   url: '/auth/logout',
          //   method: 'post'
          // },
          user: {
            url: "/auth/me",
            method: "get",
            propertyName: "data"
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
    extend(config, ctx) {}
  }
};

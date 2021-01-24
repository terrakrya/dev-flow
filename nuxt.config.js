export default {
  // Disable server-side rendering (https://go.nuxtjs.dev/ssr-mode)
  ssr: true,
  serverMiddleware: ['~/api/index.js'],
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title:
      'DevFlow - Awesome tools that helps you to manage your software development flow',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['~/assets/css/custom.sass'],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: ['~/plugins/global-mixin.js'],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/stylelint
    '@nuxtjs/stylelint-module',
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/bootstrap
    'bootstrap-vue/nuxt',
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    // https://go.nuxtjs.dev/pwa
    '@nuxtjs/pwa',
    // https://go.nuxtjs.dev/content
    '@nuxt/content',
    '@nuxtjs/auth-next',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {},

  // Content module configuration (https://go.nuxtjs.dev/config-content)
  content: {},

  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/admin',
      home: '/admin',
    },
    strategies: {
      github: {
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        redirectUri: process.env.GITHUB_CALLBACK,
      },
    },
  },
  bootstrapVue: {
    icons: true,
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},
}

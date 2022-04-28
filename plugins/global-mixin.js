import Vue from 'vue'
if (!Vue.__my_mixin__) {
  Vue.__my_mixin__ = true
  Vue.mixin({
    computed: {
      octokit() {
        const { Octokit } = require('@octokit/rest')
        return new Octokit({
          auth: this.$auth.strategy.token.get(),
        })
      },
      // org() {
      //   return this.$store.state.organization.id
      // },
    },
    methods: {
      showError(error) {
        if (error.response) {
          if (error.response.data) {
            if (
              error.response.status === 401 &&
              error.response.data.includes('invalid signature')
            ) {
              this.$toast.error('Sessão expirada!')
              this.$auth.logout()
            } else if (error.response.data.message) {
              this.$toast.error(error.response.data.message)
            } else if (error.response.data.error) {
              this.$toast.error(error.response.data.error.message)
            } else {
              this.$toast.error(error.response.data)
            }
          } else {
            this.$toast.error(error.response)
          }
        }
      },
    },
  })
}

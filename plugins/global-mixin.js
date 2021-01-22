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
      org() {
        return 'terrakrya'
      },
    },
  })
}

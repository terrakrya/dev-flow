import Vue from 'vue'
if (!Vue.__my_mixin__) {
  Vue.__my_mixin__ = true
  Vue.mixin({
    computed: {
      octokit() {
        const { Octokit } = require('@octokit/rest')
        console.log(this.$auth.strategy.token.get())
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

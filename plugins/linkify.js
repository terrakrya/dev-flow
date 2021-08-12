import Vue from 'vue'
import * as linkify from 'linkifyjs'
import linkifyHtml from 'linkifyjs/html'
// import hashtag from 'linkifyjs/plugins/hashtag'
import mention from 'linkifyjs/plugins/mention'
// hashtag(linkify)
mention(linkify)

function linkified(el, binding) {
  el.innerHTML = linkifyHtml(el.innerHTML, {
    target: (href, type) => {
      return type === 'url' && '_blank'
    },
    nl2br: true, // optional
    formatHref: {
      // hashtag: (href) => `/project/${href.replace('#', '')}`,
      mention: (href) => `/members${href.replace('@', '')}`,
    },
    className: {
      hashtag: 'hashtag',
      mention: 'mention',
    },
  })
}

Vue.directive('linkify', linkified)

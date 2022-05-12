import Vue from 'vue'

Vue.directive('observable', {
  bind: (el, binding) => {
    try {
      el.observerFunction = new IntersectionObserver(
        (entries) => {
          if (typeof binding.value === 'function') {
            if (binding.arg === 'enter') {
              if (entries[0].isIntersecting) binding.value()
            } else if (binding.arg === 'leave') {
              if (!entries[0].isIntersecting) binding.value()
            } else {
              binding.value(entries[0].isIntersecting)
            }
          }
        },
        { threshold: [0] }
      )
      el.observerFunction.observe(el)
    } catch (error) {
      console.error('ObservableDiv Error', error)
    }
  },
  unbind: (el) => {
    el.observerFunction?.disconnect()
  },
})

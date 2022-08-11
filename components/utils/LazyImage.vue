<template>
  <div ref="wrapper" class="wrapper" v-bind="$attrs">
    <div class="relative">
      <UtilsBlurHash
        :hash="blurhash"
        :aspect-ratio="height / width"
        class=""
        :class="isLoaded ? 'opacity-0' : 'opacity-100'"
      />

      <img
        ref="image"
        :alt="alt"
        :width="width"
        :src="activeSrc"
        :height="height"
        class="blurhash-placeholder image"
        :class="isLoaded ? 'opacity-100' : 'opacity-0'"
        @load="onLoad"
      />
    </div>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    src: {
      type: String,
      required: true,
    },
    blurhash: {
      type: String,
      required: false,
      default: 'LlNA}44TN{kqyEtls:xux^tRRjRi',
    },
    width: {
      type: Number,
      default: 1,
    },
    height: {
      type: Number,
      default: 1,
    },
    alt: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isLoaded: false,
      activeSrc: null,
    }
  },
  mounted() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.onEnter()
      }
    })
    this.observer.observe(this.$refs.wrapper)
  },
  unmounted() {
    this.observer.disconnect()
  },
  methods: {
    onEnter() {
      this.activeSrc = this.src
    },
    onLoad() {
      this.isLoaded = true
    },
  },
}
</script>
<style>
.relative {
  position: relative;
}
.blurhash-placeholder {
  position: absolute;
  top: 0;
  left: 0;
}

.image {
  width: 100%;
  height: auto;
  border-radius: 6px;
}
.wrapper {
  max-height: 400px;
  max-width: 400px;
}
.opacity-0 {
  opacity: 0;
}
.opacity-100 {
  opacity: 1;
}
</style>

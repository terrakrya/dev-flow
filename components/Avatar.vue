<template>
  <b-avatar :size="size" :src="avatarSrc" :text="text" :alt="alt"></b-avatar>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    src: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: '4rem',
    },
  },
  computed: {
    alt() {
      return this.name && this.name.length > 0 ? this.name[0].toUpperCase() : ''
    },
    text() {
      return !this.src ? this.alt : null
    },
    avatarSrc() {
      if (!this.src) {
        return null
      }
      return `${process.env.DEFAULT_STORAGE_BUCKET_FULL_URL}${this.src}`
    },
  },
}
</script>

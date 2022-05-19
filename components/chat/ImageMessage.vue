<template>
  <div>
    <UtilsLazyImage
      :src="imageInfo.url"
      :alt="message.content"
      :blurhash="imageInfo.blurhash"
      :width="imageInfo.width"
      :height="imageInfo.height"
    />
    <small>{{ message.content }}</small>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    imageInfo() {
      const event = this.$matrix.activeRoom?.findEventById(this.message.id)
      const content = event?.getContent()

      const imageWidth = content.info.w
      const imageHeight = content.info.h
      const imageHash = content.info['xyz.amorgan.blurhash']
      return content?.url
        ? {
            url: this.$matrix.client?.mxcUrlToHttp(content.url),
            width: imageWidth,
            height: imageHeight,
            blurhash: imageHash,
          }
        : null
    },
  },
}
</script>

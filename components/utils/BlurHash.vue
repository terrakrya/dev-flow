<template>
  <div :style="`position: relative; padding-bottom: ${aspectRatio * 100}%`">
    <canvas ref="canvas" class="hash-canvas" width="32" height="32" />
  </div>
</template>

<script>
import { decode } from 'blurhash'
export default {
  props: {
    hash: {
      type: String,
      required: true,
    },
    aspectRatio: {
      type: Number,
      default: 1,
    },
  },
  mounted() {
    const pixels = decode(this.hash, 32, 32)
    const imageData = new ImageData(pixels, 32, 32)
    const context = this.$refs.canvas.getContext('2d')
    context.putImageData(imageData, 0, 0)
  },
}
</script>
<style>
.hash-canvas {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 6px;
}
</style>

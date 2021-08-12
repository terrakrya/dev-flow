<template>
  <b-form class="input" @submit="onClick">
    <b-input-group>
      <b-input v-model="message" />
      <template #append>
        <b-button @click="onClick">Enviar</b-button>
      </template>
    </b-input-group>
  </b-form>
</template>

<script>
export default {
  data() {
    return {
      message: '',
    }
  },
  methods: {
    onClick(event) {
      event.preventDefault()
      this.$emit('submit', this.message)
      this.message = ''
    },
  },
}
</script>
<style>
.input {
  width: 100%;
  height: 100px;
}
</style>

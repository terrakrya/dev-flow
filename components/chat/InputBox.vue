<template>
  <b-form @submit="onClick">
    <b-row>
      <b-col>
        <b-input v-model="message" />
      </b-col>
      <b-col>
        <b-button @click="onClick">Enviar</b-button>
      </b-col>
    </b-row>
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

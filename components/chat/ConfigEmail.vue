<template>
  <div>
    <b-button v-b-modal="'modal-form-mail'">Configurar Email</b-button>
    <b-modal id="modal-form-mail" ref="modal" @ok="onOk">
      <b-form title="Configurar Email" @submit.prevent="onSubmit">
        <!--
            <b-form-group v-if="!project" label="Projeto">
              <b-form-select
                v-model="form.project"
                :options="projects"
                value-field="id"
                text-field="name"
              >
              </b-form-select>
            </b-form-group>
            -->

        <b-form-group
          label="Insira um Email. Você vai precisar entrar e confirmar"
        >
          <b-form-input
            v-model="form.email"
            required
            type="email"
          ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        email: '',
      },
    }
  },
  methods: {
    onOk(event) {
      this.onSubmit()
      this.$refs.modal.hide()
    },
    onSubmit(event) {
      this.$emit('submit', { email: this.form.email })
      this.form.email = ''
      this.$refs.modal.hide()
    },
  },
}
</script>

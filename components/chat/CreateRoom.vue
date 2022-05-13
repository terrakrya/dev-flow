<template>
  <div>
    <b-button
      v-b-modal="'modal-create-room'"
      block
      variant="outline-success"
      class="m-2"
      ><b-icon-plus-circle-fill class="mr-1" /> Criar Sala
    </b-button>
    <b-modal id="modal-create-room" ref="modal-create-room" @ok="onOk">
      <b-form title="Criar Sala" @submit.prevent="onSubmit">
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

        <b-form-group label="Nome da Sala">
          <b-form-input
            v-model="form.name"
            :state="validation ? false : null"
            required
            placeholder="Sala Geral"
          ></b-form-input>
          <b-form-invalid-feedback id="input-live-feedback">
            {{ validation }}
          </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group label="Assunto da sala (opcional)">
          <b-form-input
            v-model="form.topic"
            placeholder="Sala para discusões gerais"
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
      validation: null,
      form: {
        name: '',
        topic: '',
      },
    }
  },
  methods: {
    onOk(event) {
      event.preventDefault()
      if (!this.form.name) {
        this.validation = 'O nome da sala é obrigatório'
        return
      } else {
        this.validation = null
      }
      this.onSubmit()
    },
    onSubmit() {
      this.$emit('submit', { name: this.form.name, topic: this.form.topic })
      this.form.name = ''
      // this.$bvModal.hide('modal-create-room')
      this.$nextTick(() => {
        // this.$refs['modal-create-room'].hide()
        this.$bvModal.hide('modal-create-room')
      })
    },
  },
}
</script>

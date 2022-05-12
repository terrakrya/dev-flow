<template>
  <div>
    <b-button
      ref="modal"
      v-b-modal="'modal-form'"
      block
      variant="outline-success"
      class="m-2"
      ><b-icon-plus-circle-fill class="mr-1" /> Criar Sala
    </b-button>
    <b-modal id=" modal-form" @ok="onOk">
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
          <b-form-input v-model="form.name" default="teste"></b-form-input>
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
        name: '',
      },
    }
  },
  methods: {
    onOk(event) {
      this.onSubmit()
      this.$refs.modal.hide()
    },
    onSubmit(event) {
      this.$emit('submit', { name: this.form.name })
      this.form.name = ''
      this.$refs.modal.hide()
    },
  },
}
</script>

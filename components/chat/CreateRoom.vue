<template>
  <div>
    <b-button v-b-modal="'modal-form'">Criar Sala</b-button>
    <b-modal id="modal-form" @ok="onSubmit">
      <b-form title="Criar Sala">
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
      showCreateRoom: false,
      form: {
        name: '',
      },
    }
  },
  methods: {
    onSubmit(event) {
      this.$emit('submit', { name: this.form.name })
      this.form.name = ''
    },
  },
}
</script>

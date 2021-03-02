<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <b-form-group label="Nome *">
        <validation-provider v-slot="{ errors }" name="nome" rules="required">
          <b-form-input v-model="form.name" name="name" />
          <span class="text-danger">{{ errors[0] }}</span>
        </validation-provider>
      </b-form-group>
      <b-form-group label="Descrição">
        <b-form-textarea v-model="form.description" />
      </b-form-group>
      <b-form-group label="Repositório">
        <b-form-select
          v-model="form.repository"
          :options="repositories"
          value-field="id"
          text-field="name"
        >
        </b-form-select>
      </b-form-group>
      <div class="text-right text-danger">
        <a @click="archive">
          <b-icon-trash />
          Arquivar projeto
        </a>
        <br />
        <br />
      </div>
      <b-button type="submit" variant="secondary" block :disabled="invalid">
        Salvar
      </b-button>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { apiDataToForm } from './utils'
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
  },
  props: {
    edit: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        organization: 'terrakrya',
        name: '',
        description: '',
        repository: null,
      },
    }
  },
  computed: {
    repositories() {
      return this.$store.state.repositories
    },
  },
  created() {
    if (this.edit) {
      apiDataToForm(this.form, this.edit)
    }
  },
  methods: {
    async save() {
      if (this.edit) {
        const project = await this.$axios
          .$put('/api/projects/' + this.edit._id, this.form)
          .catch(this.showError)
        if (project) {
          this.$toast.success('Projeto atualizado com sucesso!')
          this.$emit('change', project)
        }
      } else {
        const project = await this.$axios
          .$post('/api/projects', this.form)
          .catch(this.showError)
        if (project) {
          this.$toast.success('Projeto cadastrado com sucesso!')
          this.$emit('change', project)
        }
      }
    },
    async archive() {
      const confirmed = await this.$bvModal.msgBoxConfirm('Tem certeza disso?')
      if (confirmed) {
        const project = await this.$axios
          .$delete('/api/projects/' + this.edit._id)
          .catch(this.showError)
        this.$toast.success('Projeto arquivado com sucesso!')
        this.$emit('archived', project)
      }
    },
  },
}
</script>

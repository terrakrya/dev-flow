<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <b-form-group label="Repositório">
        <b-form-select
          v-model="form.repository"
          :options="repositories"
          value-field="id"
          text-field="name"
          @change="repositorySelected"
        >
        </b-form-select>
      </b-form-group>
      <b-form-group label="Nome *">
        <validation-provider v-slot="{ errors }" name="nome" rules="required">
          <b-form-input v-model="form.name" name="name" />
          <span class="text-danger">{{ errors[0] }}</span>
        </validation-provider>
      </b-form-group>
      <b-form-group label="Descrição">
        <b-form-textarea v-model="form.description" />
      </b-form-group>
      <b-form-group label="Cor">
        <b-form-input v-model="form.color" type="color" class="w-25" />
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
        repository: null,
        name: '',
        description: '',
        color: '#161b22',
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
    repositorySelected(id) {
      const repository = this.repositories.find(
        (repository) => repository.id === id
      )
      if (repository) {
        this.form.name = repository.name.replaceAll('-', ' ')
        this.form.description = repository.description
      }
    },
    async save() {
      const activeOrganizationId = this.$store.state.organization.id
      const requestData = { ...this.form, organization: activeOrganizationId }
      if (this.edit) {
        const project = await this.$axios
          .$put('/api/projects/' + this.edit._id, requestData)
          .catch(this.showError)
        if (project) {
          this.$toast.success('Projeto atualizado com sucesso!')
          this.$emit('change', project)
        }
      } else {
        const project = await this.$axios
          .$post('/api/projects', requestData)
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

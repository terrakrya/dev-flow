<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <b-row>
        <b-col>
          <b-form-group label="Nome *">
            <validation-provider
              v-slot="{ errors }"
              name="nome"
              rules="required"
            >
              <b-form-input v-model="form.name" name="name" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <b-form-group label="Descrição">
            <validation-provider
              v-slot="{ errors }"
              name="descrição"
              rules="required"
            >
              <b-form-textarea v-model="form.description" name="description" />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
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
      },
    }
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
          .$put('/api/projects/' + this.edit.slug, this.form)
          .catch(this.showError)
        if (project) {
          this.$toast.success('Projeto atualizado com sucesso!')
          this.$emit('saved')
        }
      } else {
        const project = await this.$axios
          .$post('/api/projects', this.form)
          .catch(this.showError)
        if (project) {
          this.$toast.success('Projeto cadastrado com sucesso!')
          this.$emit('saved')
        }
      }
    },
  },
}
</script>

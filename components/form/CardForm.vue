<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <b-form-group>
        <validation-provider
          v-slot="{ errors }"
          name="conteúdo"
          rules="required"
        >
          <b-form-textarea v-model="form.note" rows="5" />
          <small class="text-muted">
            Este campo aceita
            <a href="https://markdown-it.github.io/" target="_blank"
              >markdown</a
            >
          </small>
          <span class="text-danger">{{ errors[0] }}</span>
        </validation-provider>
      </b-form-group>
      <b-form-group v-if="!project" label="Projeto">
        <b-form-select
          v-model="form.project"
          :options="projects"
          value-field="id"
          text-field="name"
        >
        </b-form-select>
      </b-form-group>
      <div v-if="edit" class="text-right text-danger mb-4">
        <small>
          <a @click="archive">
            <b-icon-trash />
            Arquivar cartão
          </a>
        </small>
      </div>
      <b-button type="submit" variant="secondary" block :disabled="invalid">
        Salvar
      </b-button>
      <pre>{{ form }}</pre>
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
    project: {
      type: Object,
      default: () => null,
    },
    edit: {
      type: Object,
      default: () => null,
    },
  },
  data() {
    return {
      form: {
        organization: 'terrakrya',
        project: this.project.id,
        note: '',
        members: [this.$auth.user.id],
        status: 'backlog',
      },
    }
  },
  computed: {
    projects() {
      return this.$store.state.projects
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
        const card = await this.$axios
          .$put('/api/cards/' + this.edit._id, this.form)
          .catch(this.showError)
        if (card) {
          this.$toast.success('Cartão atualizado com sucesso!')
          this.$emit('change', card)
        }
      } else {
        const card = await this.$axios
          .$post('/api/cards', this.form)
          .catch(this.showError)
        if (card) {
          this.$toast.success('Cartão cadastrado com sucesso!')
          this.$emit('change', card)
        }
      }
    },
    async archive() {
      const confirmed = await this.$bvModal.msgBoxConfirm('Tem certeza disso?')
      if (confirmed) {
        const card = await this.$axios
          .$delete('/api/cards/' + this.edit._id)
          .catch(this.showError)
        if (card) {
          this.$toast.success('Cartão arquivado com sucesso!')
          this.$emit('change', card)
        }
      }
    },
  },
}
</script>

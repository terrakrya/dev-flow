<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <!-- <b-form-group label="Repositório">
        <b-form-select
          v-model="form.repository"
          :options="repositories"
          value-field="id"
          text-field="name"
          @change="repositorySelected"
        >
        </b-form-select>
      </b-form-group> -->
      <b-row>
        <b-col sm="12">
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
          <b-form-group label="Descrição">
            <b-form-textarea v-model="form.description" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group label="Dias total do ciclo de entrega *">
            <validation-provider
              v-slot="{ errors }"
              name="numberCycleDays"
              rules="required"
            >
              <b-form-input
                v-model="form.numberCycleDays"
                name="numberCycleDays"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Dia de inicio do Ciclo *">
            <validation-provider
              v-slot="{ errors }"
              name="startDayEachCycle"
              rules="required"
            >
              <b-form-input
                v-model="form.startDayEachCycle"
                name="startDayEachCycle"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group label="Link do Repo. Git *">
            <validation-provider
              v-slot="{ errors }"
              name="gitRepositoryLink"
              rules="required"
            >
              <b-form-input
                v-model="form.gitRepositoryLink"
                name="gitRepositoryLink"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Link NextClound *">
            <validation-provider
              v-slot="{ errors }"
              name="linkDocNextclound"
              rules="required"
            >
              <b-form-input
                v-model="form.linkDocNextclound"
                name="linkDocNextclound"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="6">
          <b-form-group label="Link Sala Matrix *">
            <validation-provider
              v-slot="{ errors }"
              name="matrixRoomLink"
              rules="required"
            >
              <b-form-input
                v-model="form.matrixRoomLink"
                name="matrixRoomLink"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
        <b-col sm="6">
          <b-form-group label="Link da Documentação *">
            <validation-provider
              v-slot="{ errors }"
              name="documentationLink"
              rules="required"
            >
              <b-form-input
                v-model="form.documentationLink"
                name="documentationLink"
              />
              <span class="text-danger">{{ errors[0] }}</span>
            </validation-provider>
          </b-form-group>
        </b-col>
      </b-row>
      <b-form-group label="Cor">
        <b-form-input v-model="form.color" type="color" class="w-25" />
      </b-form-group>
      <div>
        <b-form-group label="Tags">
          <input v-model="newTag" placeholder="Adicione tags aqui" />
          <b-button @click="addTag(newTag)">Adicionar</b-button>
        </b-form-group>
        <div class="mb-5">
          <span
            v-for="(tag, index) in form.tags"
            :key="index"
            class="badge badge-secondary mr-2"
          >
            <span>{{ tag }}</span>
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click="removeTag(index)"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </span>
        </div>
      </div>
      <b-button type="submit" variant="secondary" block :disabled="invalid">
        Salvar
      </b-button>
      <div class="text-right text-danger mt-5">
        <a @click="archive">
          <b-icon-trash />
          Arquivar projeto
        </a>
      </div>
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
        tags: [],
        numberCycleDays: 30,
        startDayEachCycle: 5,
        documentationLink: '',
        gitRepositoryLink: '',
        linkDocNextclound: '',
        matrixRoomLink: '',
      },
      newTag: '',
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
    addTag(tag) {
      if (tag.trim() !== '' && !this.form.tags.includes(tag)) {
        this.form.tags = [...this.form.tags, tag.trim()]
      }
      this.newTag = ''
    },
    removeTag(index) {
      const updatedTags = [...this.form.tags]
      updatedTags.splice(index, 1)
      this.form.tags = updatedTags
    },
  },
}
</script>

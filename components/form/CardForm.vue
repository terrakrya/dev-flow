<template>
  <ValidationObserver v-slot="{ validate, invalid }">
    <b-form @submit.prevent="validate().then(save)">
      <b-form-group v-if="!project" label="Projeto">
        <b-form-select
          v-model="form.project"
          :options="projects"
          value-field="id"
          text-field="name"
        >
        </b-form-select>
      </b-form-group>
      <div v-if="form.project">
        <b-form-group
          description="Escreva um resumo da história de forma que ajude a identificar o conteúdo"
        >
          <validation-provider
            v-slot="{ errors }"
            name="título"
            rules="required"
          >
            <b-form-textarea
              v-model="form.title"
              rows="1"
              max-rows="8"
              grow
              placeholder="Título"
            />
            <span class="text-danger">{{ errors[0] }}</span>
          </validation-provider>
        </b-form-group>
        <b-form-group
          description="Descreva com o máximo de detalhes o a história para que seja fácil do responsável entender a questão"
        >
          <Mentionable
            :keys="['@']"
            :items="
              members.map((member) => ({
                value: member.name,
                avatar_url: member.avatarUrl,
              }))
            "
            offset="6"
          >
            <quill-editor
              ref="quillEdit"
              v-model="form.note"
              class="mt-4"
              toolbar="minimal"
              placeholder="Descrição detalhada"
            />
            <!-- eslint-disable-next-line vue/no-lone-template -->
            <template #item-@="{ item }">
              <div class="user">
                <b-avatar
                  :src="item.avatar_url"
                  class="mr-1"
                  size="2rem"
                  :alt="item.value"
                />
                <span class="dim"> {{ item.value }} </span>
              </div>
            </template>
          </Mentionable>
          <accept-markdown />
        </b-form-group>
        <b-form-group
          v-if="form.status !== 'backlog'"
          label="Instruções de teste"
        >
          <quill-editor
            ref="quillEdit"
            v-model="form.test_instructions"
            toolbar="minimal"
          />
          <accept-markdown />
          <span class="text-danger">{{ errors[0] }}</span>
        </b-form-group>
        <b-form-group label="Timeline">
          <b-form-checkbox v-model="form.timeline" switch>
            Incluir esse card na Timeline do projeto?
          </b-form-checkbox>
        </b-form-group>
        <b-form-group label="Membros">
          <FormMembersSelect v-model="form.members" />
        </b-form-group>
        <div class="tempo">
          <div class="row">
            <div class="col-md-4">
              <small>Data Prevista</small>
              <b-form-input
                v-model="form.due_date"
                size="sm"
                type="date"
                placeholder="Data prevista"
              />
            </div>
            <div class="col-md-4">
              <small>Data Inicio</small>
              <b-form-input
                v-model="form.start_date"
                size="sm"
                type="date"
                placeholder="Data inicio"
              />
            </div>
            <div class="col-md-4">
              <small>Data Produção</small>
              <b-form-input
                v-model="form.end_date"
                size="sm"
                type="date"
                placeholder="Data end_date"
              />
            </div>
          </div>
          <div class="row pt-3">
            <div class="col-md-4">
              <small>Tempo estimado (horas)</small>
              <input
                v-model="form.time_estimate"
                size="sm"
                type="number"
                placeholder="Tempo estimado (horas)"
                append="Horas"
              />
            </div>
            <div class="col-md-4">
              <small>Tempo gasto (horas)</small>
              <input
                v-model="form.time_spent"
                size="sm"
                type="number"
                placeholder="Tempo gasto (horas)"
              />
            </div>
            <div class="cold-md-4">&nbsp;</div>
          </div>
        </div>
        <Upload
          v-model="form.documents"
          type="documents"
          label="Documentos"
          edit-title
          multiple
        />
        <Upload v-model="form.images" type="images" label="Imagens" multiple />
        <b-row>
          <b-col md="6">
            <b-form-group label="Status">
              <b-form-select
                v-model="form.status"
                :options="statusList"
                value-field="id"
                text-field="name"
                class="mb-3"
              >
              </b-form-select>
              <b-form-checkbox
                v-if="form.status === 'backlog'"
                v-model="form.reviewed"
                name="check-button"
                switch
              >
                {{
                  form.reviewed
                    ? 'Revisado'
                    : 'Esta história ainda não foi revisada'
                }}
              </b-form-checkbox>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Tags">
          <span
            v-for="(tag, index) in combinedTags"
            :key="index"
            :class="{
              badge: true,
              'badge-success': form.tags.includes(tag),
              'badge-secondary': !form.tags.includes(tag),
              'mr-3': true,
            }"
          >
            {{ tag }}
            <button
              type="button"
              class="close"
              aria-label="Close"
              @click="toggleTag(tag)"
            >
              <span v-if="form.tags.includes(tag)" aria-hidden="true">
                &times;
              </span>
              <span v-else aria-hidden="true">+</span>
            </button>
          </span>
        </b-form-group>
        <div v-if="edit" class="text-right text-danger mb-4">
          <small>
            <a @click="archive">
              <b-icon-trash />
              Arquivar cartão
            </a>
          </small>
        </div>
        <b-button
          type="submit"
          variant="secondary"
          block
          :disabled="invalid"
          size="lg"
        >
          Salvar
        </b-button>
      </div>
    </b-form>
  </ValidationObserver>
</template>

<script>
import { ValidationObserver, ValidationProvider } from 'vee-validate'
import { Mentionable } from 'vue-mention'
import { apiDataToForm } from './utils'
import columns from '@/content/columns.json'
export default {
  components: {
    ValidationObserver,
    ValidationProvider,
    Mentionable,
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
        project: this.project ? this.project.id : null,
        note: '',
        test_instructions: '',
        members: [this.$auth.user.id.toString()],
        status: 'backlog',
        reviewed: false,
        documents: [],
        images: [],
        title: '',
        due_date: undefined,
        start_date: undefined,
        end_date: undefined,
        time_estimate: undefined,
        time_spent: undefined,
        tags: [],
        timeline: false,
      },
      newTag: '',
    }
  },
  computed: {
    members() {
      return this.$store.state.organization?.members
    },
    projects() {
      return this.$store.state.projects
    },
    activeOrganization() {
      return this.$store.state.organization?.id
    },
    statusList() {
      const statusList = []
      Object.keys(columns).forEach((cid) => {
        columns[cid].status.forEach((status) => {
          statusList.push(status)
        })
      })
      return statusList
    },
    combinedTags() {
      const projectTags = this.project ? this.project.tags : []
      return Array.from(new Set([...projectTags, ...this.form.tags]))
    },
  },
  created() {
    if (this.edit) {
      apiDataToForm(this.form, this.edit)
    }
  },
  methods: {
    currentDate() {
      const currentDate = new Date()

      const year = currentDate.getFullYear()
      const month = String(currentDate.getMonth() + 1).padStart(2, '0')
      const day = String(currentDate.getDate()).padStart(2, '0')

      return `${year}-${month}-${day}`
    },
    async save() {
      // set the start date automatically
      if (
        this.form.status === 'developing' &&
        this.form.start_date === undefined
      ) {
        this.form.start_date = this.currentDate()
      }
      // set the end date automatically
      if (
        this.form.status === 'published' &&
        this.form.end_date === undefined
      ) {
        this.form.end_date = this.currentDate()
      }
      const queryData = { ...this.form, organization: this.activeOrganization }
      if (this.edit) {
        const card = await this.$axios
          .$put('/api/cards/' + this.edit._id, queryData)
          .catch(this.showError)
        if (card) {
          this.$toast.success('Cartão atualizado com sucesso!')
          this.$emit('change', card)
        }
      } else {
        const card = await this.$axios
          .$post('/api/cards', queryData)
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
    addTag(tag) {
      if (tag.trim() !== '' && !this.form.tags.includes(tag)) {
        this.form.tags.push(tag.trim())
      }
    },
    removeTag(index) {
      this.form.tags.splice(index, 1)
    },
    toggleTag(tag) {
      if (this.form.tags.includes(tag)) {
        this.removeTag(tag)
      } else {
        this.addTag(tag)
      }
    },
  },
}
</script>
<style>
.tempo input {
  max-width: fit-content !important;
  background: transparent;
  border: none;
  border-bottom: 1px solid #28a745;
  color: white;
  margin-bottom: 8px;
  padding-bottom: 2px;
}

.tempo input[type='number'] {
  -moz-appearance: textfield;
}
.tempo input[type='number']::-webkit-inner-spin-button,
.tempo input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.tempo {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-content: flex-start;
  margin: 20px 0;
  margin-bottom: 14px;
}
</style>

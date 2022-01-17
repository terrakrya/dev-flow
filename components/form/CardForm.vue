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
                value: member.login,
                avatar_url: member.avatar_url,
              }))
            "
            offset="6"
          >
            <b-form-textarea
              v-model="form.note"
              rows="5"
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
          <b-form-textarea v-model="form.test_instructions" rows="5" />
          <accept-markdown />
          <span class="text-danger">{{ errors[0] }}</span>
        </b-form-group>
        <b-form-group label="Membros">
          <MembersSelect v-model="form.members" />
        </b-form-group>
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
import columns from '@/content/columns.json'
import { apiDataToForm } from './utils'
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
        organization: 'terrakrya',
        project: this.project ? this.project.id : null,
        note: '',
        test_instructions: '',
        members: [this.$auth.user.id.toString()],
        status: 'backlog',
        reviewed: false,
        documents: [],
        images: [],
        title: '',
      },
    }
  },
  computed: {
    members() {
      return this.$store.state.members
    },
    projects() {
      return this.$store.state.projects
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

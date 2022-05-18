<template>
  <div>
    <b-card>
      <b-card-body>
        <div
          class="d-flex flex-column align-items-center justify-content-center"
        >
          <div class="d-flex p-4 justify-content-center align-items-center">
            <Upload
              v-if="isEditing"
              v-model="uploadedImage"
              avatar
              type="images"
              @input="handleAvatarUpload"
            />
            <Avatar
              v-else
              :src="organization.avatarUrl"
              :name="organization.name"
              size="10rem"
            />
          </div>

          <div v-if="isEditing" class="mt-4">
            <b-input v-model="form.name" class="m-2" />
            <b-input v-model="form.description" class="m-2" />
            <h5>Matrix</h5>
            <b-input
              v-model="form.mainRoom"
              label="Endereço do Espaço"
              class="m-2"
            />

            <b-button class="m-2" variant="info" block @click="toggleEdit">
              <div v-if="!isSaving">
                <b-icon-pencil />
                Salvar
              </div>
              <b-spinner v-else />
            </b-button>
          </div>
          <div v-else md="8">
            <h2>{{ organization.name }}</h2>
            <p>{{ organization.description }}</p>
            <h5>Matrix</h5>

            <p class="m-2">
              Status do Espaço:
              {{ organization.mainRoom ? 'Ativo' : 'Inativo' }}
            </p>
          </div>
          <div v-if="inviting" class="m-2">
            <b-input-group>
              <b-input
                ref="inviteInput"
                readonly
                :value="OrgInviteLink"
                @focus="$event.target.select()"
              />
              <b-input-group-prepend>
                <b-button @click="copyToClipboard"
                  ><b-icon-clipboard /> Copiar</b-button
                >
              </b-input-group-prepend>
            </b-input-group>
            <small>Copie e envie o link de convite</small>
          </div>
          <div v-if="!isEditing">
            <b-button block variant="success" @click="inviting = !inviting">
              <b-icon-people />
              {{ inviting ? 'Esconder convites' : 'Convidar Pessoas' }}
            </b-button>

            <b-button class="my-2" variant="info" block @click="toggleEdit">
              Editar
            </b-button>
            <b-btn
              block
              variant="outline-danger"
              @click="leaveOrganization(organization.id)"
            >
              Sair da organização
            </b-btn>

            <small class="mt-4">ID: {{ organization.id }}</small>
          </div>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
export default {
  props: {
    organization: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      inviting: false,
      uploadedImage: null,
      form: {
        name: '',
        description: '',
        avatarUrl: '',
        mainRoom: '',
      },
      isEditing: false,
      isSaving: false,
    }
  },
  computed: {
    OrgInviteLink() {
      return `${process.env.baseUrl}/organizations/${this.organization.id}/invite`.replace(
        '//org',
        '/org'
      )
    },
  },
  methods: {
    async leaveOrganization(organizationId) {
      await this.$axios.$post(`/api/organizations/${organizationId}/leave`)
      await this.$auth.fetchUser()
      // TODO
    },
    copyToClipboard() {
      this.$refs.inviteInput.focus()
      document.execCommand('copy')
      this.$toast.success('Link de convite copiado!')
    },
    async toggleEdit() {
      if (this.isEditing) {
        await this.updateOrganization()
        this.isEditing = false
      } else {
        this.form = {
          name: this.organization.name,
          description: this.organization.description,
          mainRoom: this.organization.mainRoom,
        }
        this.uploadedImage = { thumb: this.organization.avatarUrl }
        this.isEditing = true
      }
    },
    async updateOrganization() {
      this.isSaving = true
      await this.$axios
        .$put(`/api/organizations/${this.organization.id}`, this.form)
        .then((updatedOrganization) => {
          this.$store.dispatch('setActiveOrganization', updatedOrganization)
          this.$auth.fetchUser()
        })
        .catch((error) => {
          console.log(error)
        })
      this.isSaving = false
    },
    addSpace() {},
    handleAvatarUpload(file) {
      this.form.avatarUrl = file.url
    },
  },
}
</script>

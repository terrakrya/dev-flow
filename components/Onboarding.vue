<template>
  <div
    v-if="!hasOrganization || !hasMatrixAccount"
    class="onboarding-overlay d-flex justify-content-center align-items-center"
  >
    <div class="onboarding-content">
      <b-spinner v-if="loading" />
      <div v-else-if="showFirstScreen">
        <h1>Bem vinda(o) ao DevFlow</h1>
        <p>Para começar, vamos configurar rapidamente sua conta.</p>
        <b-button block variant="success" @click="showFirstScreen = false"
          >Continuar</b-button
        >
      </div>
      <div
        v-else-if="!hasMatrixAccount"
        class="d-flex flex-column justify-content-center align-items-center"
      >
        <a href="https://matrix.org" target="_blank" rel="noreferrer noopener">
          <img
            class="matrix-logo"
            src="~/assets/img/made-for-matrix-inverted.png"
          />
        </a>
        <p>
          As comunicações em tempo real do DevFlow são feitas através do
          protocolo Matrix.
        </p>
        <p>
          Você pode conectar uma conta existente, e acessar as conversas aqui
          também através dos clientes matrix que costuma usar.
        </p>

        <b-input v-model="matrixForm.login" class="m-2" placeholder="Login" />
        <b-input
          v-model="matrixForm.password"
          class="m-2"
          type="password"
          placeholder="Senha"
        />
        <b-button
          block
          class="m-2"
          variant="primary"
          @click="activateChat(true)"
        >
          <b-spinner v-if="loading" />
          <span v-else>Conectar</span>
        </b-button>
        <p class="text-muted m-2 align-center">
          Ou se preferir, apenas clique em "Continuar" abaixo e criaremos uma
          nova conta para você automáticamente
        </p>
        <b-button
          block
          class="m-2"
          variant="primary"
          @click="registerMatrixUser(true)"
        >
          <b-spinner v-if="loading" />
          <span v-else>Continuar</span>
        </b-button>
      </div>
      <div
        v-else-if="!hasOrganization"
        class="d-flex flex-column justify-content-center"
      >
        <h1>Essa é sua primeira vez no DevFlow</h1>

        <p>Para começar, você precisa estar em uma organização.</p>
        <div>
          <b-input
            v-model="newOrganization.name"
            class="mt-3"
            placeholder="Nome da Organização"
          />
          <b-input
            v-model="newOrganization.description"
            class="mt-3"
            placeholder="Descrição"
          />
          <b-btn
            class="my-3"
            variant="success"
            block
            @click="createOrganization"
            >Criar Organização</b-btn
          >
          <!-- <small
            >Ou também pode adicionar o ID de uma organização para entrar</small
          >
          <b-input
            v-model="addOrganizationId"
            class="my-3"
            placeholder="ID da Organização"
          />
          <b-button variant="success" block @click="joinOrganization">
            Adicionar
          </b-button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showFirstScreen: true,
      loading: false,
      matrixForm: {
        login: '',
        password: '',
      },
      newOrganization: { name: '', description: '' },
      addOrganizationId: '',
    }
  },
  computed: {
    hasMatrixAccount() {
      return this.$auth.user.matrixId && this.$auth.user.matrixAccessToken
    },
    hasOrganization() {
      return (
        this.$store.state.activeOrganization ||
        this.$auth.user?.organizations?.length > 0
      )
    },
  },
  methods: {
    async registerMatrixUser() {
      this.loading = true
      await this.$matrix.registerUser({ authenticatedAxios: this.$axios })
      await this.$auth.fetchUser()
      this.loading = false
    },
    async activateChat() {
      this.loading = true
      await this.$matrix.loginExistentUser(
        this.matrixForm.login,
        this.matrixForm.password,
        this.$axios
      )
      await this.$auth.fetchUser()
      this.loading = false
    },
    async createOrganization() {
      this.loading = true
      const organization = await this.$axios.$post('/api/organizations/new', {
        name: this.newOrganization.name,
        description: this.newOrganization.description,
      })
      this.$store.dispatch('setActiveOrganization', organization)
      await this.$auth.fetchUser()
      this.loading = false
    },
    async joinOrganization() {
      this.loading = true

      await this.$axios.$post(
        `/api/organizations/${this.addOrganizationId}/join`
      )
      await this.$auth.fetchUser()
      this.loading = false
    },
  },
}
</script>

<style>
.onboarding-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.8);
}
.onboarding-content {
  border: 1px solid green;
  border-radius: 6px;
  max-height: 70%;
  padding: 26px;
  background-color: rgb(45, 45, 45);
  z-index: 9999 !important;
}
.matrix-logo {
  max-width: 260px;
  height: auto;
  margin: 16px;
}
</style>

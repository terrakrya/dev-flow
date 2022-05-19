<template>
  <header>
    <b-navbar toggleable="md" variant="dark" type="dark">
      <b-container fluid>
        <b-navbar-brand to="/admin">
          <div class="d-flex justify-content-center">
            <Organization />
          </div>
        </b-navbar-brand>
        <b-navbar-toggle target="header-menu" />
        <b-collapse id="header-menu" is-nav>
          <b-navbar-nav />
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right>
              <template #button-content>
                <Avatar :name="user.name" :src="user.avatarUrl" size="3rem" />
              </template>
              <b-dropdown-item to="/profile">Perfil</b-dropdown-item>
              <b-dropdown-item @click="logout()">Sair</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item to="/admin"> </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </header>
</template>
<script>
export default {
  computed: {
    organization() {
      return this.$store.state.organization || {}
    },
    user() {
      return this.$auth.user || {}
    },
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      this.$nextTick(() => {
        localStorage.clear()
        window.location.reload()
      })
    },
  },
}
</script>

<template>
  <b-card v-if="repositories" class="mb-3" no-body>
    <b-card-body>
      <b-card-title class="mb-0">
        <span class="title">Repositórios!</span>
      </b-card-title>
    </b-card-body>

    <b-list-group flush>
      <b-list-group-item
        v-for="repository in repositories"
        :key="repository.id"
      >
        <h5>
          <n-link :to="`/repository/${repository.name}`">
            {{ repository.name }}
          </n-link>
          <small>
            <b-icon-lock-fill v-if="repository.private" />
          </small>
          <b-badge
            v-if="repository.open_issues > 0"
            variant="danger"
            class="pull-right"
          >
            {{ repository.open_issues }}
          </b-badge>
        </h5>
        <small>{{ repository.description }}</small>
      </b-list-group-item>
    </b-list-group>
  </b-card>
</template>
<script>
export default {
  computed: {
    repositories() {
      return this.$store.state.repositories
    },
  },
}
</script>

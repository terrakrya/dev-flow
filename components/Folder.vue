<template>
  <!-- recursive component, can be another folder, or a note, or a bookmark, or other -->
  <b-list-group-item @click="handleClick">
    {{ data.title }}

    <b-btn
      v-if="data.type === 'Folder'"
      variant="outline-success"
      class="my-2"
      @click="$emit('newFolder', data.id)"
      ><b-icon-folder /> Nova pasta</b-btn
    >
    <b-list-group>
      <b-list-group-item v-for="child in children" :key="child._id">
        <b-list-group-item
          v-if="child.type === 'Folder'"
          :to="'/wiki/' + folder.id"
        >
          <Folder :data="child" />
        </b-list-group-item>
        <b-list-group-item v-else-if="child.type === 'Note'">
          Note: {{ child.label }}
        </b-list-group-item>
      </b-list-group-item>
    </b-list-group>
  </b-list-group-item>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
      isLoaded: false,
      children: [],
    }
  },
  methods: {
    async getChildren(folderId) {
      const response = await this.$axios
        .get(`/api/folders/${folderId}`, {
          params: { organization: this.activeOrgId },
        })
        .catch(this.showError)
      this.children = response.data.children
    },
    handleClick() {
      if (this.data.type === 'Folder') {
        if (!this.isLoaded) {
          this.getChildren(this.data._id)
        }
        this.isExpanded = !this.isExpanded
      }
    },
  },
}
</script>

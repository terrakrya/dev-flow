<template>
  <div>
    <div
      :class="[
        'd-flex',
        'align-items-center',
        {
          'bg-dark': data.item === selectedFolder,
          'text-light': data.item === selectedFolder,
        },
      ]"
    >
      <b-icon
        :icon="isExpanded ? 'folder-minus' : 'folder-plus'"
        class="mr-2 text-success"
        @click="handleClick"
      />
      <h2 class="mb-0" @click="handleClick">{{ data.label }}</h2>
    </div>
    <div v-if="isExpanded" class="ml-4">
      <div v-for="child in children" :key="child._id" class="mb-2">
        <div v-if="child.type === 'Folder'">
          <Folder :data="child" />
        </div>
        <div v-else-if="child.type === 'Note'">
          <router-link :to="'/wiki/' + child.item">
            <b-icon icon="file" class="mr-2 text-success" />
            {{ child.label }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
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
      isLoaded: false,
      children: [],
      newFolderName: '',
    }
  },

  computed: {
    selectedFolder() {
      return this.$store.state.wiki.selectedFolder
    },
    isExpanded() {
      return this.$store.state.wiki.folders[this.data.item]?.isExpanded ?? false
    },
  },
  watch: {
    isExpanded(newValue, oldValue) {
      // do something with the new and old values of isExpanded
      console.log('watch', anewValue, oldValue)
    },
  },

  methods: {
    async getChildren(folderId) {
      const response = await this.$axios
        .get(`/api/folders/${folderId}`, {
          params: { organization: this.activeOrgId },
        })
        .catch(this.showError)
      this.children = response?.data?.children ?? []
      console.log('folderId', folderId, this.children)
    },
    handleClick() {
      if (this.data.type === 'Folder') {
        this.$store.dispatch('wiki/selectFolder', this.data.item)

        if (!this.isLoaded) {
          console.log('data', this.data)
          this.getChildren(this.data.item)
        }
        this.updateIsExpanded(!this.isExpanded)
      }
    },
    updateIsExpanded(value) {
      this.$store.dispatch('wiki/updateFolderTree', {
        ...this.data,
        isExpanded: value,
      })
    },
  },
}
</script>

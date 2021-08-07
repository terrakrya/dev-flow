<template>
  <div class="chat-header">
    <h2>{{ room.name }}</h2>
  </div>
</template>
<script>
export default { props: { room: { type: Object, default: () => {} } } }
</script>

<style>
.chat-header {
  border-bottom: 1px dashed grey;
}
</style>

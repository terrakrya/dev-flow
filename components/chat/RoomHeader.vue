<template>
  <div class="chat-header">
    <h2>{{ roomName }}</h2>
  </div>
</template>
<script>
export default { props: { roomName: { type: String, default: () => 'Sala' } } }
</script>

<style>
.chat-header {
  border-bottom: 1px dashed grey;
}
</style>

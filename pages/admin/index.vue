<template>
  <b-container fluid>
    <b-row>
      <b-col md="8"> {{ $auth.user }} </b-col>
      <b-col md="4">
        <Sidebar />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  
}
</script>

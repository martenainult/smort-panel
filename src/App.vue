<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
</script>

<template>
  <header>
    <PageHeader />
  </header>
  <body class="mainframe">
    <RouterView></RouterView>
  </body>
</template>

<style scoped>
.mainframe {
  justify-content: center;
  max-width: 90%;
  margin-inline: auto;
}
</style>

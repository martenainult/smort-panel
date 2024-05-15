<script setup lang="ts">
defineProps<{
  sessionIndex: number
  deviceCount: number
}>()
</script>

<template>
  <div class="answerItem">Session {{ sessionIndex }} - {{ deviceCount }} answers</div>
</template>

<style scoped></style>

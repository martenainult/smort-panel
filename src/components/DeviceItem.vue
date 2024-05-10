<script setup lang="ts">
defineProps<{
  id: string
  option: string
}>()
</script>

<template>
  <div class="deviceBox">
    <div id="identifier">ID: {{ id }}</div>
    <div id="option">{{ option }}</div>
  </div>
</template>

<style scoped>
div.deviceBox {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 80px;
  width: 160px;
  margin: 4px;
  background-color: rgb(19, 19, 19);
  border-width: 2px;
  border-radius: 12px;
  color: var(--color-text);
  border-color: var(--color-border);
  border-style: solid;

  div#identifier {
    font-size: 12px;
    height: 24px;
  }

  div#option {
    font-size: 24px;
  }
}
</style>

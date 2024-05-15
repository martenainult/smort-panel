<script setup lang="ts">
defineProps<{
  id: string
  option: string
  sensor?: string
  level?: number
  ping?: string
}>()
</script>

<template>
  <div class="deviceBox">
    <div id="identifier">ID: {{ id }}</div>
    <div id="option">{{ option }}</div>
    <div id="temperature">Layer: {{ level?.toString() }} - {{ sensor?.slice(0, 5) }}°C</div>
    <div id="ping-pong">Ping: {{ ping }} ms</div>
  </div>
</template>

<style scoped>
div.deviceBox {
  display: inline-flex;
  flex-direction: column;
  text-align: center;
  height: 120px;
  width: 160px;
  margin: 4px;
  padding-top: 8px;
  background-color: rgb(19, 19, 19);
  border-width: 2px;
  border-radius: 12px;
  color: var(--color-text);
  border-color: var(--color-border);
  border-style: solid;

  div#identifier {
    font-size: 12px;
    height: 30px;
  }

  div#option {
    font-size: 24px;
    height: 100%;
    color: hsla(160, 100%, 37%, 1);
    transition: 1s;
  }
}
</style>

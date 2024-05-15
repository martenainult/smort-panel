<script setup lang="ts">
import { useConnectionStore } from '@/stores/connection'

const connection = useConnectionStore()
</script>

<template>
  <header class="frame">
    <img alt="LOGO" id="logo" src="@/assets/esp32_logo.png" href="/" />
    <div id="title">Mr. Smort Panel</div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/serial-monitor">Serial monitor</RouterLink>
      <RouterLink to="/results">Results</RouterLink>
    </nav>

    <div class="connectionBox" v-if="connection.physicallyConnected">
      Connected to: {{ connection.vendor }}
    </div>
    <div class="connectionBox" v-else>Not connected</div>
  </header>
</template>

<style scoped>
div.connectionBox {
  display: flex;
  text-justify: center;
  width: 160px;
  margin-left: 2rem;
}

header {
  height: auto;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--color-border);
}

header * {
  display: inline;
}

header img {
  height: 80px;
  cursor: pointer;
  margin: 1rem;
}

header #title {
  font-size: 24px;
  width: 200px;
}

header a {
  padding: 0.5rem 1rem;
}

nav {
  margin-left: 1rem;
  font-size: 1rem;
  font-weight: bold;
}

nav a {
  border-left: 2px solid var(--color-border);
  height: 100px;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}
</style>

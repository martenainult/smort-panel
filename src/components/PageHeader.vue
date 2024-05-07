<script setup lang="ts"></script>

<template>
  <header class="frame">
    <img alt="LOGO" id="logo" src="@/assets/esp32_logo.png" />
    <p id="title">Mr. Smort Panel</p>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink to="/serial-monitor">Serial monitor</RouterLink>
    </nav>
  </header>
</template>

<style scoped>
header {
  height: 100px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: var(--color-border);
}

header img {
  display: block;
  height: 80%;
  cursor: pointer;
  margin: 1rem;
}

header #title {
  font-size: 2rem;
}

header a {
  padding: 1rem 2rem 1rem 2rem;
}

nav {
  margin-left: 2rem;
  font-size: 1rem;
  font-weight: bold;
}

nav a {
  border-left: 2px solid var(--color-border);
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}
</style>

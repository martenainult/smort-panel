<script setup lang="ts">
defineProps<{
  comPort?: string
  comContent?: string
}>()
</script>

<template>
  <header>Connected to - {{ comPort ? comPort : 'None' }}</header>
  <body id="frame">
    <div class="serialFrame">asd</div>
  </body>
</template>

<style scoped>
header {
  margin-bottom: 1rem;
  font-size: 1rem;
}

body#frame {
  width: 60%;
  height: 50px;
  background-color: rgb(46, 46, 46);
  border-color: var(--color-border);
  padding: 1rem;
}

@media (min-width: 400px) {
  .item {
    margin-top: 0;
    padding: 0.4rem 0 1rem calc(var(--section-gap) / 2);
  }

  i {
    top: calc(50% - 25px);
    left: -26px;
    position: absolute;
    border: 1px solid var(--color-border);
    background: var(--color-background);
    border-radius: 8px;
    width: 50px;
    height: 50px;
  }

  .item:before {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    bottom: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:after {
    content: ' ';
    border-left: 1px solid var(--color-border);
    position: absolute;
    left: 0;
    top: calc(50% + 25px);
    height: calc(50% - 25px);
  }

  .item:first-of-type:before {
    display: none;
  }

  .item:last-of-type:after {
    display: none;
  }
}
</style>

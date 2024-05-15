<script setup lang="ts">
import deviceItem from '@/components/DeviceItem.vue'
import { useDeviceStore } from '@/stores/devices'

const deviceStore = useDeviceStore()
</script>

<template>
  <div class="deviceBlock">
    <deviceItem
      class="device"
      v-for="device in deviceStore.getDevices"
      :key="device"
      :id="device['s_mac']"
      :option="device['opt']"
      :sensor="device['temp']"
      :level="device['lev']"
      :ping="(device['pong'] - device['ping']).toString()"
    />
  </div>
</template>

<style scoped>
header {
  margin-bottom: 1rem;
  font-size: 1rem;
}

button {
  margin: 1rem;
}

div.deviceBlock {
  display: flex wrap;
  flex-direction: row;
  width: 100%;
  padding-top: 1rem;
  background-color: rgb(32, 32, 32);
  min-height: 600px;
  padding: 1rem;
  transform: 1s;
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

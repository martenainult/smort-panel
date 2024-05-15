<script setup lang="ts">
import consoleItem from '@/components/ConsoleItem.vue'
import { useConnectionStore } from '@/stores/connection'
import { useDeviceStore } from '@/stores/devices'

const deviceStore = useDeviceStore()
const connection = useConnectionStore()
</script>

<template>
  <div class="frame">
    <header>
      <h1 class="green">Serial Monitor</h1>
      <button
        v-if="!connection.activePort || !connection.physicallyConnected"
        @click="connection.selectPort()"
      >
        Select serial port
      </button>
      <button v-else-if="connection.open" @click="connection.disconnectPort()">
        Disconnect port
      </button>
      <button v-else-if="connection.activePort" @click="connection.connectToPort()">
        Start streaming
      </button>
      <button v-if="connection.open" @click="connection.write('ping'), deviceStore.setPing()">
        Send 'PING'
      </button>
      <button @click="deviceStore.submitAnswers">Submit answers</button>
    </header>
    <div></div>
    <body class="console">
      <consoleItem :com-port="connection.vendor?.toString()" />
    </body>
  </div>
</template>

<style scoped>
header {
  margin-top: 1rem;
  display: flex;
}

div button {
  margin: 1rem;
  margin-left: 2rem;
}

button {
  height: 3rem;
  padding-left: 2rem;
  border-radius: 1rem;
  background: none;
  color: var(--color-text);
  border-color: var(--color-border);
  border-style: solid;
}

button.disabled {
  display: none;
}

button:hover {
  background-color: hsla(160, 100%, 37%, 0.2);
  transition: 0.4s;
}

/*
button:active {
  background-color: hsla(160, 100%, 48%, 0.307);
  transition: 0.1s;
}
*/

h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>

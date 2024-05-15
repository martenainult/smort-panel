<script setup lang="ts">
import { useDeviceStore } from '@/stores/devices'
import AnswerItem from '@/components/AnswerItem.vue'
import { ref, onMounted } from 'vue'

const deviceStore = useDeviceStore()

const selectedSessionAnswers = ref<string[]>([])
const selectedSessionId = ref<number>(0)

defineExpose({
  selectedSessionAnswers,
  selectedSessionId
})

function updateSession(selected: Array<string>, id: number) {
  selectedSessionAnswers.value = selected.sort()
  selectedSessionId.value = id
}

onMounted(() => {
  if (deviceStore.getResults.length > 0) {
    updateSession(
      deviceStore.getResults[deviceStore.getResults.length - 1],
      deviceStore.getResults.length
    )
  }
})
</script>

<template>
  <div class="answerList">
    <AnswerItem
      class="answerBlock clickable"
      v-for="(value, index) in deviceStore.getResults"
      :key="value"
      :sessionIndex="index + 1"
      :deviceCount="value.length"
      @click="updateSession(value, index + 1)"
    />
  </div>
</template>

<style scoped>
div.answerList {
  display: flex;
  flex-direction: column;
  width: 240px;
}

div.answerBlock {
  margin-top: 8px;
  padding: 12px;
}
</style>

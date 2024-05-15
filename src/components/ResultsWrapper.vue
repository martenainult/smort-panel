<script setup lang="ts">
import { computed } from 'vue'
import BarChart from '@/components/BarChart.vue'

const props = defineProps<{
  sessionAnswers?: string[] | undefined
  sessionId?: number | undefined
}>()

// https://stackoverflow.com/questions/5667888/counting-the-occurrences-frequency-of-array-elements
function getAnswersJson(arr: string[]) {
  console.log('getAnswersJson', arr)
  let temp = Object(props.sessionAnswers).reduce(function (counts, num) {
    return (counts[num] = (counts[num] || 0) + 1), counts
  }, {})
  return temp
}

const getChartData = computed(() => {
  if (!props.sessionAnswers) return
  let temp = Object.values(getAnswersJson(props.sessionAnswers))
  return temp
})

const getChartTitle = computed(() => {
  if (!props.sessionId) {
    return ''
  }
  return 'Results of Session ' + props.sessionId.toString()
})

const getChartLabels = computed(() => {
  let temp = Object.keys(getAnswersJson(props.sessionAnswers))
  return temp
})
</script>

<template>
  <div class="wrapper">
    <BarChart
      :key="sessionId"
      :chart-data="getChartData"
      :chart-labels="getChartLabels"
      :chart-title="getChartTitle"
    />
  </div>
</template>

<style scoped>
div.wrapper {
  padding-top: 8px;
  background-color: rgb(19, 19, 19);
  border-width: 2px;
  border-radius: 12px;
  color: var(--color-text);
  border-color: var(--color-border);
  border-style: solid;
}

BarChart.chart {
  width: 800px;
}
</style>

<script setup lang="ts">
import resultItem from '@/components/ResultItem.vue'
import ResultsWrapper from '@/components/ResultsWrapper.vue'
import { ref } from 'vue'

const selected = ref('null')
</script>

<template>
  <div class="wrapper">
    <resultItem ref="selected" />
    <ResultsWrapper
      class="frame"
      :sessionAnswers="selected.selectedSessionAnswers"
      :sessionId="selected.selectedSessionId"
    />
  </div>
</template>

<style scoped>
div.wrapper {
  display: inline-flex;
  flex-direction: row;

  .frame {
    height: 500px;
    width: 700px;
  }
}
</style>

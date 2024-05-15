<template>
  <Bar :data="data" :options="options" />
</template>

<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { Bar } from 'vue-chartjs'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)
ChartJS.defaults.font.size = 24

export default {
  name: 'App',
  components: {
    Bar
  },

  props: {
    chartLabels: Array<String>,
    chartData: Array<Number>,
    chartTitle: String
  },

  data() {
    return {
      data: {
        labels: this.$props.chartLabels, // ['A', 'B', 'C', 'D']
        datasets: [
          {
            data: this.$props.chartData,
            label: this.$props.chartTitle,
            borderColor: 'rgb(255, 255, 255)',
            backgroundColor: 'hsla(160, 100%, 37%, 0.5)',
            borderWidth: 2
          }
        ] // data: [40, 20, 12] }
      },
      options: {
        responsive: true
      }
    }
  }
}
</script>

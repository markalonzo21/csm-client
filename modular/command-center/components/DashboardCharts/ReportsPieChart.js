import { Pie } from 'vue-chartjs'
import 'chartjs-plugin-labels'

export default {
  extends: Pie,
  props: ['labels', 'datasets'],
  mounted () {
    this.renderChart(
      {
        labels: this.labels,
        datasets: this.datasets
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          labels: {
            render: 'percentage',
            precision: 1
          }
        }
      }
    )
  }
}

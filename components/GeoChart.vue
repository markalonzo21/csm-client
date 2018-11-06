<template>
  <div style="height: 800px; width: 100%;">
    <div id="chart_div"></div>
  </div>
</template>


<script>
export default {
  props: {
    votes: {
      type: Array,
    },
  },
  mounted() {
    if (process.browser) {
      this.drawChart()
    }
  },
  methods: {
    drawChart() {
      google.charts.load('current', {
        packages: ['geochart'],
      })

      google.charts.setOnLoadCallback(drawStuff)

      function drawStuff() {
        var data = google.visualization.arrayToDataTable([
          ['Code', 'Name', 'Votes'],
          ['PH-00', 'National Capital Region Pambansang Punong', 13],
          ['PH-01', 'Ilocos (Region I)', 11],
          ['PH-02', 'Cagayan Valley (Region II)', 3],
          ['PH-03', 'Central Luzon (Region III)', 6],
          ['PH-05', 'Bicol (Region V)', 2],
          ['PH-40', 'Calabarzon (Region IV-A)', 4],
          ['PH-13', 'Caraga (Region XIII)', 5],
          ['PH-14', 'Autonomous Region in Muslim Mindanao (ARMM)', 1],
          ['PH-07', 'Central Visayas (Region VII)', 7],
          ['PH-15', 'Cordillera Administrative Region (CAR)', 8],
          ['PH-11', 'Davao (Region XI)', 9],
          ['PH-08', 'Eastern Visayas (Region VIII)', 10],
          ['PH-41', 'Mimaropa (Region IV-B)', 12],
          ['PH-10', 'Northern Mindanao (Region X)', 14],
          ['PH-12', 'Soccsksargen (Region XII)', 15],
          ['PH-06', 'Western Visayas (Region VI)', 16],
          ['PH-09', 'Zamboanga Peninsula (Region IX)', 17],
        ])

        // Set chart options
        var options = {
          region: 'PH',
          resolution: 'provinces',
          width: 1000,
          height: 800,
        }

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.GeoChart(
          document.getElementById('chart_div')
        )

        chart.draw(data, options)
      }
    },
  },
}
</script>

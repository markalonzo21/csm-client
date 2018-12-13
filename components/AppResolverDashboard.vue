<template>
  <section>
    <div class="col-md-7">
      <a-table bordered :dataSource="reports" :columns="columns" v-if="!loadingReports">
        <template
          slot="assignedTo"
          slot-scope="text, record"
        >{{ record.assignedTo ? record.assignedTo.email : 'Unassigned' }}</template>
        <template slot="operation" slot-scope="text, record">
          <a :href="`/command-center/reports/${record._id}`" target="_blank">
            <a-button type="primary">Show</a-button>
          </a>
        </template>
      </a-table>
    </div>
    <div class="col-md-5">
      <div class="text-3xl">{{ $auth.user.areas[0].name }}</div>
      <area-map :area="$auth.user.areas[0]" :reports="reports"></area-map>
    </div>
  </section>
</template>

<script>
import AreaMap from '~/components/AreaMap'
export default {
  components: {
    AreaMap
  },
  mounted() {
    this.loadingReports = true
    this.bounds = L.latLngBounds(
      L.latLng(
        this.$auth.user.areas[0].location.coordinates[0][1],
        this.$auth.user.areas[0].location.coordinates[0][0]
      ),
      L.latLng(
        this.$auth.user.areas[0].location.coordinates[1][1],
        this.$auth.user.areas[0].location.coordinates[1][0]
      )
    )

    this.initSocketListeners()

    this.$axios.$get('/resolver/reports').then(response => {
      response.data.forEach(report => {
        const contains = this.bounds.contains(
          L.latLng(
            report.location.coordinates[1],
            report.location.coordinates[0]
          )
        )

        if (contains) {
          this.reports.push(report)
        }
      })
      this.loadingReports = false
    })
  },
  data() {
    return {
      loadingReports: false,
      reports: [],
      bounds: null,
      columns: [
        {
          title: 'Type',
          dataIndex: 'reportType.name'
        },
        // {
        //   title: 'Location',
        //   dataIndex: 'location.coordinates'
        // },
        {
          title: 'Responder',
          dataIndex: 'assignedTo',
          scopedSlots: { customRender: 'assignedTo' }
        },
        {
          title: 'Created At',
          dataIndex: 'createdAt'
        },
        {
          title: 'Operation',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('new-report', report => {
        const contains = this.bounds.contains(
          L.latLng(
            report.location.coordinates[1],
            report.location.coordinates[0]
          )
        )
        if (contains) {
          this.reports.unshift(report)
        }
      })
    }
  }
}
</script>

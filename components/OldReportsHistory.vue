<template>
  <section class="user-dashboard mx-auto">
    <h1 class="title__black mt0">Reports</h1>
    <table class="text-center w-100">
      <thead>
        <tr>
          <td>Type</td>
          <!-- <td>Location</td> -->
          <td>Date</td>
          <td>Resolved Date</td>
        </tr>
      </thead>
      <tbody>
        <tr
          class="cursor-pointer"
          @click.prevent="$router.push(`/${$auth.user.role.slug}/reports/${report._id}`)"
          v-for="report in reports"
          :key="report._id"
        >
          <td>
            <a class="rowlink" style="width: 100%;" v-text="report.reportType.name"></a>
          </td>
          <!-- <td v-html="report.location.coordinates">14.12414, 121,41241</td> -->
          <td v-text="$moment(report.createdAt).format('hh:mm A - MMM. DD, YYYY')">Nov. 11, 2018 10:30 PM</td>
          <td v-text="report.resolvedAt ? $moment(report.resolvedAt).format('hh:mm A - MMM. DD, YYYY') : 'Unresolved'"></td>
        </tr>
      </tbody>
      <button
        class="btn btn-info m-6"
        :disabled="isReportsLoading"
        v-if="isLoadMoreVisible"
        @click.prevent="loadMoreReports"
      >Load More</button>
    </table>
  </section>
</template>

<script>
export default {
  data() {
    return {
      reports: [],
      isLoadMoreVisible: false,
      isReportsLoading: false
    }
  },
  mounted() {
    this.loadMoreReports()
  },
  methods: {
    loadMoreReports() {
      this.isReportsLoading = true
      this.$axios
        .$get(`/reports?skip=${this.reports.length}`)
        .then(response => {
          this.isLoadMoreVisible = !(response.data.length < 10)
          response.data.forEach(report => {
            this.reports.push(report)
          })
          this.isReportsLoading = false
        })
    }
  }
}
</script>

<style scoped>
table {
  position: relative;
  border-collapse: separate;
  border-spacing: 15px 15px;
}

.rowlink::before {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  width: 100%;
  height: 1.5em; /* don't forget to set the height! */
}
</style>

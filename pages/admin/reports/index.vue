<template>
  <div class="main-content">
    <section class="admin-dashboard container mx-auto">
      <router-link to="/admin/reports/heatmap" class="p-4"
        >Go To Reports Heatmap</router-link
      >
      <h1 class="title__blue">Reports</h1>
      <table class="text-center w-100">
        <thead>
          <tr>
            <td>Type</td>
            <td>Location</td>
            <td>Assigned To</td>
            <td>Created At</td>
            <td>Resolved At</td>
          </tr>
        </thead>
        <tbody>
          <tr
            class="cursor-pointer"
            v-for="report in reports"
            :key="report._id"
            @click.prevent="$router.push(`/admin/reports/${report._id}`)"
          >
            <td><a class="btn btnblue" style="width: 100%;" v-text="report.reportType.name"></a></td>
            <td v-html="report.location.coordinates">14.12414, 121,41241</td>
            <td
              v-text="report.assignedTo ? `${report.assignedTo.firstName} ${report.assignedTo.lastName}` : 'Unassigned'"
            >
              Some Name
            </td>
            <td v-text="report.createdAt">Nov. 11, 2018 10:30 PM</td>
            <td
              v-text="report.resolvedAt ? report.resolvedAt : 'Unresolved'"
            ></td>
          </tr>
        </tbody>
      </table>
      <button
        class="btn btn-info m-6"
        :disabled="isReportsLoading"
        v-if="isLoadMoreVisible"
        @click.prevent="loadMoreReports"
      >
        Load More
      </button>
    </section>
  </div>
</template>

<script>
  export default {
    layout: "admin",
    middleware: "isAdmin",
    asyncData({ $axios, error }) {
      return $axios.$get("/admin/reports").then(response => {
        return {
          reports: response.data,
          isLoadMoreVisible: !(response.data.length < 10),
          isReportsLoading: false
        };
      });
    },
    mounted() {
      this.initSocketListeners();
    },
    methods: {
      initSocketListeners() {
        this.$socket.on("new-report", report => {
          this.reports.unshift(report);
        });
      },
      loadMoreReports() {
        this.isReportsLoading = true;
        this.$axios
          .$get(`/admin/reports?skip=${this.reports.length}`)
          .then(response => {
            response.data.forEach(report => {
              this.reports.push(report);
            });
            this.isReportsLoading = false;
          });
      }
    }
  };
</script>

<style scoped>
  table {
    position: relative;
    border-collapse: separate;
    border-spacing: 15px 15px;
  }

  .rowlink::before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: 1.5em; /* don't forget to set the height! */
  }
</style>

<template>
  <section class="w-full">
    <div class="clearfix">
      <h3 class="float-left">Reports</h3>
      <a-button type="primary" class="float-right invisible my-6">Hidden</a-button>
    </div>
    <hr>
    <a-table bordered :dataSource="reports" :columns="columns">
      <template
        slot="createdAt"
        slot-scope="text, report"
      >{{ report.createdAt ? $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template slot="operation" slot-scope="text, report">
        <a-button type="primary">
          <router-link :to="`/command-center/reports/${report._id}`">Show</router-link>
        </a-button>
        <a-button type="danger" disabled>Cancel</a-button>
      </template>
    </a-table>
  </section>
</template>

<script>
export default {
  layout: "command-center",
  asyncData({ $axios, error }) {
    return $axios.$get("/admin/reports").then(response => {
      return {
        reports: response.data,
        columns: [
          {
            title: "Type",
            dataIndex: "reportType.name"
          },
          {
            title: "Responder",
            dataIndex: "assignedTo.email"
          },
          {
            title: "Created At",
            dataIndex: "createdAt",
            scopedSlots: { customRender: "createdAt" }
          },
          {
            title: "Operation",
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" }
          }
        ],
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
          this.isLoadMoreVisible = !(response.data.length < 10);
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

<template>
  <div class="main-content">
    <div class="container">
      <section class="user-dashboard mx-auto">
        <h1 class="title__black mt0 uppercase">Reports History</h1>
        <div v-if="reports.length > 0">
          <div class="panel" style="border: none;" v-for="report in reports">
            <div class="panel-body border h-32 rounded shadow bg-white flex items-center">
              <div class="col-sm-3">
                <strong>Date</strong>
                <div>{{ $moment(report.createdAt).format('MMM. DD, YYYY | h:mm A ') }}</div>
              </div>
              <div class="col-sm-3">
                <strong>Type</strong>
                <div>{{ report.reportType.name }}</div>
              </div>
              <div class="col-sm-3">
                <strong>Resolved Date</strong>
                <div>{{ report.resolvedAt ? $moment(report.resolvedAt).format('MMM. DD, YYYY | h:mm A ') : 'Unresolved' }}</div>
              </div>
              <button
                type="button"
                class="btn btnblue col-sm-3 outline-none"
                @click.prevent="$router.push(`/reports/${report._id}`)"
              >View More</button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="panel">
            <div
              class="panel-body border h-32 rounded shadow bg-white flex items-center justify-center"
            >No reports...</div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  async fetch({ $axios, store, redirect }) {
    await store.dispatch("user/getResolvedReports");
  },
  data() {
    return {
      isReportsLoading: false
    };
  },
  computed: {
    reports() {
      return this.$store.state.user.resolvedReports;
    },
    isLoadMoreVisible() {
      return this.$store.state.user.isLoadMoreVisible;
    }
  },
  methods: {
    loadMoreReports() {
      this.isReportsLoading = true;
      this.$axios
        .$get(`/reports?resolvedOnly=true&skip=${this.reports.length}`)
        .then(response => {
          this.$store.commit("user/SET_LOAD_MORE_STATUS", response.data);
          response.data.forEach(report => {
            this.$store.commit("user/UNSHIFT_RESOLVED_REPORT", report);
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

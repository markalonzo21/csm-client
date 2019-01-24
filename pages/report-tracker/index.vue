<template>
  <div class="main-content">
    <div class="container">
      <h1 class="title__black mt0 uppercase mb-10">Report Tracker</h1>
      <div v-if="reports.length === 0">
        <div class="panel">
          <div
            class="panel-body border h-32 rounded shadow bg-white flex items-center justify-center"
          >No reports...</div>
        </div>
      </div>
      <div class="panel shadow" v-for="report in reports" :key="report._id">
        <div class="panel-body h-32 rounded-md">
          <div class="col-sm-3">
            <span class="bluelabel">Report ID</span>
            <br>
            {{ report._id }}
          </div>
          <div class="col-sm-3">
            <span class="bluelabel">Category</span>
            <br>
            {{ report.type.category.name }}
          </div>
          <div class="col-sm-3">
            <span class="bluelabel">Type</span>
            <br>
            {{ report.type.name }}
          </div>
          <div class="col-sm-3">
            <button
              class="btn btnblue"
              @click.prevent="$router.push(`/report-tracker/${report._id}`)"
            >View More</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  async fetch({ $axios, store, redirect }) {
    await store.dispatch('user/getUnresolvedReports')
  },
  computed: {
    reports() {
      return this.$store.state.user.unresolvedReports
    }
  },
  mounted() {
    this.initSocketListener()
  },
  methods: {
    initSocketListener() {
      this.$socket.on('report-updated', report => {
        if (report.status === 'resolved' || report.status === 'cancelled') {
          if (this.chat.reportId === report._id) {
            this.chat.reportId = null
          }

          this.$store.commit('user/REPORT_RESOLVED', report)
        }

        this.$store.commit('user/REPLACE_REPORT', report)
      })
    }
  }
}
</script>


<style scoped>
.panel {
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.75);
}
.panel-heading {
  background-color: #fff;
}
.table {
  margin-bottom: 0;
}
.bluelabel {
  color: #34c3e5;
}

.title__blue {
  font-weight: 700;
}
</style>


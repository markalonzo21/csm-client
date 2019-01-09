<template>
  <section class="ticket-info">
    <div class="row">
      <div class="col-md-4 sidebar">
        <ReportInformationPanel v-if="report" :report="report"/>
        <ReportLocationPanel v-if="report" :report="report"/>
        <ReportOptionPanel v-if="report" :report="report"/>
      </div>
      <div class="col-md-8 content">
        <ReportMainContentPanel v-if="report" :report="report"/>
        <div class="panel">
          <div class="panel-body">
            <ReportChatbox :report="report"/>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import ReportInformationPanel from './-ReportInformationPanel'
import ReportLocationPanel from './-ReportLocationPanel'
import ReportOptionPanel from './-ReportOptionPanel'
import ReportMainContentPanel from './-ReportMainContentPanel'
import ReportChatbox from './-ReportChatbox'
export default {
  layout: 'command-center/default',
  components: {
    ReportInformationPanel,
    ReportLocationPanel,
    ReportOptionPanel,
    ReportMainContentPanel,
    ReportChatbox
  },
  asyncData({ $axios, store, params, error }) {
    if (!store.getters['auth/hasPermission']('view reports')) {
      return redirect('/')
    }
    return $axios.$get(`/admin/reports/${params.id}`).then(response => {
      return {
        report: response.data
      }
    })
  },
  mounted() {
    this.initSocketListeners()
  },
  beforeDestroy() {
    this.$socket.off('report-updated')
  },
  methods: {
    initSocketListeners() {
      this.$socket.on('report-updated', payload => {
        if (this.report._id === payload._id) {
          this.report = payload
          this.$notification['info']({
            message: `Report has been updated!`
          })
        }
      })
    }
  }
}
</script>

<style>
.ticket-info .sidebar .panel-body {
  padding-top: 0;
  padding-bottom: 0;
}
.ticket-info .panel-body .row {
  margin-bottom: 10px;
}
.ticket-info .panel-heading {
  background-color: #344fa0;
}
.ticket-info .panel-heading h3 {
  margin: 0;
  font-size: 20px;
  color: #fff;
}
.ticket-info .table {
  margin-bottom: 0;
}
.ticket-info .table td {
  font-size: 12px;
  border-color: #f1f1f1;
}
.ticket-info .table td:first-child {
  background-color: #f1f1f1;
  width: 120px;
}
.ticket-info .panel-body form {
  padding: 10px;
}
.ticket-info .panel-body form label {
  font-size: 12px;
  font-weight: normal;
}
.btn.btnform {
  width: 80px;
  height: 30px;
  border-radius: 10px;
  background-color: #29abe2;
  font-size: 14px;
  color: #fff;
  line-height: 16px;
}
.btn.btntag {
  background-color: #ea9199;
}

.ticket-info .content label {
  font-size: 16px;
  font-weight: 700;
  color: #333;
}
.ticket-info .row.notes {
  margin-top: 40px;
  margin-bottom: 105px;
}
.ticket-info .row.images {
  margin-bottom: 40px;
}
.ticket-info .row.comment {
  margin: 0;
}
.ticket-info .row.comment .panel-body {
  padding: 10px 0;
}
.ticket-info .row.comment .btn {
  font-weight: 700;
  color: #29abe2;
}
.ticket-info .content textarea {
  resize: none;
  height: 40px;
  border-radius: 10px;
}
</style>

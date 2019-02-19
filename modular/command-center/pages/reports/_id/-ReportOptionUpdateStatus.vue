<template>
  <div class="row">
    <div class="col-md-3">
      <label for>Override Status</label>
    </div>
    <div class="col-md-6">
      <select
        @change="statusChanged"
        class="capitalize form-control"
      >
        <option
          :selected="status === currentStatus"
          class="capitalize"
          v-for="status in ['pending', 'in progress', 'resolved', 'cancelled']"
        >{{ status }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentStatus: this.report.status
    };
  },
  methods: {
    statusChanged(event) {
      var confirmed = confirm("Are you sure you want to update the status?");

      if (confirmed) {
        this.$axios
          .$post("/admin/update-report-status", {
            status: event.target.value,
            reportId: this.report._id
          })
          .then(response => {
            alert("Update successful!");
            this.currentStatus = response.data.status;
            this.report.status = response.data.status;
          })
          .catch(err => {
            alert("Something went wrong!");
            event.target.value = this.currentStatus;
          });
      } else {
        event.target.value = this.currentStatus;
      }
    }
  }
};
</script>

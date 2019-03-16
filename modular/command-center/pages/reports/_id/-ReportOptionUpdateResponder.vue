<template>
  <div class="row">
    <div class="col-md-3">
      <label for>Reassign Responder</label>
    </div>
    <div class="col-md-6">
      <input
        :disabled="true"
        :value="report.responder ? report.responder.email : 'No responder'"
        class="form-control"
        type="text"
      >
    </div>
    <div class="col-md-3">
      <button
        @click.prevent="changeResponder"
        class="btn btnform"
      >Change</button>
    </div>
    <!-- MODAL -->
    <modal
      :class="{ 'pointer-events-none': loadingAssignResponder }"
      :header="false"
      class="assign-modal"
      v-model="updateModalVisible"
    >
      <div class="row text-center">
        <h3 class="mt-0 mb-6">Update Responder</h3>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div v-if="loadingGetAvailableResponders">Loading...</div>
          <select
            class="form-control"
            required
            v-else
            v-model="selectedResponder"
          >
            <option :value="null">Select Responder</option>
            <option
              :key="responder._id"
              :value="responder._id"
              v-for="responder in availableResponders"
            >{{ responder.firstName }} {{ responder.lastName }}</option>
          </select>
        </div>
      </div>
      <div
        class="text-center"
        slot="footer"
      >
        <button
          :disabled="!selectedResponder"
          @click.prevent="updateResponder"
          class="btn btn-primary float-right"
          style="width: auto;"
        >Save</button>
      </div>
    </modal>
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
      selectedResponder: this.report.responder
        ? this.report.responder._id
        : null,
      updateModalVisible: false,
      loadingAssignResponder: false,
      loadingGetAvailableResponders: false,
      availableResponders: []
    };
  },
  methods: {
    changeResponder() {
      this.updateModalVisible = true;

      this.loadingGetAvailableResponders = true;
      this.$axios
        .$get(
          `/api/v1/admin/available-responders?type=${
            this.report.type._id
          }&areaId=${this.$route.params.id}`
        )
        .then(response => {
          this.availableResponders = response.data;
          this.loadingGetAvailableResponders = false;
          this.selectedResponder = this.report.responder
            ? this.report.responder._id
            : null;
          if (response.data.length === 0) {
            alert("No available responders at the moment!");
            this.updateModalVisible = false;
          }
        });
    },
    updateResponder() {
      this.loadingAssignResponder = true;
      this.$axios
        .$post(`/api/v1/admin/assign-responder`, {
          reportId: this.report._id,
          responderId: this.selectedResponder
        })
        .then(response => {
          this.updateModalVisible = false;
          this.loadingAssignResponder = false;
        });
    }
  }
};
</script>

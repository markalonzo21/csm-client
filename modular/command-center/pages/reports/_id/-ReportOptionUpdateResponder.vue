<template>
  <div class="row">
    <div class="col-md-3">
      <label for>Reassign Responder</label>
    </div>
    <div class="col-md-6">
      <input
        type="text"
        class="form-control"
        :disabled="true"
        :value="report.responder ? report.responder.email : 'No responder'"
      >
    </div>
    <div class="col-md-3">
      <button class="btn btnform" @click.prevent="changeResponder">Change</button>
    </div>
    <!-- MODAL -->
    <modal
      class="assign-modal"
      :header="false"
      v-model="updateModalVisible"
      :class="{ 'pointer-events-none': loadingAssignResponder }"
    >
    <div class="row text-center">
     <h3 class="mt-0 mb-6">Update Responder</h3>
    </div>
      <div class="row">
        <div class="col-md-12">
          <div v-if="loadingGetAvailableResponders">Loading...</div>
          <select required v-model="selectedResponder" class="form-control" v-else>
            <option :value="null">Select Responder</option>
            <option
              v-for="responder in availableResponders"
              :value="responder._id"
              :key="responder._id"
            >{{ responder.firstName }} {{ responder.lastName }}</option>
          </select>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <button
          @click.prevent="updateResponder"
          class="btn btn-primary float-right"
          style="width: auto;"
          :disabled="!selectedResponder"
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
        selectedResponder: this.report.responder ? this.report.responder._id : null,
        updateModalVisible: false,
        loadingAssignResponder: false,
        loadingGetAvailableResponders: false,
        availableResponders: []
      }
    },
    methods: {
      changeResponder() {
        this.updateModalVisible = true

        this.loadingGetAvailableResponders = true
        this.$axios.$get(`/admin/available-responders?type=${this.report.type._id}&areaId=${this.$route.params.id}`).then(response => {
          this.availableResponders = response.data
          this.loadingGetAvailableResponders = false
          this.selectedResponder = this.report.responder ? this.report.responder._id : null
          if (response.data.length === 0) {
            alert('No available responders at the moment!')
            this.updateModalVisible = false
          }
        })
      },
      updateResponder() {
        this.loadingAssignResponder = true
        this.$axios
          .$post(`admin/assign-responder`, {
            reportId: this.report._id,
            responderId: this.selectedResponder
          })
          .then(response => {
            this.updateModalVisible = false
            this.loadingAssignResponder = false
          })
      }
    }
  }
</script>

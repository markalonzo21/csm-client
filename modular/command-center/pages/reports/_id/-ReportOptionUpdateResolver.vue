<template>
  <div class="row">
    <div class="col-md-3">
      <label for>Reassign Resolver</label>
    </div>
    <div class="col-md-6">
      <input
        type="text"
        class="form-control"
        :disabled="true"
        :value="report.resolver ? report.resolver.email : 'No resolver'"
      >
    </div>
    <div class="col-md-3">
      <button class="btn btnform" @click.prevent="changeResolver">Change</button>
    </div>
    <!-- MODAL -->
    <modal
      class="assign-modal"
      :header="false"
      v-model="updateModalVisible"
      :class="{ 'pointer-events-none': loadingAssignResolver }"
    >
    <div class="row text-center">
     <h3 class="mt-0 mb-6">Update Resolver</h3>
    </div>
      <div class="row">
        <div class="col-md-12">
          <div v-if="loadingGetAvailableResolvers">Loading...</div>
          <select required v-model="selectedResolver" class="form-control" v-else>
            <option :value="null">Select Resolver</option>
            <option
              v-for="resolver in availableResolvers"
              :value="resolver._id"
              :key="resolver._id"
            >{{ resolver.firstName }} {{ resolver.lastName }}</option>
          </select>
        </div>
      </div>
      <div slot="footer" class="text-center">
        <button
          @click.prevent="updateResolver"
          class="btn btn-primary float-right"
          style="width: auto;"
          :disabled="!selectedResolver"
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
        selectedResolver: this.report.resolver ? this.report.resolver._id : null,
        updateModalVisible: false,
        loadingAssignResolver: false,
        loadingGetAvailableResolvers: false,
        availableResolvers: []
      }
    },
    methods: {
      changeResolver() {
        this.updateModalVisible = true

        this.loadingGetAvailableResolvers = true
        this.$axios.$get(`/admin/available-resolvers?type=${this.report.type._id}&areaId=${this.$route.params.id}`).then(response => {
          this.availableResolvers = response.data
          this.loadingGetAvailableResolvers = false
          this.selectedResolver = this.report.resolver ? this.report.resolver._id : null
          if (response.data.length === 0) {
            alert('No available resolvers at the moment!')
            this.updateModalVisible = false
          }
        })
      },
      updateResolver() {
        this.loadingAssignResolver = true
        this.$axios
          .$post(`admin/assign-resolver`, {
            reportId: this.report._id,
            resolverId: this.selectedResolver
          })
          .then(response => {
            this.updateModalVisible = false
            this.loadingAssignResolver = false
          })
      }
    }
  }
</script>

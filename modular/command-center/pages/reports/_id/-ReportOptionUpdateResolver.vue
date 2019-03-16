<template>
  <div class="row">
    <div class="col-md-3">
      <label for>Reassign Resolver</label>
    </div>
    <div class="col-md-6">
      <input
        :disabled="true"
        :value="report.resolver ? report.resolver.email : 'No resolver'"
        class="form-control"
        type="text"
      >
    </div>
    <div class="col-md-3">
      <button
        @click.prevent="changeResolver"
        class="btn btnform"
      >Change</button>
    </div>
    <!-- MODAL -->
    <modal
      :class="{ 'pointer-events-none': loadingAssignResolver }"
      :header="false"
      class="assign-modal"
      v-model="updateModalVisible"
    >
      <div class="row text-center">
        <h3 class="mt-0 mb-6">Update Resolver</h3>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div v-if="loadingGetAvailableResolvers">Loading...</div>
          <select
            class="form-control"
            required
            v-else
            v-model="selectedResolver"
          >
            <option :value="null">Select Resolver</option>
            <option
              :key="resolver._id"
              :value="resolver._id"
              v-for="resolver in availableResolvers"
            >{{ resolver.firstName }} {{ resolver.lastName }}</option>
          </select>
        </div>
      </div>
      <div
        class="text-center"
        slot="footer"
      >
        <button
          :disabled="!selectedResolver"
          @click.prevent="updateResolver"
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
      selectedResolver: this.report.resolver ? this.report.resolver._id : null,
      updateModalVisible: false,
      loadingAssignResolver: false,
      loadingGetAvailableResolvers: false,
      availableResolvers: []
    };
  },
  methods: {
    changeResolver() {
      this.updateModalVisible = true;

      this.loadingGetAvailableResolvers = true;
      this.$axios
        .$get(
          `/api/v1/admin/available-resolvers?type=${
            this.report.type._id
          }&areaId=${this.$route.params.id}`
        )
        .then(response => {
          this.availableResolvers = response.data;
          this.loadingGetAvailableResolvers = false;
          this.selectedResolver = this.report.resolver
            ? this.report.resolver._id
            : null;
          if (response.data.length === 0) {
            alert("No available resolvers at the moment!");
            this.updateModalVisible = false;
          }
        });
    },
    updateResolver() {
      this.loadingAssignResolver = true;
      this.$axios
        .$post(`/api/v1/admin/assign-resolver`, {
          reportId: this.report._id,
          resolverId: this.selectedResolver
        })
        .then(response => {
          this.updateModalVisible = false;
          this.loadingAssignResolver = false;
        });
    }
  }
};
</script>

<template>
  <div class="row">
    <div class="col-md-3">
      <label for>Type</label>
    </div>
    <div class="col-md-6">
      <input
        :disabled="true"
        :value="report.type.name"
        class="form-control"
        type="text"
      >
    </div>
    <div class="col-md-3">
      <button
        @click.prevent="updateModalVisible = true"
        class="btn btnform"
      >Change</button>
    </div>

    <!-- MODAL -->
    <modal
      :class="{ 'pointer-events-none': loadingUpdate }"
      :header="false"
      class="assign-modal"
      v-model="updateModalVisible"
    >
      <div class="row text-center">
        <h3 class="mt-0 mb-6">Update Report Type</h3>
      </div>
      <div class="row">
        <div class="col-md-12">
          <div v-if="loadingGetReportCategories">Loading...</div>
          <select
            class="form-control"
            required
            v-else
            v-model="currentType"
          >
            <option :value="null">Select Report Type</option>
            <option
              :key="type._id"
              :value="type._id"
              v-for="type in types"
            >{{ type.name }}</option>
          </select>
        </div>
      </div>
      <div
        class="text-center"
        slot="footer"
      >
        <button
          :disabled="loadingUpdate"
          @click.prevent="changeType"
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
  mounted() {
    this.loadingGetReportCategories = true;
    this.$axios.$get("/report-categories").then(response => {
      this.categories = response.data;
      this.loadingGetReportCategories = false;
    });
  },
  data() {
    return {
      categories: [],
      loadingUpdate: false,
      loadingGetReportCategories: false,
      updateModalVisible: false,
      currentType: this.report.type ? this.report.type._id : null
    };
  },
  computed: {
    types() {
      return this.categories.map(category => category.types).flat();
    }
  },
  methods: {
    changeType() {
      this.$axios
        .$post("/admin/update-report-type", {
          typeId: this.currentType,
          reportId: this.report._id
        })
        .then(response => {
          this.loadingUpdate = false;
          this.updateModalVisible = false;
        })
        .catch(error => {});
    }
  }
};
</script>

<template>
  <section class="w-full select-none">
    <uiv-modal
      :footer="false"
      title="Create Report Type"
      v-model="isCreateReportTypeModalVisible"
    >
      <form
        @submit.prevent="createReportType"
        class="clearfix"
      >
        <div class="form-group">
          <input
            class="form-control"
            placeholder="Name"
            required
            type="text"
            v-model="form.name"
          >
        </div>
        <!-- <div class="form-group">
          <input
            class="form-control"
            placeholder="Color"
            required
            type="color"
            v-model="form.color"
          >
        </div>-->
        <!-- <div class="form-group">
          <textarea
            type="text"
            class="form-control"
            placeholder="Description"
            v-model="form.description"
          ></textarea>
        </div>-->
        <div class="form-group">
          <select
            class="form-control"
            required
            v-model="form.category"
          >
            <option
              :value="category._id"
              v-for="category in reportCategories"
              v-text="category.name"
            ></option>
          </select>
        </div>
        <!--         <div class="form-group text-center">
          <label for>Set Milestones - Muxt Be In Order</label>
          <div class="row">
            <h5>Selection</h5>
            <div class="checkbox-inline" v-for="responseType in responseTypes">
              <label>
                <input type="checkbox" :value="responseType._id" @change="milestoneSelected">
                {{ responseType.name }}
              </label>
            </div>
          </div>
          <div class="row">
            <h5>Ordered List</h5>
            <draggable v-model="form.milestones">
              <div
                class="p-2 border"
                v-for="(milestoneId, index) in form.milestones"
                :key="milestoneId"
              >{{ index + 1 }}. {{ getMilestoneName(milestoneId) }}</div>
            </draggable>
          </div>
        </div>-->
        <button
          :disabled="loadingCreateReportType"
          class="btn btn-primary float-right"
        >{{ loadingCreateReportType ? 'Loading' : 'Save' }}</button>
      </form>
    </uiv-modal>
    <div class="clearfix">
      <h3 class="float-left">Report Types</h3>
      <a-button
        @click.prevent="isCreateReportTypeModalVisible = true"
        class="float-right my-6"
        type="primary"
      >Create Report Type</a-button>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="types"
      :loading="loadingGetReportTypes"
      :rowKey="type => type._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="actions"
        slot-scope="record"
      >
        <a-button type="primary">
          <nuxt-link :to="`/command-center/report-types/${record._id}/edit`">Edit</nuxt-link>
        </a-button>
        <a-button
          disabled
          type="danger"
        >Delete</a-button>
      </template>
    </a-table>
  </section>
</template>


<script>
import draggable from "vuedraggable";

export default {
  layout: "command-center/default",
  components: {
    draggable
  },
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view report types")) {
      return redirect("/");
    }
  },
  data() {
    return {
      isCreateReportTypeModalVisible: false,
      loadingCreateReportType: false,
      loadingGetReportTypes: false,
      types: [],
      reportCategories: [],
      responseTypes: [],
      selectedResponseTypes: [],
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        // {
        //   title: "Color",
        //   dataIndex: "color"
        // },
        {
          title: "Actions",
          scopedSlots: { customRender: "actions" },
          width: "20%"
        }
      ],
      form: {
        name: "",
        description: "",
        category: "",
        milestones: []
      }
    };
  },
  mounted() {
    this.getReportTypes();
    this.getReportCategories();
    // this.getResponseTypes();
    this.resetData();
  },
  watch: {
    selectedResponseTypes(value) {
      this.form.milestones.push(value);
    }
  },
  methods: {
    getMilestoneName(id) {
      return this.responseTypes.find(type => type._id === id).name;
    },
    resetData() {
      this.form.name = "";
      this.form.description = "";
    },
    getReportTypes() {
      this.$axios.$get("/api/v1/report-types").then(response => {
        this.types = response.data;
      });
    },
    getReportCategories() {
      this.$axios.$get("/api/v1/report-categories").then(response => {
        this.reportCategories = response.data;
        this.form.category = response.data[0]._id;
      });
    },
    getResponseTypes() {
      this.loadingGetReportTypes = true;
      this.$axios.$get("/api/v1/response-types").then(response => {
        this.responseTypes = response.data;
        this.loadingGetReportTypes = false;
      });
    },
    milestoneSelected(event) {
      if (event.target.checked) {
        this.form.milestones.push(event.target.value);
      } else {
        const milestoneIndex = this.form.milestones.findIndex(milestoneId => {
          return milestoneId === event.target.value;
        });

        if (milestoneIndex !== -1) {
          this.form.milestones.splice(milestoneIndex, 1);
        }
      }
    },
    createReportType() {
      this.loadingCreateReportType = true;
      this.$axios.$post("/api/v1/report-types", this.form).then(response => {
        this.resetData();
        this.types.push(response.data);
        this.loadingCreateReportType = false;
        this.isCreateReportTypeModalVisible = false;
      });
    }
  }
};
</script>

<style scoped>
td {
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>

<template>
  <section
    class="w-full select-none"
    style="width: 100%"
  >
    <modal
      :footer="false"
      title="Create Report Category"
      v-model="isCreateReportCategoryModalVisible"
    >
      <form
        @submit.prevent="createReportCategory"
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
        <div class="form-group">
          <input
            class="form-control"
            placeholder="Name"
            required
            type="color"
            v-model="form.color"
          >
        </div>
        <!-- <div class="form-group">
          <textarea
            cols="30" rows="10"
            class="form-control"
            placeholder="Description"
            v-model="form.description"
          ></textarea>
        </div>-->
        <button
          :disabled="loadingCreateReportCategory"
          class="btn btn-primary float-right"
        >{{ loadingCreateReportCategory ? 'Loading' : 'Save' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Report Categories</h3>
      <a-button
        @click.prevent="isCreateReportCategoryModalVisible = true"
        class="float-right my-6"
        type="primary"
      >Create Report Category</a-button>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="reportCategories"
      :loading="loadingGetReportCategories"
      :rowKey="category => category._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="actions"
        slot-scope="text, record"
      >
        <a-button
          disabled
          type="primary"
        >Edit</a-button>
        <a-button
          disabled
          type="danger"
        >Delete</a-button>
      </template>
    </a-table>
    <!-- <table class="table-bordered :scroll="{ x: 900 }" w-full">
      <thead>
        <tr>
          <td>Name</td>
          <td>Description</td>
          <td>Created At</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in reportCategories">
          <td>{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td>{{ category.createdAt }}</td>
          <td>
            <button class="m-2 btn btn-info" disabled>Edit</button>
            <button class="m-2 btn btn-danger" disabled>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>-->
  </section>
</template>


<script>
export default {
  layout: "command-center/default",
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view report categories")) {
      return redirect("/");
    }
  },
  data() {
    return {
      loadingGetReportCategories: false,
      isCreateReportCategoryModalVisible: false,
      loadingCreateReportCategory: false,
      reportCategories: [],
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "Color",
          dataIndex: "color"
        },
        {
          title: "Actions",
          dataIndex: "actions",
          scopedSlots: { customRender: "actions" }
        }
      ],
      form: {
        name: "",
        color: "",
        description: ""
      }
    };
  },
  mounted() {
    this.getReportCategories();
    this.generateFakeData();
  },
  methods: {
    generateFakeData() {
      this.form.name = ``;
      this.form.color = this.$chance.color({ format: "hex" });
    },
    getReportCategories() {
      this.loadingGetReportCategories = true;
      this.$axios.$get("/report-categories").then(response => {
        this.reportCategories = response.data;
        this.loadingGetReportCategories = false;
      });
    },
    createReportCategory() {
      this.loadingCreateReportCategory = true;
      this.$axios.$post("/report-categories", this.form).then(response => {
        this.generateFakeData();
        this.reportCategories.push(response.data);
        this.loadingCreateReportCategory = false;
        this.isCreateReportCategoryModalVisible = false;
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

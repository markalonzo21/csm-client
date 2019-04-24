<template>
  <section
    class="w-full select-none"
    style="width: 100%"
  >
    <uiv-modal
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
    </uiv-modal>
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
        slot="color"
        slot-scope="color"
      >
        <div
          :style="`background-color: ${color};width: 20px ;height: 20px  ;`"
          class="rounded-full"
        ></div>
      </template>
      <template
        slot="actions"
        slot-scope="record"
      >
        <a-button type="primary">
          <nuxt-link :to="`/command-center/report-categories/${record._id}/edit`">Edit</nuxt-link>
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
          scopedSlots: { customRender: "name" },
          width: "80%"
        },
        {
          title: "Color",
          dataIndex: "color",
          scopedSlots: { customRender: "color" },
          width: "10%"
        },
        {
          title: "Actions",
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
  },
  methods: {
    getReportCategories() {
      this.loadingGetReportCategories = true;
      this.$axios.$get("/api/v1/admin/report-categories").then(response => {
        this.reportCategories = response.data;
        this.loadingGetReportCategories = false;
      });
    },
    createReportCategory() {
      this.loadingCreateReportCategory = true;
      this.$axios
        .$post("/api/v1/admin/report-categories", this.form)
        .then(response => {
          this.form.name = "";
          this.form.color = "";
          this.form.description = "";
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

<template>
  <div>
    <a-form
      @submit.prevent="updateType"
      class="container clearfix"
    >
      <h4 class="text-center">Edit Type</h4>
      <a-form-item
        :labelCol="{span: 4}"
        :wrapperCol="{span: 18}"
        label="* Type Name"
      >
        <a-input
          type="text"
          v-model="form.name"
        />
      </a-form-item>

      <a-form-item
        :labelCol="{span: 4}"
        :wrapperCol="{span: 18}"
        label="* Category"
      >
        <select
          class="form-control"
          required
          v-model="form.category"
        >
          <option
            :key="`category-${category._id}`"
            :value="category._id"
            v-for="category in categories"
            v-text="category.name"
          ></option>
        </select>
      </a-form-item>

      <a-form-item :wrapperCol="{offset: 20}">
        <a-button
          :loading="loadingUpdateType"
          htmlType="submit"
          type="primary"
        >Update</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import Form from "@/utils/Form";

export default {
  layout: "command-center/default",
  async asyncData({ $axios, store, error, params }) {
    if (!store.getters["auth/hasPermission"]("update report type")) {
      return redirect("/");
    }

    const getReportType = () =>
      $axios.$get(`/api/v1/admin/report-types/${params.id}`);
    const getCategories = () => $axios.$get(`/api/v1/admin/report-categories`);
    const { data } = await getReportType();
    const categories = await getCategories();

    return {
      categories: categories.data,
      form: {
        name: data.name,
        category: data.category
      }
    };
  },
  data() {
    return {
      loadingUpdateType: false
    };
  },

  methods: {
    updateType() {
      this.loadingUpdateType = true;

      this.$axios
        .$patch(
          `/api/v1/admin/report-types/${this.$route.params.id}`,
          this.form
        )
        .then(response => {
          this.loadingUpdateType = false;
          this.$message.info("Report Type Has Been Updated!");
        })
        .catch(error => {
          if (error.response.status === 422) {
            this.$message.error("Type Name Must Be Unique!");
          }
          this.loadingUpdateType = false;
        });
    }
  }
};
</script>

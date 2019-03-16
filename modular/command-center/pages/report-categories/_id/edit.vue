<template>
  <div>
    <a-form
      @submit.prevent="updateCategory"
      class="container clearfix"
    >
      <h4 class="text-center">Edit Category</h4>
      <a-form-item
        :labelCol="{span: 4}"
        :wrapperCol="{span: 18}"
        label="* Category Name"
      >
        <a-input
          type="text"
          v-model="form.name"
        />
      </a-form-item>

      <a-form-item
        :labelCol="{span: 4}"
        :wrapperCol="{span: 18}"
        label="Color"
      >
        <a-input
          type="color"
          v-model="form.color"
        />
      </a-form-item>

      <a-form-item :wrapperCol="{offset: 20}">
        <a-button
          :loading="loadingUpdateCategory"
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
    if (!store.getters["auth/hasPermission"]("update report category")) {
      return redirect("/");
    }

    const { data } = await $axios.$get(
      `/api/v1/admin/report-categories/${params.id}`
    );

    return {
      form: {
        name: data.name,
        color: data.color
      }
    };
  },
  data() {
    return {
      loadingUpdateCategory: false
    };
  },

  methods: {
    updateCategory() {
      this.loadingUpdateCategory = true;

      this.$axios
        .$patch(
          `/api/v1/admin/report-categories/${this.$route.params.id}`,
          this.form
        )
        .then(response => {
          this.loadingUpdateCategory = false;
          this.$message.info("Report Category Has Been Updated!");
        })
        .catch(error => {
          if (error.response.status === 422) {
            this.$message.error("Category Name Must Be Unique!");
          }
          this.loadingUpdateCategory = false;
        });
    }
  }
};
</script>

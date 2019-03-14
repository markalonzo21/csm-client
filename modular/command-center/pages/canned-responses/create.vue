<template>
  <a-form
    @submit.prevent="createCannedResponse"
    class="container clearfix"
  >
    <h3 class="mt-0 mb-12">Create Canned Response</h3>

    <a-form-item
      :labelCol="{span: 4}"
      :validateStatus="form.errors.has('content') ? 'error' : null"
      :wrapperCol="{span: 18}"
      label="* Content"
    >
      <a-textarea
        :autosize="{ minRows: 8, maxRows: 12 }"
        v-model="form.content"
      />
      <div class="ant-form-explain">{{ form.errors.first('content') }}</div>
    </a-form-item>

    <a-form-item :wrapperCol="{offset: 20}">
      <a-button
        :loading="loadingCreateCannedResponse"
        htmlType="submit"
        type="primary"
      >Create</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import Form from "@/utils/Form";

export default {
  layout: "command-center/default",
  async asyncData({ $axios, store, error, redirect }) {
    if (!store.getters["auth/hasPermission"]("create canned response")) {
      return redirect("/");
    }
  },
  data() {
    return {
      loadingCreateCannedResponse: false,
      form: new Form({
        content: ""
      })
    };
  },

  methods: {
    createCannedResponse() {
      this.loadingCreateCannedResponse = true;

      this.$axios
        .$post(`/api/v1/admin/canned-responses`, this.form)
        .then(response => {
          this.form.reset();
          this.form.errors.clear();
          this.loadingCreateCannedResponse = false;
          this.$router.push("/command-center/canned-responses");
        })
        .catch(error => {
          this.form.errors.record(error.response.data.errors);
          this.loadingCreateCannedResponse = false;
        });
    }
  }
};
</script>

<style>
td {
  white-space: pre;
}
</style>

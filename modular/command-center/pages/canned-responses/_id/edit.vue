a<template>
  <a-form
    @submit.prevent="createCannedResponse"
    class="container clearfix"
  >
    <h3 class="mt-0 mb-12">Update Canned Response</h3>

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
        :loading="loadingUpdateCannedResponse"
        htmlType="submit"
        type="primary"
      >Update</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
import Form from "@/utils/Form";

export default {
  layout: "command-center/default",
  async asyncData({ $axios, store, error, redirect, params }) {
    if (!store.getters["auth/hasPermission"]("update canned response")) {
      return redirect("/");
    }

    return $axios
      .$get(`/admin/canned-responses/${params.id}`)
      .then(response => {
        return {
          form: new Form({
            content: response.data.content
          })
        };
      });
  },
  data() {
    return {
      loadingUpdateCannedResponse: false,
      form: new Form({
        content: ""
      })
    };
  },

  methods: {
    createCannedResponse() {
      this.loadingUpdateCannedResponse = true;

      this.$axios
        .$patch(`/admin/canned-responses/${this.$route.params.id}`, this.form)
        .then(response => {
          this.form.errors.clear();
          this.loadingUpdateCannedResponse = false;
          this.$message.info("Canned response has been updated!");
        })
        .catch(error => {
          this.form.errors.record(error.response.data.errors);
          this.loadingUpdateCannedResponse = false;
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

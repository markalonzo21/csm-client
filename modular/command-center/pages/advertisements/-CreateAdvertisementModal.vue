<template>
  <a-modal
    @onOk="handleOk"
    title="Create Advertisement"
    v-model="visible"
  >
    <template slot="footer">
      <a-button
        @click="visible = false"
        key="back"
      >Cancel</a-button>
      <a-button
        :disabled="!form.image"
        :loading="loadingCreateAdvertisement"
        @click="handleOk"
        key="submit"
        type="primary"
      >Create</a-button>
    </template>
    <form @submit.prevent="createAdvertisement">
      <a-form-item
        :validateStatus="form.errors.has('image') ? 'error' : null"
        label="Image"
      >
        <a-upload
          :beforeUpload="beforeUpload"
          :image="form.image"
          :remove="handleRemove"
        >
          <a-button>
            <a-icon type="upload"/>Select File
          </a-button>
        </a-upload>
        <div class="ant-form-explain">{{ form.errors.first('image') }}</div>
      </a-form-item>
      <a-form-item label="Link">
        <a-input
          type="text"
          v-model="form.link"
        />
      </a-form-item>
      <a-form-item
        :validateStatus="form.errors.has('placement') ? 'error' : null"
        label="Placement"
      >
        <a-select v-model="form.placement">
          <a-select-option value="home-page">Home Page</a-select-option>
          <a-select-option value="new-report">New Report</a-select-option>
        </a-select>
        <div class="ant-form-explain">{{ form.errors.first('placement') }}</div>
      </a-form-item>
    </form>
  </a-modal>
</template>

<script>
import Form from "@/utils/Form";

export default {
  data() {
    return {
      visible: true,
      loadingCreateAdvertisement: false,
      form: new Form({
        image: [],
        link: "",
        placement: "home-page"
      })
    };
  },
  watch: {
    visible(value) {
      if (value === false) this.$emit("onClose");
    }
  },
  methods: {
    handleRemove(file) {
      const index = this.form.image.indexOf(file);
      const newFileList = this.form.image.slice();
      newFileList.splice(index, 1);
      this.form.image = newFileList;
    },
    beforeUpload(file) {
      this.form.image = [];
      this.form.image = [file];
      return false;
    },
    handleOk(e) {
      this.createAdvertisement();
    },
    createAdvertisement() {
      this.loadingCreateAdvertisement = true;

      const { image } = this;
      const formData = new FormData();
      this.form.image.forEach(file => {
        formData.append("image", file);
      });
      formData.append("link", this.form.link);
      formData.append("placement", this.form.placement);
      this.$axios
        .$post("/api/v1/admin/advertisements", formData)
        .then(response => {
          this.loadingCreateAdvertisement = false;
          this.form.errors.clear();
          this.$message.success("Advertisement has been created.");
          this.$emit("onCreate", response.data);
        })
        .catch(error => {
          if (error.response.status === 422) {
            this.form.errors.record(error.response.data.errors);
          } else {
            alert("Something went wrong! Please reload the page.");
          }
          console.log(error);
          this.loadingCreateAdvertisement = false;
        });
    }
  }
};
</script>

<template>
  <a-modal
    @onOk="handleOk"
    title="Create Banner"
    v-model="visible"
  >
    <template slot="footer">
      <a-button
        @click="visible = false"
        key="back"
      >Cancel</a-button>
      <a-button
        :disabled="fileList.length === 0"
        :loading="loadingCreateBanner"
        @click="handleOk"
        key="submit"
        type="primary"
      >Create</a-button>
    </template>
    <form @submit.prevent="createBanner">
      <a-upload
        :beforeUpload="beforeUpload"
        :fileList="fileList"
        :remove="handleRemove"
      >
        <a-button>
          <a-icon type="upload"/>Select File
        </a-button>
      </a-upload>
    </form>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      loadingCreateBanner: false,
      fileList: []
    };
  },
  watch: {
    visible(value) {
      if (value === false) this.$emit("onClose");
    }
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [];
      this.fileList = [...this.fileList, file];
      return false;
    },
    handleOk(e) {
      this.createBanner();
    },
    createBanner() {
      this.loadingCreateBanner = true;

      const { fileList } = this;
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append("image", file);
      });

      this.$axios
        .$post("/api/v1/admin/banners", formData)
        .then(response => {
          this.loadingCreateBanner = false;
          this.$message.success("Banner has been created.");
          this.$emit("onCreate", response.data);
        })
        .catch(error => {
          alert("Something went wrong! Please reload the page.");
          console.log(error);
          this.loadingCreateBanner = false;
        });
    }
  }
};
</script>

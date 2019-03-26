<template>
  <a-modal
    @onOk="handleOk"
    title="Create Article"
    v-model="visible"
  >
    <template slot="footer">
      <a-button
        @click="visible = false"
        key="back"
      >Cancel</a-button>
      <a-button
        :disabled="form.media.length === 0"
        :loading="loadingCreateArticle"
        @click="handleOk"
        key="submit"
        type="primary"
      >Create</a-button>
    </template>
    <form @submit.prevent="createArticle">
      <a-form-item label="Media">
        <a-upload
          :beforeUpload="beforeUpload"
          :media="form.media"
          :remove="handleRemove"
        >
          <a-button>
            <a-icon type="upload"/>Select File
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="Title">
        <a-input
          type="text"
          v-model="form.title"
        />
      </a-form-item>
      <a-form-item label="Description">
        <a-textarea
          :autosize="{ minRows: 2, maxRows: 6 }"
          v-model="form.description"
        />
      </a-form-item>
    </form>
  </a-modal>
</template>

<script>
export default {
  data() {
    return {
      visible: true,
      loadingCreateArticle: false,
      form: {
        media: [],
        title: "",
        description: ""
      }
    };
  },
  watch: {
    visible(value) {
      if (value === false) this.$emit("onClose");
    }
  },
  methods: {
    handleRemove(file) {
      const index = this.form.media.indexOf(file);
      const newFileList = this.form.media.slice();
      newFileList.splice(index, 1);
      this.form.media = newFileList;
    },
    beforeUpload(file) {
      this.form.media = [];
      this.form.media = [...this.form.media, file];
      return false;
    },
    handleOk(e) {
      this.createArticle();
    },
    createArticle() {
      this.loadingCreateArticle = true;

      const { media } = this;
      const formData = new FormData();
      this.form.media.forEach(file => {
        formData.append("media[]", file);
      });
      formData.append("title", this.form.title);
      formData.append("description", this.form.description);
      this.$axios
        .$post("/api/v1/admin/articles", formData)
        .then(response => {
          this.loadingCreateArticle = false;
          this.$message.success("Article has been created.");
          this.$emit("onCreate", response.data);
        })
        .catch(error => {
          alert("Something went wrong! Please reload the page.");
          console.log(error);
          this.loadingCreateArticle = false;
        });
    }
  }
};
</script>

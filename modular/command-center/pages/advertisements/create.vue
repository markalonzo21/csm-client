<template>
  <div class="ant-col-xs-24">
    <div class="container">
      <div class="clearfix">
        <h3 class="text-center">Create Advertisement</h3>
      </div>
      <hr>
      <div class="content">
        <a-form
          :form="form"
          @submit="handleSubmit"
          class="login-form"
          id="components-form-demo-normal-login"
        >
          <a-form-item>
            <a-input
              placeholder="Advertisement Name"
              v-decorator="[
              'name',
              { rules: [{ required: true, message: 'Please input advertisement name!' }] }
            ]"
            ></a-input>
          </a-form-item>
          <a-form-item>
            <a-input
              placeholder="Advertisement link (Optional)"
              v-decorator="[
              'link',
              { rules: [] }
            ]"
            ></a-input>
          </a-form-item>
          <a-form-item label="Image">
            <a-upload
              :beforeUpload="beforeUpload"
              :disabled="fileList.length > 0"
              :fileList="fileList"
              :remove="handleRemove"
              v-decorator="[
              'image',
              { rules: [{ required: true, message: 'Image is required!' }] }
            ]"
            >
              <a-button>
                <a-icon type="upload"/>Select File
              </a-button>
            </a-upload>
          </a-form-item>

          <a-button
            :loading="loadingCreateAdvertisement"
            class="float-right"
            htmlType="submit"
            type="primary"
          >Create</a-button>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: "command-center/default",
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("create advertisement")) {
      return redirect("/");
    }
  },
  data() {
    return {
      loadingCreateAdvertisement: false,
      fileList: [],
      form: this.$form.createForm(this)
    };
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    beforeUpload(file) {
      this.fileList = [...this.fileList, file];
      return false;
    },
    processFile(event) {
      this.fileList = [];

      const files = event.target.files;

      if (files.length > 3) {
        alert("Maximum of 3 image");
        return;
      }

      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        let reader = new FileReader();
        reader.onload = e => {
          this.fileList.push({
            file: file,
            src: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    },
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loadingCreateAdvertisement = true;
          console.log("Received values of form: ", values);

          let formData = new FormData();
          formData.append("name", values.name);
          formData.append("link", values.link);
          formData.append("image", values.image.file);

          this.$axios
            .$post("/api/v1/admin/advertisements", formData)
            .then(response => {
              this.$router.push("/command-center/advertisements");
              this.loadingCreateAdvertisement = true;
            })
            .catch(error => {
              console.log(error);
              this.loadingCreateAdvertisement = true;
            });
        }
      });
    }
  }
};
</script>

<style>
#components-form-demo-normal-login .login-form {
  max-width: 300px;
}
#components-form-demo-normal-login .login-form-forgot {
  float: right;
}
#components-form-demo-normal-login .login-form-button {
  width: 100%;
}
</style>

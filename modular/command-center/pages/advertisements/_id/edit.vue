<template>
  <div class="ant-col-xs-24">
    <div class="clearfix">
      <h3 class="float-left">Edit Advertisement | {{ $route.params.id }}</h3>
    </div>
    <hr>
    <div class="content">
      <a-form id='components-form-demo-normal-login' @submit.prevent="handleSubmit" class='login-form'>
        <a-form-item>
          <a-input
            placeholder='Advertisement Name'
            name="name"
            v-model="form.name"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input
            placeholder='Advertisement link'
            name="link"
            v-model="form.link"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          label='Image'
        >
          <input type="file" @change="processFile($event)">

          <img :src="form.image.src" class="mt-6 max-w-md max-h-md" alt="Image">
        </a-form-item>
        <a-form-item>
          <a-button type='primary' htmlType='submit' class='login-form-button' :loading="loadingUpdateAdvertisement">
            Submit
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'command-center/default',
  asyncData({ store, redirect, error, $axios, params }) {
    if (!store.getters["auth/hasPermission"]("update advertisement")) {
      return redirect("/");
    }

    return $axios.$get(`/admin/advertisements/${params.id}`).then(response => {
      return {
        form: {
          name: response.data.name,
          link: response.data.link,
          image: { file: null, src: response.data.image }
        }
      }
    }).catch(err => {
      error({ status: 404, message: 'Advertisement does not exists.' })
    })
  },
  data() {
    return {
      loadingUpdateAdvertisement: false,
      fileList: [],
    }
  },
  methods: {
    processFile(event) {
      this.fileList = [];

      const files = event.target.files;

      if (files.length > 3) {
        alert("Maximum of 3 images");
        return;
      }

      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        let reader = new FileReader();
        reader.onload = e => {
          this.form.image.file = file
          this.form.image.src = e.target.result
        };
        reader.readAsDataURL(file);
      }
    },
    handleSubmit () {
      let formData = new FormData()
      formData.append('name', this.form.name)
      formData.append('link', this.form.link)
      formData.append('image', this.form.image.file)

      this.$axios.$patch(`/admin/advertisements/${this.$route.params.id}`, formData).then(response => {
        this.$router.push('/command-center/advertisements')
        this.loadingUpdateAdvertisement = true
      }).catch(error => {
        console.log(error)
        this.loadingUpdateAdvertisement = true
      })
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

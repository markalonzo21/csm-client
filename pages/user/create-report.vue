<template>
  <div class="main-content">
    <section class="report">
      <div class="container mx-auto max-w-md">
        <div class="panel">
          <div class="panel-body">
            <h1 class="title__blue">What will you report?</h1>
            <form @submit.prevent="report">
              <label for="" class="title__gray--small" style="font-size:14px;">Category</label>
              <br>
              <select v-model="reportCategory" required class="form-control mb20">
                <option
                  v-for="(category, index) in reportCategories"
                  :key="category._id + index"
                  :value="index"
                  v-text="category.name"
                ></option>
              </select>
              <label for="" class="title__gray--small" style="font-size:14px;">Type</label>
              <br>
              <select v-model="form.type" required class="form-control mb20">
                <option
                  v-for="type in reportTypes"
                  :key="type._id"
                  :value="type._id"
                  v-text="type.name"
                ></option>
              </select>
              <div class="upload-btn-wrapper w-100 mb20 ">
                <button class="btnupload w-100">Upload Photos</button>
                <input type="file" accept="image/*"  multiple @change="processFile($event)">
              </div>
              <div class="row">
                <div class="col-md-4" v-for="photo in form.photos">
                  <img :src="photo.src" alt="photo" class="h-24 w-full">
                </div>
              </div>
              <br>
              <label for="" class="title__gray--small" style="font-size:14px;">Notes</label>
              <br>
              <textarea
                cols="30"
                rows="10"
                v-model="form.description"
                class="form-control mb20"
                placeholder="Description"
              ></textarea>
              <button type="submit" class="btn btnblue" :disabled="loadingSubmitReport">{{ loadingSubmitReport ? 'Loading...' : 'Submit' }}</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  asyncData({ $axios, error }) {
    return $axios.$get('/report-categories').then(response => {
      return {
        loadingSubmitReport: false,
        reportCategories: response.data,
        reportCategory: 0,
        reportTypes: response.data[0].reportTypes,
        form: {
          type: response.data[0].reportTypes[0]._id,
          description: 'Please Help!',
          location: {
            type: 'Point',
            coordinates: { lng: null, lat: null }
          },
          photos: []
        }
      }
    })
  },
  watch: {
    reportCategory(index) {
      const reportCategory = this.reportCategories[index]
      this.$nextTick(() => {
        this.reportTypes = reportCategory.reportTypes
        this.form.type = reportCategory.reportTypes[0]._id
      })
    }
  },
  mounted() {
    this.generateFakeData()
  },
  methods: {
    processFile(event) {
      this.form.photos = []

      const files = event.target.files

      if (files.length > 3) {
        alert('Maximum of 3 photos')
        return
      }

      for (var i = 0; i < files.length; i++) {
        const file = files[i]
        let reader = new FileReader()
        reader.onload = e => {
          this.form.photos.push({
            file: file,
            src:  e.target.result
          })
        }
        reader.readAsDataURL(file)
      }
    },
    generateFakeData() {
      this.form.location.coordinates.lat = this.$chance.latitude({
        min: 14.5565,
        max: 14.63956
      })
      this.form.location.coordinates.lng = this.$chance.longitude({
        min: 120.89287,
        max: 121.07483
      })
    },
    report() {
      this.loadingSubmitReport = true

      // Validate Location1
      let formData = new FormData()

      formData.append('description', this.form.description)
      formData.append('type', this.form.type)
      formData.append('location', JSON.stringify(this.form.location))

      this.form.photos.forEach(photo => {
        formData.append('photos[]', photo.file)
      })

      this.$axios
        .$post('/reports', formData)
        .then(response => {

          setTimeout(() => {
            this.loadingSubmitReport = false
            this.$router.push(`/user/reports/${response.data._id}`)
          }, 500)
        })
        .catch(err => {
          if (err.response.code === 422) {
            // Show Validation Errors
          } else {
            // Logger
          }

          setTimeout(() => {
            this.loadingSubmitReport = false
          }, 500)
        })
    }
  }
}
</script>


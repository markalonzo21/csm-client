<template>
  <div class="main-content">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <section class="report">
            <div class="panel">
              <div class="panel-body text-center">
                <h1 class="title__blue mb-12">Create Many Reports</h1>
                <form @submit.prevent="report">
                  <label for class="title__gray--small" style="font-size:18px;">How Many Reports?</label>
                  <br>
                  <input
                    type="number"
                    class="w-full p-4 form-control mb-10"
                    max="5000"
                    v-model="form.total"
                  >
                  <button
                    type="submit"
                    class="btn btnblue w-full"
                    :disabled="loadingSubmitReport"
                  >{{ loadingSubmitReport ? "Loading..." : "GO!" }}</button>
                </form>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ $axios, error }) {
    const getCategories = $axios.$get('/report-categories')
    const getAreas = $axios.$get('/areas')
    return Promise.all([getCategories, getAreas]).then(
      ([categories, areas]) => {
        return {
          areas: areas.data,
          loadingSubmitReport: false,
          categories: categories.data.filter(
            category => category.types.length > 0
          ),
          category: 0,
          types: categories.data[0].types,
          form: {
            type: categories.data[0].types[0]._id,
            description: 'Please Help!',
            location: {
              type: 'Point',
              coordinates: { lng: null, lat: null }
            },
            total: 20
          },
          area: ''
        }
      }
    )
  },
  watch: {
    area(index) {
      if (Number.isInteger(index)) {
        const area = this.areas[index]
        const geoJSON = L.geoJSON(area.location)
        const bounds = geoJSON.getBounds()
        this.randomWithinBounds(bounds)
      } else {
        this.getGeolocation()
      }
    }
  },
  methods: {
    randomWithinBounds(bounds) {
      var lat_min = bounds.getSouthWest().lat,
        lat_range = bounds.getNorthEast().lat - lat_min,
        lng_min = bounds.getSouthWest().lng,
        lng_range = bounds.getNorthEast().lng - lng_min

      this.form.location.coordinates.lat = lat_min + Math.random() * lat_range
      this.form.location.coordinates.lng = lng_min + Math.random() * lng_range
    },
    report() {
      this.loadingSubmitReport = true

      if (this.form.total < 5000) {
        this.form.total = 5000
      }

      for (let index = 0; index < this.form.total; index++) {
        // Random Type
        const category = this.categories[
          Math.floor(Math.random() * this.categories.length)
        ]
        this.form.type =
          category.types[Math.floor(Math.random() * category.types.length)]._id

        // Random location
        const area = this.areas[Math.floor(Math.random() * this.areas.length)]
        const geoJSON = L.geoJSON(area.location)
        const bounds = geoJSON.getBounds()
        this.randomWithinBounds(bounds)

        let formData = new FormData()
        formData.append('description', this.form.description)
        formData.append('type', this.form.type)
        formData.append('location_lat', this.form.location.coordinates.lat)
        formData.append('location_lng', this.form.location.coordinates.lng)

        this.$axios
          .$post('/reports', formData)
          .then(response => {
            this.loadingSubmitReport = false
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>

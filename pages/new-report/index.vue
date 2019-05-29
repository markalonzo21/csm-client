<template>
  <div class="main-content">
    <div class="container">
      <div class="row">
        <div class="col-sm-9 left-content">
          <section class="report">
            <div class="panel">
              <div class="panel-body">
                <h1 class="title__blue">What will you report?</h1>
                <form @submit.prevent="report">
                  <label
                    class="title__gray--small"
                    for
                    style="font-size:14px;"
                  >Category</label>
                  <br>
                  <select
                    class="form-control mb20"
                    required
                    v-model="category"
                  >
                    <option
                      :disabled="category.types.length === 0"
                      :key="category._id + index"
                      :value="index"
                      v-for="(category, index) in reportCategories"
                      v-text="category.name"
                    ></option>
                  </select>
                  <label
                    class="title__gray--small"
                    for
                    style="font-size:14px;"
                  >Type</label>
                  <br>
                  <select
                    class="form-control mb20"
                    required
                    v-model="form.type"
                  >
                    <option
                      :key="type._id"
                      :value="type._id"
                      v-for="type in types"
                      v-text="type.name"
                    ></option>
                  </select>
                  <div class="upload-btn-wrapper w-100 mb20">
                    <button class="btnupload w-100">Upload Image/Video</button>
                    <input
                      @change="processFile($event)"
                      accept="image/*, video/*"
                      multiple
                      type="file"
                    >
                  </div>
                  <div class="row">
                    <div
                      :key="`media-${index}`"
                      class="col-md-4"
                      v-for="(media, index) in form.media"
                    >
                      <img
                        :src="media.src"
                        alt="media"
                        class="h-24"
                        style="width: 300px;"
                        v-if="isImage(media.src)"
                      >
                      <video
                        controls
                        v-else
                        width="300"
                      >
                        <source
                          :src="media.src"
                          type="video/mp4"
                        >
                      </video>
                    </div>
                  </div>
                  <label
                    class="title__gray--small"
                    for
                    style="font-size:14px;"
                  >Demo Area (For Testing Purposes Only)</label>
                  <div
                    style="padding-left: 25px;"
                    v-if="areas.length > 0"
                  >
                    <label class="radio">
                      <input
                        type="radio"
                        v-model="area"
                        value
                      >Current Location
                    </label>
                    <label
                      :key="index+'-area'"
                      class="radio"
                      v-for="(item, index) in areas"
                    >
                      <input
                        :value="index"
                        type="radio"
                        v-model="area"
                      >
                      {{ item.name }}
                    </label>
                  </div>
                  <br>
                  <label
                    class="title__gray--small"
                    for
                    style="font-size:14px;"
                  >Notes</label>
                  <br>
                  <textarea
                    class="form-control mb20"
                    cols="30"
                    placeholder="Description"
                    required="true"
                    rows="10"
                    v-model="form.description"
                  ></textarea>
                  <button
                    :disabled="loadingSubmitReport"
                    class="btn btnblue"
                    type="submit"
                  >{{ loadingSubmitReport ? "Loading..." : "Submit" }}</button>
                </form>
              </div>
            </div>
          </section>
        </div>
        <div
          class="col-sm-3 right-content"
          v-if="promotion"
        >
          <a
            :href="promotion.link"
            target="_blank"
            v-if="promotion.link"
          >
            <img
              :src="$utils.cloudinaryTransform(promotion.image, 'w_262,h_217')"
              class="img-responsive mb20"
              style="max-height: 217px; max-width: 262px;"
            >
          </a>
          <img
            :src="$utils.cloudinaryTransform(promotion.image, 'w_262,h_217')"
            class="img-responsive mb20"
            style="max-height: 217px; max-width: 262px;"
            v-else
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
if (process.client) {
  const L = require("leaflet");
}

export default {
  asyncData({ $axios, error }) {
    const getCategories = $axios.$get("/api/v1/report-categories");
    const getAreas = $axios.$get("/api/v1/areas");
    const getAdvertisement = $axios.$get(
      "/api/v1/promotions?placement=new-report"
    );

    return Promise.all([getCategories, getAreas, getAdvertisement]).then(
      ([categories, areas, promotion]) => {
        return {
          areas: areas.data,
          promotion: promotion.data[0],
          loadingSubmitReport: false,
          reportCategories: categories.data,
          category: 0,
          types: categories.data[0].types,
          form: {
            type: categories.data[0].types[0]._id,
            description: "Please Help!",
            location: {
              type: "Point",
              coordinates: { lng: null, lat: null }
            },
            media: []
          },
          area: ""
        };
      }
    );
  },
  watch: {
    category(index) {
      const category = this.reportCategories[index];
      this.$nextTick(() => {
        this.types = category.types;
        this.form.type = category.types[0]._id;
      });
    },
    area(index) {
      if (Number.isInteger(index)) {
        const area = this.areas[index];
        const geoJSON = L.geoJSON(area.location);
        const bounds = geoJSON.getBounds();
        this.randomWithinBounds(bounds);
      } else {
        this.getGeolocation();
      }
    }
  },
  mounted() {
    this.getGeolocation();
  },
  methods: {
    getGeolocation() {
      this.$getLocation({
        enableHighAccuracy: true,
        timeout: Infinity,
        maximumAge: 0
      })
        .then(coordinates => {
          this.form.location.coordinates.lng = coordinates.lng;
          this.form.location.coordinates.lat = coordinates.lat;
        })
        .catch(err => {
          alert(
            "Could not access your location. Please enable your location tracking"
          );
        });
    },
    processFile(event) {
      this.form.media = [];

      const files = event.target.files;

      if (files.length > 3) {
        alert("Maximum of 3 media");
        return;
      }

      for (var i = 0; i < files.length; i++) {
        const file = files[i];
        let reader = new FileReader();
        reader.onload = e => {
          this.form.media.push({
            file: file,
            src: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    },
    randomWithinBounds(bounds) {
      var lat_min = bounds.getSouthWest().lat,
        lat_range = bounds.getNorthEast().lat - lat_min,
        lng_min = bounds.getSouthWest().lng,
        lng_range = bounds.getNorthEast().lng - lng_min;

      this.form.location.coordinates.lat = lat_min + Math.random() * lat_range;
      this.form.location.coordinates.lng = lng_min + Math.random() * lng_range;
    },
    isImage(src) {
      if (src.includes("data:image/")) {
        return true;
      }
      return false;
    },
    report() {
      if (
        !this.form.location.coordinates.lng &&
        !this.form.location.coordinates.lat
      ) {
        alert(
          "Could not access your location. Please enable your location tracking"
        );
        return;
      }

      this.loadingSubmitReport = true;

      // Validate Location
      let formData = new FormData();
      formData.append("description", this.form.description);
      formData.append("type", this.form.type);
      formData.append("location_lat", this.form.location.coordinates.lat);
      formData.append("location_lng", this.form.location.coordinates.lng);

      this.form.media.forEach(media => {
        formData.append("media[]", media.file);
      });

      this.$axios
        .$post("/api/v1/reports", formData)
        .then(response => {
          setTimeout(() => {
            this.loadingSubmitReport = false;
            this.$router.push(`/report-tracker`);
          }, 500);
        })
        .catch(err => {
          if (err.response.status === 422) {
            // Show Validation Errors
            let readableError = "";
            console.log(Object.keys(err.response.data.errors));
            Object.keys(err.response.data.errors).forEach((key, item) => {
              readableError += `${err.response.data.errors[key]} \n`;
            });
            alert(readableError);
          } else {
            // Logger
          }

          setTimeout(() => {
            this.loadingSubmitReport = false;
          }, 500);
        });
    }
  }
};
</script>

<template>
  <section class="container mx-auto max-w-md">
    <form @submit.prevent="report" class="p-4 m-4 flex flex-col ite ms-center justify-center">
      <input
        type="text"
        class="my-2 p-2 border"
        v-model="form.description"
        placeholder="Description"
      >
      <select v-model="form.type" required class="py-2 my-2">
        <option v-for="type in reportTypes" :key="type._id" :value="type._id" v-text="type.name"></option>
      </select>
      <pre class="my-2 p-2 flex items-start">
          latitude: {{ form.location.coordinates.lat }}, longitude: {{ form.location.coordinates.lng }}
      </pre>
      <button type="submit" class="p-2 my-2 border bg-black text-white rounded font-hairline">REPORT</button>
    </form>
  </section>
</template>

<script>
export default {
  asyncData({ $axios, error }) {
    return $axios.$get("/report-types").then(response => {
      return {
        loadingSubmitReport: false,
        reportTypes: response.data,
        form: {
          type: response.data[0]._id,
          description: "Please Help!",
          location: {
            type: "Point",
            coordinates: { lng: null, lat: null },
          },
        },
      }
    })
  },
  mounted() {
    this.generateFakeData()
  },
  methods: {
    generateFakeData() {
      this.form.location.coordinates.lat = this.$chance.latitude({
        min: 14,
        max: 18,
      })
      this.form.location.coordinates.lng = this.$chance.longitude({
        min: 120.5,
        max: 122,
      })
    },
    report() {
      this.loadingSubmitReport = true

      // Validate Location

      this.$axios
        .$post("/reports", {
          description: this.form.description,
          type: this.form.type,
          location: JSON.stringify(this.form.location),
        })
        .then(response => {
          this.loadingSubmitReport = false
          this.$router.push(`/reports/${response.data._id}`)
        })
        .catch(err => {
          if (err.response.code === 422) {
            // Show Validation Errors
          } else {
            // Logger
          }

          this.loadingSubmitReport = false
        })
    },
  },
}
</script>

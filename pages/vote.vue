<template>
  <section class="container mx-auto">
    <router-link to="/" class="m-2 p-2">Go to Home</router-link>
    <form @submit.prevent="vote" class="p-4 m-4 flex flex-col items-center justify-center">
      <input type="text" class="my-2 p-2" v-model="form.name" placeholder="Title">
      <select v-model="form.region" required class="py-2 my-2">
        <option
          v-for="(region, index) in regions"
          :key="'region-' + index"
          :value="region._id"
          v-text="region.name"
        ></option>
      </select>
      <div class="flex items-center">
        <div v-for="candidate in candidates" :key="candidate._id" class="m-2">
          <input
            type="radio"
            :id="candidate._id"
            :name="candidate._id"
            :value="candidate._id"
            v-model="form.candidate"
          >
          <label :for="candidate._id" v-text="candidate.name"></label>
        </div>
      </div>
      <!-- <pre class="my-2 p-2">
          latitude: {{ form.coordinates.lat }}, longitude: {{ form.coordinates.lng }}
      </pre>-->
      <button type="submit" class="p-2 my-2 border bg-black text-white rounded font-hairline">VOTE</button>
    </form>
  </section>
</template>

<script>
export default {
  asyncData({ $axios, params, error }) {
    const acceptEncoding = process.server ? "gzip, deflate" : ""

    const getCandidates = $axios.$get(`/candidates`, {
      headers: { "Accept-Encoding": acceptEncoding },
    })
    const getRegions = $axios.$get(`/regions`, {
      headers: { "Accept-Encoding": acceptEncoding },
    })

    return Promise.all([getCandidates, getRegions])
      .then(([candidates, regions]) => {
        return {
          candidates: candidates ? candidates.data : [],
          regions: regions ? regions.data : [],
          form: {
            name: "Jerico Pulvera",
            region: regions.data[0]._id,
            candidate: candidates.data[0]._id,
            coordinates: {
              lat: null,
              lng: null,
            },
          },
        }
      })
      .catch(errorResponse => {
        console.log(errorResponse.response)
        error({ statusCode: 404, message: "Page not found" })
      })
  },
  mounted() {
    this.generateFakeData()
  },
  methods: {
    vote() {
      let coordinates = [this.form.coordinates.lat, this.form.coordinates.lng]

      this.$axios
        .$post(`/votes`, {
          name: this.form.name,
          region: this.form.region,
          candidate: this.form.candidate,
          coordinates: JSON.stringify(coordinates),
        })
        .then(response => {
          this.generateFakeData()
          // this.$router.push(`/`)
        })
        .catch(errorResponse => {
          console.log(errorResponse.response.data)
        })
    },
    generateFakeData() {
      this.form.name = this.$chance.name()
      this.form.coordinates.lat = this.$chance.latitude({ min: 14, max: 18 })
      this.form.coordinates.lng = this.$chance.longitude({
        min: 120.5,
        max: 122,
      })
    },
  },
}
</script>

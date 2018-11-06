<template>
  <section class="container mx-auto">
    <router-link to="/vote"
                 class="m-2 p-2">Vote</router-link>

    <div style="margin-top: 1%;"
         class="flex items-center">
      <div v-for="candidate in candidates"
           :key="candidate._id"
           class="m-2">
        <input type="radio"
               :id="candidate._id"
               :name="candidate._id"
               :value="candidate._id"
               v-model="selectedCandidate">
        <label :for="candidate._id"
               v-text="candidate.name"></label>
      </div>
    </div>
    <GeoChart :votes="votes"
              v-if="selectedCandidate && !loading" />
  </section>
</template>

<script>
import GeoChart from '~/components/GeoChart'

export default {
  components: {
    GeoChart,
  },
  asyncData({ $axios, params, error }) {
    const acceptEncoding = process.server ? 'gzip deflate' : ''

    return $axios
      .$get(`/candidates`, { headers: { 'Accept-Encoding': acceptEncoding } })
      .then(response => {
        return {
          loading: false,
          candidates: response.data ? response.data : [],
          selectedCandidate: null,
          votes: [],
        }
      })
      .catch(errorResponse => {
        console.log(errorResponse.response)
        error({ statusCode: 404, message: 'Page not found' })
      })
  },
  watch: {
    selectedCandidate(value) {
      if (!value) {
        this.votes = []
        return
      }

      this.$nextTick(() => {
        this.getCandidateVotes(value)
      })
    },
  },
  methods: {
    getCandidateVotes(_id) {
      this.loading = true
      this.$axios.$get(`/candidates/${_id}`).then(response => {
        this.loading = false
        this.votes = response.data
      })
    },
  },
}
</script>

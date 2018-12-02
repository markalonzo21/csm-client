<template>
  <div class="container">
    <div class="row" v-if="!loading">
      <!-- <div class="col-md-6">
        <table>
          <thead>

          </thead>
        </table>
      </div>-->
      <div class="col-md-12 m-4">
        <div v-for="area in areas" :key="area._id">
          <h4>{{ area.name }}</h4>
          <h5>Managers:
            <ul class="list-reset">
              <li
                v-for="manager in area.managers"
                :key="manager._id"
              >{{ manager.firstName }} {{ manager.lastName }} ({{ manager.email }})</li>
            </ul>
          </h5>
          <area-map :area="area"></area-map>
          <hr>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AreaMap from '~/components/AreaMap'
export default {
  layout: 'command-center',
  components: {
    AreaMap: AreaMap
  },
  mounted() {
    this.$axios.$get('/areas').then(response => {
      this.areas = response.data
    })

    this.$nextTick(() => {
      this.assignInitialValue()
    })
  },
  data() {
    return {
      loading: true,
      areas: []
    }
  },
  methods: {
    assignInitialValue() {
      const lIsAvailable = setInterval(() => {
        if (L) {
          this.loading = false
        }
      }, 100)
    }
  }
}
</script>

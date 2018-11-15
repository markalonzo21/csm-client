<template>
  <section class="container mx-auto">
    <form @submit.prevent="report" class="p-4 m-4 flex flex-col ite ms-center justify-center">
      <input type="text" class="my-2 p-2" v-model="form.description" placeholder="Description">
      <select v-model="form.type" required class="py-2 my-2">
        <option>Fire Outbreak</option>
        <option>Road Accident</option>
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
  data() {
    return {
      form: {
        type: "Road Accident",
        description: "Please Help!",
        location: {
          type: "Point",
          coordinates: { lng: null, lat: null }
        }
      }
    };
  },
  mounted() {
    this.generateFakeData();
  },
  methods: {
    generateFakeData() {
      this.form.location.coordinates.lat = this.$chance.latitude({
        min: 14,
        max: 18
      });
      this.form.location.coordinates.lng = this.$chance.longitude({
        min: 120.5,
        max: 122
      });
    },
    report() {
      this.$axios.$post("/reports", this.form).then(response => {});
    }
  }
};
</script>

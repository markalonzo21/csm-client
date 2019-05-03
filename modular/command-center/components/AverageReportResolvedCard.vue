<template>
  <div class="panel">
    <div
      class="panel-body flex items-center justify-center"
      v-if="loading"
    >
      <a-icon
        spin
        style="font-size: 32px;"
        type="loading"
      />
    </div>
    <div
      class="panel-body"
      v-else
    >
      <h2
        class="title__white--large"
        v-text="labelValue"
      ></h2>
      <div class="w-full">
        <select
          class="relative text-black form-control mb-2"
          v-model="currentType"
        >
          <option :value="null">All</option>
          <option
            :key="type._id"
            :value="type._id"
            v-for="type in types"
          >{{ type.name }}</option>
        </select>
      </div>
      <div class="w-full uppercase">Resolved Duration Avg.</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    area: {
      type: String,
      default: null
    }
  },
  async mounted() {
    this.loading = true;
    const [averageTime, reportCategories] = await Promise.all([
      this.$axios.$get(`/api/v1/admin/reports-resolved-average`, {
        params: {
          areaName: this.area
        }
      }),
      this.$axios.$get("/api/v1/report-categories")
    ]);

    this.labelValue = averageTime.data;
    this.categories = reportCategories.data;
    this.loading = false;
  },
  data() {
    return {
      categories: [],
      loading: false,
      labelValue: "Loading...",
      label: "Fire",
      currentType: null
    };
  },
  computed: {
    types() {
      return this.categories.map(category => category.types).flat();
    }
  },
  watch: {
    currentType(value) {
      this.loading = true;
      this.$axios
        .$get(`/api/v1/admin/reports-resolved-average`, {
          params: {
            type: this.currentType,
            areaName: this.area
          }
        })
        .then(response => {
          setTimeout(() => {
            this.labelValue = response.data;
            this.loading = false;
          }, 200); // timeout is used for loading not to appear buggy.
        })
        .catch(error => {
          setTimeout(() => {
            this.loading = true;
          }, 200);
        });
    }
  }
};
</script>

<style scoped>
.panel-body {
  background-image: linear-gradient(to right, #354fa3, #34c3e5);
  color: white;
  border-radius: 0.5rem;
  height: 14rem;
}
.invert-gradient {
  background-image: linear-gradient(to right, #34c3e5, #354fa3) !important;
}
.panel-footer {
  border: none;
  background-image: inherit;
  font-weight: bold;
}
</style>

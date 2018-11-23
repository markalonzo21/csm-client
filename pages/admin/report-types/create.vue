<template>
  <section class="container mx-auto max-w-md">
    <form @submit.prevent="report" class="p-4 m-4 flex flex-col ite ms-center justify-center">
      <input type="text" class="my-2 p-2 border" v-model="form.name" placeholder="Name">
      <input
        type="text"
        class="my-2 p-2 border"
        v-model="form.description"
        placeholder="Description"
      >
      <div
        class="m-y2 p-2"
        v-for="milestone in form.milestones"
        :key="milestone._id"
        v-text="milestone.name"
      ></div>
      <button type="submit" class="p-2 my-2 border bg-black text-white rounded font-hairline">CREATE</button>
    </form>
  </section>
</template>

<script>
export default {
  asyncData({ $axios, error }) {
    return $axios.$get("/report-types").then(response => {
      return {
        milestones: [],
        form: {
          name: "",
          description: "",
          milestones: []
        }
      };
    });
  },
  methods: {
    selectMilestone(milestone) {
      this.form.milestones.push(milestone);
    },
    removeMilestone(index) {
      this.form.milestones.splice(index, 1);
    }
  }
};
</script>

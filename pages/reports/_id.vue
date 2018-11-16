<template>
  <div class="container mx-auto py-4">
    <div class="flex mb-4" v-if="report">
      <div class="w-1/2 flex flex-col items-start justify-center p-2">
        <h3 class="mb-1">Respondent: respondent1@gmail.com</h3>
        <h3 class="my-2">Milestones</h3>
        <div
          class="my-2"
          v-for="(milestone, index) in report.reportType.milestones"
          :key="milestone._id"
        >{{ index + 1}}. {{ milestone.name }} {{ milestoneIsCompleted(milestone._id) ? '- Done' : '' }}</div>
      </div>
      <div class="w-1/2 flex flex-col items-start justify-start border p-2">
        <h3>Chatbox</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  asyncData({ $axios, params, isServer }) {
    return $axios.$get(`/reports/${params.id}`).then(response => {
      return {
        report: response.data,
      }
    })
  },
  methods: {
    milestoneIsCompleted(id) {
      return this.report.responses.includes(id)
    },
  },
}
</script>

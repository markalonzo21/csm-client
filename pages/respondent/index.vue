<template>
  <div class="container py-4">
  <div class="active-report">
    <h3>Active Report</h3>

  </div>

</div>

</template>

<script>
export default {
  layout: 'respondent',
  middleware: 'isRespondent',
  asyncData({ $axios, store, params, error }) {
    return $axios.$get(`/respondent/active-report`).then(response => {
      return {
        activeReport: response.data,
      }
    })
  },
}
</script>

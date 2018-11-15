<template>
  <div class="container mx-auto py-4">
    <div class="flex mb-4">
      <div class="w-1/2 flex flex-col items-start justify-center p-2">
        <h3 class="mb-1">Respondent: respondent1@gmail.com</h3>
        <h3 class="my-2">Actions</h3>
        <div class="my-2">Help is on the way.</div>
        <div class="my-2">Requesting Backup</div>
        <div class="my-2">Resolved!</div>
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
    // return $axios.$get(`/reports/${params.id}`).then(response => {
    //   return {
    //     report: response.data
    //   }
    // })
    return {
      id: params.id,
      isServer: isServer
    };
  }
};
</script>

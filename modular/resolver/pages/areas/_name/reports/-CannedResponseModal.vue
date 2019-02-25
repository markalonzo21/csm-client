<template>
  <a-modal
    :width="800"
    @cancel="closeModal"
    title="Canned Responses"
    v-model="isOpen"
  >
    <table class="table-bordered table">
      <tbody v-if="cannedResponses.length > 0">
        <tr
          :key="response._id"
          v-for="response in cannedResponses"
        >
          <td style="white-space: pre; max-width: 400px; overflow: scroll;">{{ response.content }}</td>
          <td class="text-center">
            <a-button
              @click.prevent="selectResponse(response.content)"
              type="primary"
            >Select</a-button>
          </td>
        </tr>
      </tbody>
      <div v-else>No Canned Responses</div>
    </table>
  </a-modal>
</template>

<script>
export default {
  props: {
    showCannedResponses: {
      type: Boolean,
      required: true
    },
    cannedResponses: {
      type: Array,
      required: true
    },
    loadingCannedResponses: {
      type: Boolean
    }
  },
  data() {
    return {
      isOpen: this.showCannedResponses
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
    selectResponse(content) {
      this.$emit("responseSelected", content);
    }
  }
};
</script>

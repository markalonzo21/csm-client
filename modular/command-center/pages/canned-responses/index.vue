<template>
  <section
    class="w-full select-none"
    style="width: 100%"
  >
    <div class="clearfix">
      <h3 class="float-left">Canned Responses</h3>
      <a-button
        @click.prevent="$router.push('/command-center/canned-responses/create')"
        class="float-right my-6"
        type="primary"
      >Create Canned Response</a-button>
    </div>
    <hr>

    <!-- TABLE -->
    <a-table
      :columns="columns"
      :dataSource="cannedResponses"
      :loading="loadingGetCannedResponses"
      :rowKey="record => record._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="content"
        slot-scope="text, cannedResponse, index"
      >
        <div style="white-space: pre;">{{ text }}</div>
      </template>
      <template
        slot="actions"
        slot-scope="text, cannedResponse, index"
      >
        <a-button
          @click.prevent="$router.push(`/command-center/canned-responses/${cannedResponse._id}/edit`)"
          type="primary"
        >Edit</a-button>
        <a-popconfirm
          @confirm="deleteCannedResponse(cannedResponse, index)"
          cancelText="No"
          okText="Yes"
          title="Are you sure delete this canned response?"
        >
          <a-button type="danger">Delete</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </section>
</template>


<script>
export default {
  layout: "command-center/default",
  data() {
    return {
      loadingGetCannedResponses: false,
      cannedResponses: [],
      columns: [
        {
          title: "Content",
          dataIndex: "content",
          scopedSlots: { customRender: "content" }
        },
        {
          title: "Actions",
          dataIndex: "actions",
          scopedSlots: { customRender: "actions" }
        }
      ]
    };
  },
  mounted() {
    if (!this.$store.getters["auth/hasPermission"]("view canned responses")) {
      return redirect("/");
    }
    this.getCannedResponses();
  },
  methods: {
    getCannedResponses() {
      this.loadingGetCannedResponses = true;
      this.$axios.$get("/admin/canned-responses").then(response => {
        this.cannedResponses = response.data;
        this.loadingGetCannedResponses = false;
      });
    },

    deleteCannedResponse(cannedResponse, index) {
      if (
        !this.$store.getters["auth/hasPermission"]("delete canned response")
      ) {
        this.$message.error(
          "You don't have the permission to delete a canned response."
        );
        return;
      }

      this.$axios
        .$delete(`/admin/canned-responses/${cannedResponse._id}`)
        .then(response => {
          this.cannedResponses.splice(index, 1);
        });
    }
  }
};
</script>

<style scoped>
td {
  padding-right: 20px;
  padding-left: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>

<template>
  <section class="w-full select-none" style="width: 100%">
    <modal v-model="isCreateResponseTypeModalVisible" title="Create Response Type" :footer="false">
      <form @submit.prevent="createResponseType" class="clearfix">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Name" v-model="form.name" required>
        </div>
        <!-- <div class="form-group">
          <textarea
            cols="30" rows="10"
            class="form-control"
            placeholder="Description"
            v-model="form.description"
          ></textarea>
        </div>-->
        <button
          class="btn btn-primary float-right"
          :disabled="loadingCreateResponseType"
        >{{ loadingCreateResponseType ? 'Loading' : 'Save' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Response Types</h3>
      <a-button
        type="primary"
        class="float-right my-6"
        @click.prevent="isCreateResponseTypeModalVisible = true"
      >Create Response Type</a-button>
    </div>
    <hr>
    <a-table bordered :dataSource="responseTypes" :columns="columns">
      <template slot="operation" slot-scope="text, record">
        <a-button type="primary" disabled>Edit</a-button>
        <a-button type="danger" disabled>Delete</a-button>
      </template>
    </a-table>
    <!-- <table class="table-bordered w-full">
      <thead>
        <tr>
          <td>Name</td>
          <td>Description</td>
          <td>Created At</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="responseType in responseTypes">
          <td>{{ responseType.name }}</td>
          <td>{{ responseType.description }}</td>
          <td>{{ responseType.createdAt }}</td>
          <td>
            <button class="m-2 btn btn-info" disabled>Edit</button>
            <button class="m-2 btn btn-danger" disabled>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>-->
  </section>
</template>


<script>
export default {
  layout: "command-center",
  asyncData({ store, redirect }) {
    if (!store.getters["auth/hasPermission"]("view response types")) {
 return redirect("/");
    }
  },
  data() {
    return {
      isCreateResponseTypeModalVisible: false,
      loadingCreateResponseType: false,
      responseTypes: [],
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          width: "80%",
          scopedSlots: { customRender: "name" }
        },
        {
          title: "Operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      form: {
        name: "",
        description: ""
      }
    };
  },
  mounted() {
    this.getResponseTypes();
    this.generateFakeData();
  },
  methods: {
    generateFakeData() {
      this.form.name = this.$chance.word();
      this.form.description = this.$chance.paragraph();
    },
    getResponseTypes() {
      this.$axios.$get("/response-types").then(response => {
        this.responseTypes = response.data;
      });
    },
    createResponseType() {
      this.loadingCreateResponseType = true;
      this.$axios.$post("/response-types", this.form).then(response => {
        this.generateFakeData();
        this.responseTypes.push(response.data);
        this.loadingCreateResponseType = false;
        this.isCreateResponseTypeModalVisible = false;
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

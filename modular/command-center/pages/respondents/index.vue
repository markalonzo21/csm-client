<template>
  <section
    class="w-full select-none"
    style="width: 100%"
  >
    <modal
      :footer="false"
      title="Create Responder"
      v-model="isCreateResponderModalVisible"
    >
      <form
        @submit.prevent="createResponder"
        class="clearfix"
      >
        <div class="form-group">
          <input
            class="form-control"
            placeholder="first name"
            required
            type="text"
            v-model="form.firstName"
          >
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="middle name"
            type="text"
            v-model="form.middleName"
          >
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="last name"
            required
            type="text"
            v-model="form.lastName"
          >
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="email"
            required
            type="email"
            v-model="form.email"
          >
        </div>
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-addon">+63</span>
            <input
              class="form-control"
              maxlength="10"
              pattern="\d*"
              placeholder="mobile"
              required
              type="text"
              v-model="form.mobile"
            >
          </div>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="password"
            required
            type="password"
            v-model="form.password"
          >
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="password confirmation"
            required
            type="password"
            v-model="form.password_confirmation"
          >
        </div>
        <div class="form-group text-center">
          <label for>Actionable Report Type</label>
          <div v-for="category in reportCategories">
            <h5
              class="font-bold"
              v-if="category.types.length > 0"
            >{{ category.name }}</h5>
            <div
              class="checkbox"
              v-for="type in category.types"
            >
              <label>
                <input
                  :value="type._id"
                  type="checkbox"
                  v-model="form.types"
                >
                {{ type.name }}
              </label>
            </div>
          </div>
        </div>
        <button
          :disabled="loadingCreateUser"
          class="btn btn-primary float-right"
        >{{ loadingCreateUser ? 'Loading' : 'Save' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Responders</h3>
      <a-button
        @click.prevent="isCreateResponderModalVisible = true"
        class="float-right my-6"
        type="primary"
      >Create Responder</a-button>
    </div>
    <hr>
    <a-table
      :columns="columns"
      :dataSource="responders"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="canRespondTo"
        slot-scope="text, record"
      >
        <ul class="list-reset">
          <li
            :key="`respond-${index}`"
            v-for="(item, index) in record.canRespondTo"
          >{{ index + 1 }}. {{ item.name }}</li>
        </ul>
      </template>
      <template
        slot="createdAt"
        slot-scope="text, responder"
      >{{ responder.createdAt ? $moment(responder.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template
        slot="actions"
        slot-scope="text, record"
      >
        <a-button
          disabled
          type="primary"
        >Edit</a-button>
        <a-button
          disabled
          type="danger"
        >Delete</a-button>
      </template>
    </a-table>
    <!-- <table class="table-bordered :scroll="{ x: 900 }" w-full">
      <thead>
        <tr>
          <td>First Name</td>
          <td>Middle Name</td>
          <td>Last Name</td>
          <td>Email</td>
          <td>Mobile</td>
          <td>Can Respond To</td>
          <td>Created At</td>
          <td>Actions</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="responder in responders">
          <td>{{ responder.firstName }}</td>
          <td>{{ responder.middleName }}</td>
          <td>{{ responder.lastName }}</td>
          <td>{{ responder.email }}</td>
          <td>{{ responder.mobile }}</td>
          <td>
            <ul class="list-reset">
              <li v-for="item in responder.canRespondTo">{{ item.name }}</li>
            </ul>
          </td>
          <td>{{ responder.createdAt }}</td>
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
  layout: "command-center/default",
  data() {
    return {
      isCreateResponderModalVisible: false,
      loadingGetResponders: false,
      responders: [],
      reportCategories: [],
      loadingCreateUser: false,
      columns: [
        {
          title: "First Name",
          dataIndex: "firstName"
        },
        // {
        //   title: 'Middle Name',
        //   dataIndex: 'middleName'
        // },
        {
          title: "Last Name",
          dataIndex: "lastName"
        },
        {
          title: "Email",
          dataIndex: "email"
        },
        {
          title: "Mobile",
          dataIndex: "mobile"
        },
        {
          title: "Can Respond To",
          dataIndex: "canRespondTo",
          scopedSlots: { customRender: "canRespondTo" }
        },
        {
          title: "Created At",
          dataIndex: "createdAt",
          scopedSlots: { customRender: "createdAt" }
        },
        {
          title: "Actions",
          dataIndex: "actions",
          scopedSlots: { customRender: "actions" }
        }
      ],
      form: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobile: "",
        types: []
      }
    };
  },
  mounted() {
    this.getReportTypes();
    this.getResponders();
    this.generateFakeData();
  },
  methods: {
    generateFakeData() {
      this.form.firstName = this.$chance.first();
      this.form.lastName = this.$chance.last();
      this.form.email = this.$chance.email();
      this.form.mobile = `92${new Date()
        .getTime()
        .toString()
        .substr(5)}`;
      this.form.password = "123123123";
      this.form.password_confirmation = "123123123";
      this.form.types = [];
    },
    getReportTypes() {
      this.$axios.$get("/api/v1/report-categories").then(response => {
        this.reportCategories = response.data;
      });
    },
    getResponders() {
      this.loadingGetResponders = true;
      this.$axios.$get("/api/v1/admin/responders").then(response => {
        this.responders = response.data;
        this.loadingGetResponders = false;
      });
    },
    createResponder() {
      this.loadingCreateUser = true;
      this.$axios
        .$post("/api/v1/admin/responders", this.form)
        .then(response => {
          this.generateFakeData();
          this.responders.push(response.data);
          this.loadingCreateUser = false;
          this.isCreateResponderModalVisible = false;
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

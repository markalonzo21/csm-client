<template>
  <section class="w-full select-none" style="width: 100%">
    <modal v-model="isCreateResponderModalVisible" title="Create Responder" :footer="false">
      <form @submit.prevent="createResponder" class="clearfix">
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="first name"
            v-model="form.firstName"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="middle name"
            v-model="form.middleName"
          >
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="last name"
            v-model="form.lastName"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="email"
            class="form-control"
            placeholder="email"
            v-model="form.email"
            required
          >
        </div>
        <div class="form-group">
          <div class="input-group">
            <span class="input-group-addon">+63</span>
            <input
              type="text"
              class="form-control"
              pattern="\d*"
              maxlength="10"
              placeholder="mobile"
              v-model="form.mobile"
              required
            >
          </div>
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="password"
            v-model="form.password"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="password confirmation"
            v-model="form.password_confirmation"
            required
          >
        </div>
        <div class="form-group text-center">
          <label for>Actionable Report Type</label>
          <div v-for="reportCategory in reportCategories">
            <h5
              class="font-bold"
              v-if="reportCategory.reportTypes.length > 0"
            >{{ reportCategory.name }}</h5>
            <div class="checkbox" v-for="reportType in reportCategory.reportTypes">
              <label>
                <input type="checkbox" v-model="form.reportTypes" :value="reportType._id">
                {{ reportType.name }}
              </label>
            </div>
          </div>
        </div>
        <button
          class="btn btn-primary float-right"
          :disabled="loadingCreateUser"
        >{{ loadingCreateUser ? 'Loading' : 'Save' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Responders</h3>
      <a-button
        type="primary"
        class="float-right my-6"
        @click.prevent="isCreateResponderModalVisible = true"
      >Create Responder</a-button>
    </div>
    <hr>
    <a-table bordered :dataSource="responders" :columns="columns">
      <template slot="canRespondTo" slot-scope="text, record">
        <ul class="list-reset">
          <li
            v-for="(item, index) in record.canRespondTo"
            :key="`respond-${index}`"
          >{{ index + 1 }}. {{ item.name }}</li>
        </ul>
      </template>
      <template
        slot="createdAt"
        slot-scope="text, responder"
      >{{ responder.createdAt ? $moment(responder.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template slot="operation" slot-scope="text, record">
        <a-button type="primary" disabled>Edit</a-button>
        <a-button type="danger" disabled>Delete</a-button>
      </template>
    </a-table>
    <!-- <table class="table-bordered w-full">
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
  layout: "command-center",
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
          title: "Operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      form: {
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobile: "",
        reportTypes: []
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
      this.form.reportTypes = [];
    },
    getReportTypes() {
      this.$axios.$get("/report-categories").then(response => {
        this.reportCategories = response.data;
      });
    },
    getResponders() {
      this.loadingGetResponders = true;
      this.$axios.$get("/admin/responders").then(response => {
        this.responders = response.data;
        this.loadingGetResponders = false;
      });
    },
    createResponder() {
      this.loadingCreateUser = true;
      this.form.mobile = `0${this.form.mobile}`;
      this.$axios.$post("/admin/responders", this.form).then(response => {
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

<template>
  <section class="w-full select-none" style="width: 100%">
    <!-- CREATE USER -->
    <modal v-model="isCreateUserModalVisible" title="Create User" :footer="false">
      <form @submit.prevent="createUser" class="clearfix">
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
        <div class="form-group">
          <select v-model="form.role" class="form-control">
            <option v-for="role in roles" :key="role._id" :value="role.slug">{{ role.name }}</option>
          </select>
        </div>
        <div class="form-group text-center" v-if="selectedRoleCanRespond">
          <label for>Actionable Report Type</label>
          <div v-for="category in reportCategories">
            <h5
              class="font-bold"
              v-if="category.types.length > 0"
            >{{ category.name }}</h5>
            <div class="checkbox" v-for="type in category.types">
              <label>
                <input type="checkbox" v-model="form.types" :value="type._id">
                {{ type.name }}
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
    <!-- EDIT USER -->
    <modal v-model="isEditModalVisible" title="Edit User" :footer="false">
      <form @submit.prevent="updateUser" class="clearfix">
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="first name"
            v-model="editForm.firstName"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="middle name"
            v-model="editForm.middleName"
          >
        </div>
        <div class="form-group">
          <input
            type="text"
            class="form-control"
            placeholder="last name"
            v-model="editForm.lastName"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="email"
            class="form-control"
            placeholder="email"
            v-model="editForm.email"
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
              v-model="editForm.mobile"
              required
            >
          </div>
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="password"
            v-model="editForm.password"
            required
          >
        </div>
        <div class="form-group">
          <input
            type="password"
            class="form-control"
            placeholder="password confirmation"
            v-model="editForm.password_confirmation"
            required
          >
        </div>
        <div class="form-group">
          <select v-model="editForm.role" class="form-control">
            <option v-for="role in roles" :key="role._id" :value="role.slug">{{ role.name }}</option>
          </select>
        </div>
        <div class="form-group text-center" v-if="editSelectedRoleCanRespond">
          <label for>Actionable Report Type</label>
          <div v-for="category in reportCategories">
            <h5
              class="font-bold"
              v-if="category.types.length > 0"
            >{{ category.name }}</h5>
            <div class="checkbox" v-for="type in category.types">
              <label>
                <input type="checkbox" v-model="editForm.types" :value="type._id">
                {{ type.name }}
              </label>
            </div>
          </div>
        </div>
        <button
          class="btn btn-primary float-right"
          :disabled="loadingUpdateUser"
        >{{ loadingUpdateUser ? 'Loading' : 'Update' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Users</h3>
      <a-button
        type="primary"
        class="float-right my-6"
        @click.prevent="isCreateUserModalVisible = true"
      >Create User</a-button>
    </div>
    <hr>

    <!-- TABLE -->
    <a-table :loading="loadingGetUsers" bordered :dataSource="users" :columns="columns">
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
        slot-scope="text, user"
      >{{ user.createdAt ? $moment(user.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template slot="operation" slot-scope="text, user, index">
        <a-button type="primary" @click.prevent="showEditModal(user, index)">Edit</a-button>
        <a-popconfirm title="Are you sure delete this user?" @confirm="deleteUser(user)" okText="Yes" cancelText="No">
          <a-button type="danger">Delete</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </section>
</template>


<script>
export default {
  layout: "command-center",
  data() {
    return {
      isCreateUserModalVisible: false,
      isEditModalVisible: false,
      loadingGetUsers: false,
      loadingGetRoles: false,
      loadingGetReportTypes: false,
      loadingUpdateUser: false,
      users: [],
      roles: [],
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
          title: "Role",
          dataIndex: "role.name"
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
        role: 'user',
        types: []
      },
      editForm: {
        id: null,
        index: null,
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobile: "",
        role: 'user',
        types: []
      }
    };
  },
  mounted() {
    this.getReportTypes();
    this.getUsers();
    this.getRoles();
    this.generateFakeData();
  },
  computed: {
    selectedRole() {
      return this.roles.find(role => role.slug === this.form.role)
    },
    selectedRoleCanRespond() {
      if (this.selectedRole) {
        return this.selectedRole.permissions.find(permission => permission.name === 'respond')
      }

      return false
    },
    editSelectedRole() {
      return this.roles.find(role => role.slug === this.editForm.role)
    },
    editSelectedRoleCanRespond() {
      if (this.editSelectedRole) {
        return this.editSelectedRole.permissions.find(permission => permission.name === 'respond')
      }

      return false
    },
  },
  methods: {
    showEditModal(user, index) {
      this.isEditModalVisible = true;
      this.editForm.index = index
      this.editForm.id = user._id
      this.editForm.firstName = user.firstName;
      this.editForm.lastName = user.lastName;
      this.editForm.email = user.email;
      this.editForm.mobile = user.mobile;
      this.editForm.role = user.role.slug;
      this.editForm.password = "123123123";
      this.editForm.password_confirmation = "123123123";
      this.editForm.types = user.canRespondTo.map(type => type._id);
    },
    generateFakeData() {
      this.form.firstName = this.$chance.first();
      this.form.lastName = this.$chance.last();
      this.form.email = this.$chance.email();
      this.form.mobile = `92${new Date()
        .getTime()
        .toString()
        .substr(5)}`;
      this.form.role = 'user'
      this.form.password = "123123123";
      this.form.password_confirmation = "123123123";
      this.form.types = [];
    },
    getReportTypes() {
      this.loadingGetReportTypes = true;
      this.$axios.$get("/report-categories").then(response => {
        this.reportCategories = response.data;
        this.loadingGetReportTypes = false;
      });
    },
    getRoles() {
      this.loadingGetRoles = true;
      this.$axios.$get("/admin/roles").then(response => {
        this.roles = response.data;
        this.loadingGetRoles = false;
      });
    },
    getUsers() {
      this.loadingGetUsers = true;
      this.$axios.$get("/admin/users").then(response => {
        this.users = response.data;
        this.loadingGetUsers = false;
      });
    },
    updateUser() {
      if (! this.$store.getters['auth/hasPermission']('update user')) {
        this.isEditModalVisible = false
        this.$message.error('You don\'t have the permission to update a user.')
        return
      }

      this.loadingUpdateUser = true;

      this.editForm.mobile = `0${this.editForm.mobile}`;
      if (!this.editSelectedRoleCanRespond) {
        this.types = []
      }
      this.editForm.role = this.editSelectedRole._id

      this.$axios.$patch(`/admin/users/${this.editForm.id}`, this.editForm).then(response => {
        this.users[this.editForm.index] = response.data
        this.editForm.index = null
        this.editForm.id = null
        this.generateFakeData()
        this.loadingUpdateUser = false;
        this.isEditModalVisible = false;
      });
    },
    createUser() {
      this.loadingCreateUser = true;
      this.form.mobile = `0${this.form.mobile}`;
      if (!this.selectedRoleCanRespond) {
        this.types = []
      }
      this.form.role = this.selectedRole._id
      this.$axios.$post("/admin/users", this.form).then(response => {
        this.generateFakeData();
        this.users.push(response.data);
        this.loadingCreateUser = false;
        this.isCreateUserModalVisible = false;
      });
    },
    deleteUser(user, index) {
      if (! this.$store.getters['auth/hasPermission']('delete user')) {
        this.$message.error('You don\'t have the permission to delete a user.')
        return
      }

      if (['admin', 'super-admin'].includes(user.role.slug)) {
        this.$message.error('This user can\'t be deleted')
        return
      }

      this.$axios.$delete(`/admin/users/${user._id}`).then(response => {
        this.users.splice(index, 1)
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

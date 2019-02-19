<template>
  <section
    class="w-full select-none"
    style="width: 100%"
  >
    <!-- CREATE USER -->
    <modal
      :footer="false"
      title="Create User"
      v-model="isCreateUserModalVisible"
    >
      <form
        @submit.prevent="createUser"
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
        <div class="form-group">
          <select
            class="form-control"
            v-model="form.role"
          >
            <option
              :key="role._id"
              :value="role.slug"
              v-for="role in roles"
            >{{ role.name }}</option>
          </select>
        </div>
        <div
          class="form-group text-center"
          v-if="selectedRoleNeedsArea"
        >
          <label for>Assign Areas</label>
          <div
            :key="area._id"
            class="checkbox"
            v-for="area in areas"
          >
            <label>
              <input
                :value="area._id"
                type="checkbox"
                v-model="form.areas"
              >
              {{ area.name }}
            </label>
          </div>
        </div>
        <div
          class="form-group text-center"
          v-if="selectedRoleCanRespond"
        >
          <label for>Assign Actionable Report Types</label>
          <div
            :key="category._id"
            v-for="category in reportCategories"
          >
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
    <!-- EDIT USER -->
    <modal
      :footer="false"
      title="Edit User"
      v-model="isEditModalVisible"
    >
      <form
        @submit.prevent="updateUser"
        class="clearfix"
      >
        <div class="form-group">
          <input
            class="form-control"
            placeholder="first name"
            required
            type="text"
            v-model="editForm.firstName"
          >
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="middle name"
            type="text"
            v-model="editForm.middleName"
          >
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="last name"
            required
            type="text"
            v-model="editForm.lastName"
          >
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="email"
            required
            type="email"
            v-model="editForm.email"
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
              v-model="editForm.mobile"
            >
          </div>
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="password"
            required
            type="password"
            v-model="editForm.password"
          >
        </div>
        <div class="form-group">
          <input
            class="form-control"
            placeholder="password confirmation"
            required
            type="password"
            v-model="editForm.password_confirmation"
          >
        </div>
        <div class="form-group">
          <select
            class="form-control"
            v-model="editForm.role"
          >
            <option
              :key="role._id"
              :value="role.slug"
              v-for="role in roles"
            >{{ role.name }}</option>
          </select>
        </div>
        <div
          class="form-group text-center"
          v-if="editSelectedRoleNeedsArea"
        >
          <label for>Assign Areas</label>
          <div
            :key="area._id"
            class="checkbox"
            v-for="area in areas"
          >
            <label>
              <input
                :value="area._id"
                type="checkbox"
                v-model="editForm.areas"
              >
              {{ area.name }}
            </label>
          </div>
        </div>
        <div
          class="form-group text-center"
          v-if="editSelectedRoleCanRespond"
        >
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
                  v-model="editForm.types"
                >
                {{ type.name }}
              </label>
            </div>
          </div>
        </div>
        <button
          :disabled="loadingUpdateUser"
          class="btn btn-primary float-right"
        >{{ loadingUpdateUser ? 'Loading' : 'Update' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Users</h3>
      <a-button
        @click.prevent="isCreateUserModalVisible = true"
        class="float-right my-6"
        type="primary"
      >Create User</a-button>
    </div>
    <hr>

    <!-- TABLE -->
    <a-table
      :columns="columns"
      :dataSource="users"
      :loading="loadingGetUsers"
      :rowKey="record => record._id"
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
        slot-scope="text, user"
      >{{ user.createdAt ? $moment(user.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template
        slot="actions"
        slot-scope="text, user, index"
      >
        <a-button
          @click.prevent="showEditModal(user, index)"
          type="primary"
        >Edit</a-button>
        <a-popconfirm
          @confirm="deleteUser(user)"
          cancelText="No"
          okText="Yes"
          title="Are you sure delete this user?"
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
      isCreateUserModalVisible: false,
      isEditModalVisible: false,
      loadingGetUsers: false,
      loadingGetRoles: false,
      loadingGetAreas: false,
      loadingGetReportTypes: false,
      loadingUpdateUser: false,
      users: [],
      roles: [],
      areas: [],
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
        role: "user",
        types: [],
        areas: []
      },
      editForm: {
        id: null,
        index: null,
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        mobile: "",
        role: "user",
        types: [],
        areas: []
      }
    };
  },
  mounted() {
    this.getReportTypes();
    this.getUsers();
    this.getRoles();
    this.getAreas();
    this.generateFakeData();
  },
  computed: {
    selectedRole() {
      return this.roles.find(role => role.slug === this.form.role);
    },
    selectedRoleNeedsArea() {
      if (!this.selectedRole) return false;
      return this.selectedRole.slug !== "user";
    },
    selectedRoleCanRespond() {
      if (!this.selectedRole) return false;

      return this.selectedRole.permissions.find(
        permission => permission.name === "respond"
      );
    },
    editSelectedRole() {
      return this.roles.find(role => role.slug === this.editForm.role);
    },
    editSelectedRoleCanRespond() {
      if (!this.editSelectedRole) return false;
      return this.editSelectedRole.permissions.find(
        permission => permission.name === "respond"
      );
    },
    editSelectedRoleNeedsArea() {
      if (!this.editSelectedRole) return false;
      return this.editSelectedRole.slug !== "user";
    }
  },
  methods: {
    showEditModal(user, index) {
      console.log(user);
      this.isEditModalVisible = true;
      this.editForm.index = index;
      this.editForm.id = user._id;
      this.editForm.firstName = user.firstName;
      this.editForm.lastName = user.lastName;
      this.editForm.email = user.email;
      this.editForm.mobile = user.mobile;
      this.editForm.role = user.role.slug;
      this.editForm.areas = user.areas ? user.areas : [];
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
      this.form.role = "user";
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
    getAreas() {
      this.loadingGetAreas = true;
      this.$axios.$get("/admin/areas").then(response => {
        this.areas = response.data;
        this.loadingGetAreas = false;
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
      if (!this.$store.getters["auth/hasPermission"]("update user")) {
        this.isEditModalVisible = false;
        this.$message.error("You don't have the permission to update a user.");
        return;
      }

      this.loadingUpdateUser = true;

      this.editForm.mobile = `0${this.editForm.mobile}`;
      if (!this.editSelectedRoleCanRespond) {
        this.types = [];
      }
      this.editForm.role = this.editSelectedRole._id;

      this.$axios
        .$patch(`/admin/users/${this.editForm.id}`, this.editForm)
        .then(response => {
          this.users[this.editForm.index] = response.data;
          this.editForm.index = null;
          this.editForm.id = null;
          this.loadingUpdateUser = false;
          this.isEditModalVisible = false;
        });
    },
    createUser() {
      if (!this.$store.getters["auth/hasPermission"]("create user")) {
        this.isCreateUserModalVisible = false;
        this.$message.error("You don't have the permission to create a user.");
        return;
      }

      this.loadingCreateUser = true;
      this.form.mobile = `0${this.form.mobile}`;
      if (!this.selectedRoleCanRespond) {
        this.types = [];
      }
      this.form.role = this.selectedRole._id;
      this.$axios.$post("/admin/users", this.form).then(response => {
        this.generateFakeData();
        this.loadingCreateUser = false;
        this.isCreateUserModalVisible = false;

        this.$nextTick(() => {
          this.users.push(response.data);
        });
      });
    },
    resetFormData() {
      this.form.firstName = "";
      this.form.lastName = "";
      this.form.email = "";
      this.form.mobile = "";
      this.form.role = "user";
      this.form.password = "";
      this.form.password_confirmation = "";
      this.form.types = [];
    },
    deleteUser(user, index) {
      if (!this.$store.getters["auth/hasPermission"]("delete user")) {
        this.$message.error("You don't have the permission to delete a user.");
        return;
      }

      if (["admin", "super-admin"].includes(user.role.slug)) {
        this.$message.error("This user can't be deleted");
        return;
      }

      this.$axios.$delete(`/admin/users/${user._id}`).then(response => {
        this.users.splice(index, 1);
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

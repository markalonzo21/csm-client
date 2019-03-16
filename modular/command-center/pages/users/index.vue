<template>
  <section
    class="w-full select-none"
    style="width: 100%"
  >
    <div class="clearfix">
      <h3 class="float-left">Users</h3>
      <a-button
        @click.prevent="$router.push('/command-center/users/create')"
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
          @click.prevent="$router.push(`/command-center/users/${user._id}/edit`)"
          type="primary"
        >Edit</a-button>
        <a-popconfirm
          @confirm="deleteUser(user, index)"
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
      loadingGetUsers: false,
      users: [],
      columns: [
        {
          title: "First Name",
          dataIndex: "firstName"
        },
        {
          title: "Middle Name",
          dataIndex: "middleName"
        },
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
          fixed: "right",
          scopedSlots: { customRender: "actions" }
        }
      ]
    };
  },
  mounted() {
    if (!this.$store.getters["auth/hasPermission"]("view users")) {
      return redirect("/");
    }
    this.getReportTypes();
    this.getUsers();
    this.getRoles();
    this.getAreas();
  },
  methods: {
    getReportTypes() {
      this.loadingGetReportTypes = true;
      this.$axios.$get("/api/v1/report-categories").then(response => {
        this.categories = response.data;
        this.loadingGetReportTypes = false;
      });
    },
    getRoles() {
      this.loadingGetRoles = true;
      this.$axios.$get("/api/v1/admin/roles").then(response => {
        this.roles = response.data;
        this.loadingGetRoles = false;
      });
    },
    getAreas() {
      this.loadingGetAreas = true;
      this.$axios.$get("/api/v1/admin/areas").then(response => {
        this.areas = response.data;
        this.loadingGetAreas = false;
      });
    },
    getUsers() {
      this.loadingGetUsers = true;
      this.$axios.$get("/api/v1/admin/users").then(response => {
        this.users = response.data;
        this.loadingGetUsers = false;
      });
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

      this.$axios
        .$delete(`/api/v1/admin/users/${user._id}`)
        .then(response => {
          this.users.splice(index, 1);
        })
        .catch(error => {
          if (error.response.status === 403) {
            this.$message.error(error.response.data.message);
            return;
          }
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

<template>
  <section
    class="w-full select-none"
    style="width: 100%"
  >
    <div class="clearfix">
      <h3 class="float-left">Roles</h3>
      <a-button
        @click.prevent="$router.push('/command-center/roles/create')"
        class="float-right my-6"
        type="primary"
      >Create Role</a-button>
    </div>
    <hr>

    <!-- TABLE -->
    <a-table
      :columns="columns"
      :dataSource="roles"
      :loading="loadingGetRoles"
      :rowKey="role => role._id"
      :scroll="{ x: 900 }"
      bordered
    >
      <template
        slot="createdAt"
        slot-scope="text, role"
      >{{ role.createdAt ? $moment(role.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template
        slot="actions"
        slot-scope="text, role, index"
      >
        <div v-if="!role.canDelete">Unactionable</div>
        <div v-else>
          <a-button
            :disabled="!role.canDelete"
            @click.prevent="$router.push(`/command-center/roles/${role._id}/edit`)"
            type="primary"
          >Edit</a-button>
          <a-popconfirm
            @confirm="deleteRole(role, index)"
            cancelText="No"
            okText="Yes"
            title="Are you sure delete this role?"
          >
            <a-button type="danger">Delete</a-button>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
  </section>
</template>


<script>
export default {
  layout: "command-center/default",
  data() {
    return {
      loadingGetRoles: false,
      permissions: [],
      roles: [],
      loadingCreateRole: false,
      loadingUpdateRole: false,
      columns: [
        {
          title: "Name",
          dataIndex: "name",
          width: "80%"
        },
        // {
        //   title: "Description",
        //   dataIndex: "description"
        // },
        {
          title: "Actions",
          dataIndex: "actions",
          scopedSlots: { customRender: "actions" }
        }
      ],
      isEditModalVisible: false,
      editForm: {
        id: null,
        index: null,
        name: "",
        description: "",
        permissions: []
      }
    };
  },
  computed: {
    categories() {
      return this.permissions
        .map(permission => permission.category)
        .filter((v, i, a) => a.indexOf(v) === i);
    }
  },
  watch: {
    isEditModalVisible(value) {
      if (!value) {
        this.editForm.id = null;
        this.editForm.index = null;
        this.editForm.name = "";
        this.editForm.description = "";
        this.editForm.permissions = [];
      }
    }
  },
  mounted() {
    this.getPermissions();
    this.getRoles();
  },
  methods: {
    showEditModal(role, index) {
      this.isEditModalVisible = true;
      this.editForm.index = index;
      this.editForm.id = role._id;
      this.editForm.name = role.name;
      this.editForm.description = role.description;
      this.editForm.permissions = role.permissions.map(
        permission => permission._id
      );
    },
    getPermissions() {
      this.$axios.$get("/api/v1/admin/permissions").then(response => {
        this.permissions = response.data;
      });
    },
    getRoles() {
      this.loadingGetRoles = true;
      this.$axios.$get("/api/v1/admin/roles").then(response => {
        this.roles = response.data;
        this.loadingGetRoles = false;
      });
    },
    toggleEditCategory(event) {
      const value = event.target.value;
      const isChecked = event.target.checked;

      const permissions = this.permissions.filter(
        permission => permission.category === value
      );

      if (!isChecked) {
        permissions.forEach(permission => {
          const exists = this.editForm.permissions.findIndex(id => {
            return id === permission._id;
          });
          if (exists !== -1) {
            this.editForm.permissions.splice(exists, 1);
          }
        });
        return;
      }

      permissions.forEach(permission => {
        if (this.editForm.permissions.includes(permission._id)) {
          return;
        }
        this.editForm.permissions.push(permission._id);
      });
    },
    updateRole() {
      if (!this.$store.getters["auth/hasPermission"]("update role")) {
        this.isEditModalVisible = false;
        this.$message.error("You don't have the permission to update a role.");
        return;
      }

      if (!this.roles[this.editForm.index].canDelete) {
        this.isEditModalVisible = false;
        this.$message.error("This role can't be updated.");
        return;
      }

      this.loadingUpdateRole = true;
      this.$axios
        .$patch(`/api/v1/admin/roles/${this.editForm.id}`, this.editForm)
        .then(response => {
          window.location.reload();

          // this.roles[this.editForm.index] = response.data
          // this.editForm.index = null
          // this.editForm.name = ''
          // this.editForm.description = ''
          // this.editForm.permissions = []
          // this.loadingUpdateRole = false;
          // this.isEditModalVisible = false;
        });
    },
    deleteRole(role, index) {
      if (!role.canDelete) {
        this.$message.error("This role can't be deleted.");
        return;
      }

      if (!this.$store.getters["auth/hasPermission"]("delete role")) {
        this.$message.error("You don't have the permission to delete a role.");
        return;
      }

      this.$axios.$delete(`/api/v1/admin/roles/${role._id}`).then(response => {
        this.roles.splice(index, 1);
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

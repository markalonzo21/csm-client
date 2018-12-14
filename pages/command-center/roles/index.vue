<template>
  <section class="w-full select-none" style="width: 100%">
    <!-- CREATE MODAL -->
    <modal v-model="isCreateRolesModalVisible" title="Create Roles" :footer="false">
      <form style="max-height: 400px; overflow-y: auto;" @submit.prevent="createRole" class="clearfix">
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
        </div> -->
        <div class="form-group">
          <label class="control-label col-sm-2"
                 for="pwd">Permissions:</label>

          <div class="col-sm-10">
            <div class="row">
              <div class="col-md-10"
                   v-for="(category, index) in categories"
                   :key="`category-${index}`"
                   style="user-select: none;">
                <ul class="list-group">
                  <li class="list-group-item"
                      style="padding-bottom: 5px; border: none;">
                    <input type="checkbox"
                           :id="`${category}-${index}`"
                           :value="category"
                           @change="toggleCategory">
                    <label class="text-capitalize"
                           :for="`${category}-${index}`">
                      {{ category }}
                    </label>
                  </li>

                  <li v-for="(permission, key) in permissions.filter(permission => permission.category === category)"
                      :key="`${permission._id}`"
                      class="list-group-item">
                    <input type="checkbox"
                           :id="`${permission._id}-${key}`"
                           v-model="form.permissions"
                           :value="permission._id"> &nbsp;
                    <label :for="`${permission._id}-${key}`"
                           class="text-capitalize">{{ permission.name }}</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
        <button
          class="btn btn-primary float-right"
          :disabled="loadingCreateRole"
        >{{ loadingCreateRole ? 'Loading' : 'Save' }}</button>
      </form>
    </modal>
    <!-- EDIT MODAL -->
    <modal v-model="isEditModalVisible" title="Edit Role" :footer="false">
      <form style="max-height: 400px; overflow-y: auto;" @submit.prevent="updateRole" class="clearfix">
        <div class="form-group">
          <input type="text" class="form-control" placeholder="Name" v-model="editForm.name" required>
        </div>
         <!-- <div class="form-group">
          <textarea
            cols="30" rows="10"
            class="form-control"
            placeholder="Description"
            v-model="editForm.description"
          ></textarea>
        </div> -->
        <div class="form-group">
          <label class="control-label col-sm-2"
                 for="pwd">Permissions:</label>

          <div class="col-sm-10">
            <div class="row">
              <div class="col-md-10"
                   v-for="(category, index) in categories"
                   :key="`category-${index}`"
                   style="user-select: none;">
                <ul class="list-group">
                  <li class="list-group-item"
                      style="padding-bottom: 5px; border: none;">
                    <input type="checkbox"
                           :id="`${category}-${index}`"
                           :value="category"
                           @change="toggleEditCategory">
                    <label class="text-capitalize"
                           :for="`${category}-${index}`">
                      {{ category }}
                    </label>
                  </li>

                  <li v-for="(permission, index) in permissions.filter(permission => permission.category === category)"
                      :key="`${permission._id}`"
                      class="list-group-item">
                    <input type="checkbox"
                           :id="`${permission._id}-${index}`"
                           v-model="editForm.permissions"
                           :value="permission._id"> &nbsp;
                    <label :for="`${permission._id}-${index}`"
                           class="text-capitalize">{{ permission.name }}</label>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
        <button
          class="btn btn-primary float-right"
          :disabled="loadingUpdateRole"
        >{{ loadingUpdateRole ? 'Loading' : 'Update' }}</button>
      </form>
    </modal>
    <div class="clearfix">
      <h3 class="float-left">Roles</h3>
      <a-button
        type="primary"
        class="float-right my-6"
        @click.prevent="isCreateRolesModalVisible = true"
      >Create Role</a-button>
    </div>
    <hr>

    <!-- TABLE -->
    <a-table bordered :dataSource="roles" :columns="columns">
      <template
        slot="createdAt"
        slot-scope="text, role"
      >{{ role.createdAt ? $moment(role.createdAt).format('MMM. DD, YYYY | h:mm A ') : '' }}</template>
      <template slot="operation" slot-scope="text, role, index">
        <a-button type="primary"  @click.prevent="showEditModal(role, index)">Edit</a-button>
        <a-popconfirm title="Are you sure delete this role?" @confirm="deleteRole(role, index)" okText="Yes" cancelText="No">
          <a-button type="danger" :disabled="!role.canDelete">Delete</a-button>
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
      isCreateRolesModalVisible: false,
      loadingGetRoles: false,
      permissions: [],
      roles: [],
      loadingCreateRole: false,
      loadingUpdateRole: false,
      columns: [
        {
          title: "Name",
          dataIndex: "name"
        },
        // {
        //   title: "Description",
        //   dataIndex: "description"
        // },
        {
          title: "Operation",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" }
        }
      ],
      form: {
        name: "",
        description: "",
        permissions: []
      },
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
  watch: {
    isEditModalVisible(value) {
      if (!value) {
         this.editForm.id = null
         this.editForm.index = null
         this.editForm.name = ""
         this.editForm.description = ""
         this.editForm.permissions = []
        }
      }
  },
  computed: {
    categories() {
      return this.permissions
        .map(permission => permission.category)
        .filter((v, i, a) => a.indexOf(v) === i)
    },
  },
  mounted() {
    this.getPermissions();
    this.getRoles();
    this.generateFakeData();
  },
  methods: {
    showEditModal(role, index) {
      this.isEditModalVisible = true
      this.editForm.index = index
      this.editForm.id = role._id
      this.editForm.name = role.name
      this.editForm.description = role.description
      this.editForm.permissions = role.permissions.map(permission => permission._id)
    },
    generateFakeData() {
      this.form.name = this.$chance.word();
      this.form.description = this.$chance.paragraph();
    },
    getPermissions() {
      this.$axios.$get("/admin/permissions").then(response => {
        this.permissions = response.data;
      });
    },
    getRoles() {
      this.loadingGetRoles = true;
      this.$axios.$get("/admin/roles").then(response => {
        this.roles = response.data;
        this.loadingGetRoles = false;
      });
    },
    toggleCategory(event) {
      const value = event.target.value
      const isChecked = event.target.checked

      const permissions = this.permissions.filter(
        permission => permission.category === value
      )

      if (!isChecked) {
        permissions.forEach(permission => {
          const exists = this.form.permissions.findIndex(id => {
            return id === permission._id
          })
          if (exists !== -1) {
            this.form.permissions.splice(exists, 1)
          }
        })
        return
      }

      permissions.forEach(permission => {
        if (this.form.permissions.includes(permission._id)) {
          return
        }
        this.form.permissions.push(permission._id)
      })
    },
    toggleEditCategory(event) {
      const value = event.target.value
      const isChecked = event.target.checked

      const permissions = this.permissions.filter(
        permission => permission.category === value
      )

      if (!isChecked) {
        permissions.forEach(permission => {
          const exists = this.editForm.permissions.findIndex(id => {
            return id === permission._id
          })
          if (exists !== -1) {
            this.editForm.permissions.splice(exists, 1)
          }
        })
        return
      }

      permissions.forEach(permission => {
        if (this.editForm.permissions.includes(permission._id)) {
          return
        }
        this.editForm.permissions.push(permission._id)
      })
    },
    createRole() {
      this.loadingCreateRole = true;
      this.$axios.$post("/admin/roles", this.form).then(response => {
        window.location.reload()
        // this.generateFakeData();
        // this.form.name = ''
        // this.form.description = ''
        // this.form.permissions = []
        // this.roles.push(response.data);
        // this.loadingCreateRole = false;
        // this.isCreateRolesModalVisible = false;
      });
    },
    updateRole() {
      if (! this.$store.getters['auth/hasPermission']('update role')) {
        this.isEditModalVisible = false
        this.$message.error('You don\'t have the permission to update a role.')
        return
      }

      if (! this.roles[this.editForm.index].canDelete) {
        this.isEditModalVisible = false
        this.$message.error('This role can\'t be updated.')
        return
      }

      this.loadingUpdateRole = true;
      this.$axios.$patch(`/admin/roles/${this.editForm.id}`, this.editForm).then(response => {
        window.location.reload()

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
      if (! this.$store.getters['auth/hasPermission']('delete role')) {
        this.$message.error('You don\'t have the permission to delete a role.')
        return
      }

      this.$axios.$delete(`/admin/roles/${role._id}`).then(response => {
        this.roles.splice(index, 1)
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

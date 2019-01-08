<template>
  <a-form class="container clearfix" @submit.prevent="updateRole">
    <h3 class="mt-0">Edit Role</h3>
    <div class="form-group">
      <a-input v-model="form.name" placeholder="Role Name" />
    </div>
    <div class="form-group">
      <h5 class="font-bold">Permissions</h5>
      <CommandCenterCreateRolePermissionGroup
        v-if="categories"
        v-for="(category, index) in categories"
        :permissions="permissions"
        :selectedPermissions="form.permissions"
        :category="category"
        :key="`category-${index}`"
        @removePermissions="removePermissions"
        @mergePermissions="mergePermissions"
      />
    </div>
    </div>
    <a-button
      type="primary"
      htmlType="submit"
      :disabled="loadingUpdateRole"
    >{{ loadingUpdateRole ? 'Loading' : 'Save' }}</a-button>
  </a-form>
</template>

<script>
  import CommandCenterCreateRolePermissionGroup from '~/components/CommandCenterCreateRolePermissionGroup'
  export default {
    layout: 'command-center/default',
    components: {
      CommandCenterCreateRolePermissionGroup
    },
    asyncData({ $axios, store, redirect, params }) {
      if (!store.getters["auth/hasPermission"]("update role")) {
        return redirect("/");
      }

      const getPermissions = $axios.$get("/admin/permissions")
      const getRole = $axios.$get(`/admin/roles/${params.id}`)

      return Promise.all([getPermissions, getRole]).then(([permissions, role]) => {

        return {
          loadingUpdateRole: false,
          permissions: permissions.data,
          form: {
            id: role.data._id,
            name: role.data.name,
            description: role.data.description,
            permissions: role.data.permissions.map(permission => permission._id)
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    computed: {
      categories() {
        return this.permissions
          .map(permission => permission.category)
          .filter((v, i, a) => a.indexOf(v) === i)
      }
    },
    methods: {
      mergePermissions(values) {
        for (var i = 0; i < values.length; i++) {
          const value = this.permissions.find(permission => permission.name === values[i])._id
          this.form.permissions.push(value)
        }
      },
      removePermissions(values) {
        for (var i = 0; i < values.length; i++) {
          const value = this.permissions.find(permission => permission.name === values[i])._id
          this.form.permissions.splice(value, 1);
        }
      },
      updateRole() {
        this.loadingUpdateRole = true;

        if (this.form.name.trim().length === 0) {
          this.$message.error('Role name is required!')
          this.loadingUpdateRole = false;
          return
        }

        if (this.form.permissions.length === 0) {
          this.$message.error('A permission is required!')
          this.loadingUpdateRole = false;
          return
        }

        this.loadingUpdateRole = true;
        this.$axios.$patch(`/admin/roles/${this.form.id}`, this.form).then(response => {
          this.$router.push('/command-center/roles')
        })
      },
    }
  }
</script>

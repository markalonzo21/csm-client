<template>
  <a-form class="container clearfix" @submit.prevent="updateRole">
    <h3 class="mt-0">Edit Role</h3>
    <div class="form-group">
      <a-input v-model="form.name" placeholder="Role Name" />
    </div>
    <div class="form-group">
      <h5 class="font-bold">Permissions</h5>
      <CommandCenterUpdateRolePermissionGroup
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
    layout: 'command-center',
    components: {
      CommandCenterCreateRolePermissionGroup
    },
    asyncData({ $axios, store, redirect }) {
      if (!store.getters["auth/hasPermission"]("update role")) {
        return redirect("/");
      }

      return $axios.$get("/admin/permissions").then(response => {
        return {
          loadingUpdateRole: false,
          permissions:  response.data,
          form: {
            name: "",
            description: "",
            permissions: []
          }
        }
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

        this.$axios.$post("/admin/roles", this.form).then(response => {
          this.$router.push('/command-center/roles')
        });
      },
    }
  }
</script>

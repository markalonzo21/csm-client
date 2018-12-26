<template>
  <div>
    <a-drawer
      title="Navigate"
      placement="left"
      :closable="false"
      @close="onClose"
      :visible="visible"
    >
    <a-menu
      :defaultSelectedKeys="[$route.path]"
      :defaultOpenKeys="defaultOpenKeys"
      :style="{ height: '100%', borderRight: 0 }"
      theme="dark"
    >
      <a-menu-item
        key="/command-center"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center' }"
        v-if="$store.getters['auth/hasPermission']('view command center')"
      >
        <router-link to="/command-center">
          <a-icon type="dashboard"/>
          <span>Dashboard</span>
        </router-link>>
      </a-menu-item>
      <a-menu-item
        key="/command-center/roles"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/roles' }"
        v-if="$store.getters['auth/hasPermission']('view roles')"
      >
        <router-link to="/command-center/roles">
          <a-icon type="bars"/>
          <span>Roles</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        key="/command-center/users"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/users' }"
        v-if="$store.getters['auth/hasPermission']('view users')"
      >
        <router-link to="/command-center/users">
          <a-icon type="bars"/>
          <span>Users</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        key="/command-center/areas"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/areas' }"
        v-if="$store.getters['auth/hasPermission']('view areas') || $store.getters['auth/hasSpecificArea']"
      >
        <router-link to="/command-center/areas">
          <a-icon type="bars"/>
          <span>Areas</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        key="/command-center/reports"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/reports' }"
        v-if="$store.getters['auth/hasPermission']('view reports')"
      >
        <router-link to="/command-center/reports">
          <a-icon type="bars"/>
          <span>Reports</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        key="/command-center/report-categories"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/report-categories' }"
        v-if="$store.getters['auth/hasPermission']('view report categories')"
      >
        <router-link to="/command-center/report-categories">
          <a-icon type="bars"/>
          <span>Report Categories</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        key="/command-center/report-types"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/report-types' }"
        v-if="$store.getters['auth/hasPermission']('view report types')"
      >
        <router-link to="/command-center/report-types">
          <a-icon type="bars"/>
          <span>Report Types</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        key="/command-center/response-types"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/response-types' }"
        v-if="$store.getters['auth/hasPermission']('view response types')"
      >
        <router-link to="/command-center/response-types">
          <a-icon type="bars"/>
          <span>Response Types</span>
        </router-link>
      </a-menu-item>
      <a-menu-item
        key="/command-center/advertisements"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/advertisements' }"
        v-if="$store.getters['auth/hasPermission']('view advertisements')"
      >
        <router-link to="/command-center/advertisements">
          <a-icon type="bars"/>
          <span>Advertisements</span>
        </router-link>
      </a-menu-item>
    </a-menu>
    </a-drawer>
  </div>
</template>

<script>
export default {
  props: ['visible'],
  computed: {
    defaultOpenKeys() {
      return this.list
        .filter(item => {
          return this.$route.path.includes(item.link);
        })
        .map(item => item.link);
    }
  },
  data() {
    return {
      list: [
        // {
        //   title: "Resolvers",
        //   icon: "bars",
        //   link: "/command-center/resolvers",
        //   permissionNeeded: ["administrator"]
        // },
        // {
        //   title: "Responders",
        //   icon: "bars",
        //   link: "/command-center/responders",
        //   permissionNeeded: ["administrator"]
        // }
      ]
    };
  },
  watch: {
    $route() {
      this.$emit('close')
    }
  },
  methods: {
    showDrawer() {
      this.$emit('open')
    },
    onClose() {
      this.$emit('close')
    },
  },
};
</script>

<style>
  .ant-drawer-body {
    padding: 0 !important;
    font-size: 14px;
    line-height: 1.5;
    word-wrap: break-word;
  }
  .ant-drawer-header {
    background-color: #001121;
  }
  .ant-drawer-content {
    background-color: #001121;
  }
  .ant-drawer-title {
    color: white;
  }
</style>

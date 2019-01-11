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
          <nuxt-link to="/command-center">
            <a-icon type="dashboard"/>
            <span>Dashboard</span>
          </nuxt-link>>
        </a-menu-item>
        <a-menu-item
          key="/command-center/incident-map"
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/incident-map' }"
          v-if="$store.getters['auth/hasPermission']('view incident map')"
        >
          <nuxt-link to="/command-center/incident-map">
            <a-icon type="global"/>
            <span>Incident Map</span>
          </nuxt-link>>
        </a-menu-item>
        <a-menu-item
          key="/command-center/roles"
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/roles' }"
          v-if="$store.getters['auth/hasPermission']('view roles')"
        >
          <nuxt-link to="/command-center/roles">
            <a-icon type="bars"/>
            <span>Roles</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          key="/command-center/users"
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/users' }"
          v-if="$store.getters['auth/hasPermission']('view users')"
        >
          <nuxt-link to="/command-center/users">
            <a-icon type="bars"/>
            <span>Users</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          key="/command-center/areas"
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/areas' }"
          v-if="$store.getters['auth/hasPermission']('view areas') || $store.getters['auth/hasSpecificArea']"
        >
          <nuxt-link to="/command-center/areas">
            <a-icon type="bars"/>
            <span>Areas</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          key="/command-center/reports"
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/reports' }"
          v-if="$store.getters['auth/hasPermission']('view reports')"
        >
          <nuxt-link to="/command-center/reports">
            <a-icon type="bars"/>
            <span>Reports</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          key="/command-center/report-categories"
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/report-categories' }"
          v-if="$store.getters['auth/hasPermission']('view report categories')"
        >
          <nuxt-link to="/command-center/report-categories">
            <a-icon type="bars"/>
            <span>Report Categories</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          key="/command-center/report-types"
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/report-types' }"
          v-if="$store.getters['auth/hasPermission']('view report types')"
        >
          <nuxt-link to="/command-center/report-types">
            <a-icon type="bars"/>
            <span>Report Types</span>
          </nuxt-link>
        </a-menu-item>
        <!--       <a-menu-item
        key="/command-center/response-types"
        :class="{ 'ant-menu-item-selected': $route.path === '/command-center/response-types' }"
        v-if="$store.getters['auth/hasPermission']('view response types')"
      >
        <nuxt-link to="/command-center/response-types">
          <a-icon type="bars"/>
          <span>Response Types</span>
        </nuxt-link>
        </a-menu-item>-->
        <a-menu-item
          key="/command-center/advertisements"
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/advertisements' }"
          v-if="$store.getters['auth/hasPermission']('view advertisements')"
        >
          <nuxt-link to="/command-center/advertisements">
            <a-icon type="bars"/>
            <span>Advertisements</span>
          </nuxt-link>
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
          return this.$route.path.includes(item.link)
        })
        .map(item => item.link)
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
    }
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
    }
  }
}
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

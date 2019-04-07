<template>
  <div>
    <a-drawer
      :visible="visible"
      @close="onClose"
      placement="left"
      title="Navigate"
    >
      <a-menu
        :defaultOpenKeys="defaultOpenKeys"
        :defaultSelectedKeys="[$route.path]"
        :style="{ height: '100%', borderRight: 0 }"
        theme="dark"
      >
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center' }"
          key="/command-center"
          v-if="$store.getters['auth/hasPermission']('view command center')"
        >
          <nuxt-link to="/command-center">
            <a-icon type="dashboard"/>
            <span>Dashboard</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/maps' }"
          key="/command-center/incident-map"
          v-if="$store.getters['auth/hasPermission']('view maps')"
        >
          <nuxt-link to="/command-center/maps">
            <a-icon type="global"/>
            <span>Incident Map</span>
          </nuxt-link>>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/roles' }"
          key="/command-center/roles"
          v-if="$store.getters['auth/hasPermission']('view roles')"
        >
          <nuxt-link to="/command-center/roles">
            <a-icon type="bars"/>
            <span>Roles</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/users' }"
          key="/command-center/users"
          v-if="$store.getters['auth/hasPermission']('view users')"
        >
          <nuxt-link to="/command-center/users">
            <a-icon type="bars"/>
            <span>Users</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/customers' }"
          key="/command-center/customers"
          v-if="$store.getters['auth/hasPermission']('view customers')"
        >
          <nuxt-link to="/command-center/customers">
            <a-icon type="bars"/>
            <span>Customers</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/areas' }"
          key="/command-center/areas"
          v-if="$store.getters['auth/hasPermission']('view areas') || $store.getters['auth/hasSpecificArea']"
        >
          <nuxt-link to="/command-center/areas">
            <a-icon type="bars"/>
            <span>Areas</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/reports' }"
          key="/command-center/reports"
          v-if="$store.getters['auth/hasPermission']('view reports')"
        >
          <nuxt-link to="/command-center/reports">
            <a-icon type="bars"/>
            <span>Reports</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/report-categories' }"
          key="/command-center/report-categories"
          v-if="$store.getters['auth/hasPermission']('view report categories')"
        >
          <nuxt-link to="/command-center/report-categories">
            <a-icon type="bars"/>
            <span>Report Categories</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/report-types' }"
          key="/command-center/report-types"
          v-if="$store.getters['auth/hasPermission']('view report types')"
        >
          <nuxt-link to="/command-center/report-types">
            <a-icon type="bars"/>
            <span>Report Types</span>
          </nuxt-link>
        </a-menu-item>

        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/canned-responses' }"
          key="/command-center/canned-responses"
          v-if="$store.getters['auth/hasPermission']('view canned responses')"
        >
          <nuxt-link to="/command-center/canned-responses">
            <a-icon type="bars"/>
            <span>Canned Responses</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/banners' }"
          key="/command-center/banners"
          v-if="$store.getters['auth/hasPermission']('view banners')"
        >
          <nuxt-link to="/command-center/banners">
            <a-icon type="bars"/>
            <span>Banners</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/articles' }"
          key="/command-center/articles"
          v-if="$store.getters['auth/hasPermission']('view articles')"
        >
          <nuxt-link to="/command-center/articles">
            <a-icon type="bars"/>
            <span>Articles</span>
          </nuxt-link>
        </a-menu-item>
        <a-menu-item
          :class="{ 'ant-menu-item-selected': $route.path === '/command-center/promotions' }"
          key="/command-center/promotions"
          v-if="$store.getters['auth/hasPermission']('view promotions')"
        >
          <nuxt-link to="/command-center/promotions">
            <a-icon type="bars"/>
            <span>Promotions</span>
          </nuxt-link>
        </a-menu-item>
      </a-menu>
    </a-drawer>
  </div>
</template>

<script>
export default {
  props: ["visible"],
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
      this.$emit("close");
    }
  },
  methods: {
    onClose() {
      this.$emit("close");
    }
  }
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

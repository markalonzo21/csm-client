<template>
  <div style="width: 200px;">
    <a-layout-sider
      width="200"
      style="background: #fff"
      :style="{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
    >
      <a-menu
        mode="inline"
        theme="dark"
        :defaultSelectedKeys="[$route.path]"
        :defaultOpenKeys="defaultOpenKeys"
        :style="{ height: '100%', borderRight: 0 }"
      >
        <template
          v-for="item in list"
          v-if="$store.getters['auth/hasPermission'](item.permissionNeeded)"
        >
          <a-menu-item
            v-if="!item.children"
            :key="item.link"
            :class="{ 'ant-menu-item-selected': $route.path === item.link }"
          >
            <router-link :to="item.link" v-if="item.link">
              <a-icon :type="item.icon"/>
              <span>{{item.title}}</span>
            </router-link>
            <template v-else>
              <a-icon :type="item.icon"/>
              <span>{{item.title}}</span>
            </template>
          </a-menu-item>
          <a-sub-menu :key="item.link" v-else>
            <span slot="title">
              <a-icon :type="item.icon"/>
              <span>{{ item.title }}</span>
            </span>
            <a-menu-item :key="child.link" v-for="child in item.children">
              <router-link :to="child.link" v-if="child.link">
                <a-icon :type="child.icon"/>
                <span>{{child.title}}</span>
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </template>
      </a-menu>
    </a-layout-sider>
  </div>
</template>

<script>
export default {
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
        {
          title: "Dashboard",
          icon: "dashboard",
          link: "/command-center",
          permissionNeeded: "view dashboard"
        },

        {
          title: "Roles",
          icon: "bars",
          link: "/command-center/roles",
          permissionNeeded: "view roles"
        },
        {
          title: "Users",
          icon: "bars",
          link: "/command-center/users",
          permissionNeeded: "view users"
        },
        {
          title: "Areas",
          icon: "bars",
          link: "/command-center/areas",
          permissionNeeded: "view areas"
        },
        {
          title: "Reports",
          icon: "bars",
          link: "/command-center/reports",
          permissionNeeded: "view reports"
        },
        {
          title: "Report Categories",
          icon: "bars",
          link: "/command-center/report-categories",
          permissionNeeded: "view report categories"
        },
        {
          title: "Report Types",
          icon: "bars",
          link: "/command-center/report-types",
          permissionNeeded: "view report types"
        },
        {
          title: "Response Types",
          icon: "bars",
          link: "/command-center/response-types",
          permissionNeeded: "view response types"
        }

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
  }
};
</script>

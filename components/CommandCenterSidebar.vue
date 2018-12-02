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
        v-if="$auth.user"
      >
        <template v-for="item in list" v-if="item.roles.includes($auth.user.role.slug)">
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
          return this.$route.path.includes(item.link)
        })
        .map(item => item.link)
    }
  },
  data() {
    return {
      list: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          link: '/command-center',
          roles: ['administrator', 'resolver']
        },
        // {
        //   title: 'Area Management',
        //   icon: 'global',
        //   link: '/command-center/areas',
        //   roles: ['administrator'],
        //   children: [
        //     {
        //       title: 'Area List',
        //       icon: 'bars',
        //       link: '/command-center/areas'
        //     },
        //     {
        //       title: 'New Area',
        //       icon: 'plus-circle-o',
        //       link: '/command-center/areas/new'
        //     }
        //   ]
        // },
        {
          title: 'Areas',
          icon: 'bars',
          link: '/command-center/areas',
          roles: ['administrator']
        },
        {
          title: 'Reports',
          icon: 'bars',
          link: '/command-center/reports',
          roles: ['administrator']
        },
        {
          title: 'Report Categories',
          icon: 'bars',
          link: '/command-center/report-categories',
          roles: ['administrator']
        },
        {
          title: 'Report Types',
          icon: 'bars',
          link: '/command-center/report-types',
          roles: ['administrator']
        },
        {
          title: 'Response Types',
          icon: 'bars',
          link: '/command-center/response-types',
          roles: ['administrator']
        },
        {
          title: 'Resolvers',
          icon: 'bars',
          link: '/command-center/resolvers',
          roles: ['administrator']
        },
        {
          title: 'Respondents',
          icon: 'bars',
          link: '/command-center/respondents',
          roles: ['administrator']
        }
      ]
    }
  }
}
</script>

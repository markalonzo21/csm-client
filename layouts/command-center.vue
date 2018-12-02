<template>
  <a-layout id="components-layout-demo-top-side-2">
    <no-ssr>
      <div style="height: 64px;">
        <fixed-header :fixed.sync="isFixed">
          <a-layout-header :class="{ 'fixed': isFixed }" :style="{ zIndex: 99999, width: '100%' }">
            <div class="logo"/>
            <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
              <a-dropdown :trigger="['click']" class="float-right text-white hover:text-grey">
                <a class="ant-dropdown-link" href="#">Admin
                  <a-icon type="down"/>
                </a>
                <a-menu slot="overlay">
                  <a-menu-item key="0">
                    <a @click.prevent="$store.dispatch('auth/logout')">Log Out</a>
                  </a-menu-item>
                </a-menu>
              </a-dropdown>
            </a-menu>
          </a-layout-header>
        </fixed-header>
      </div>
    </no-ssr>
    <no-ssr>
      <a-layout class="h-full select-none">
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
              :inlineCollapsed="collapsed"
              :style="{ height: '100%', borderRight: 0 }"
            >
              <template v-for="(item, index) in list">
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
        <a-layout style="padding: 0 24px 24px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item v-for="(crumb, index) in crumbs" :key="`crumb-${index}`">
              <!--   <router-link class="capitalize" :to="crumb.to" v-if="index < crumbs.length ">
                {{  crumb.text }}
              </router-link>-->
            </a-breadcrumb-item>
            <!-- <a-breadcrumb-item v-for="crumb in crumbs" v-text="crumb.text" :to="crumb.to" :key="crumb.to"></a-breadcrumb-item> -->
          </a-breadcrumb>
          <a-layout-content
            :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
          >
            <nuxt/>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </no-ssr>
  </a-layout>
</template>
<script>
import FixedHeader from 'vue-fixed-header'

export default {
  components: {
    FixedHeader
  },
  computed: {
    defaultOpenKeys() {
      return this.list
        .filter(item => {
          return this.$route.path.includes(item.link)
        })
        .map(item => item.link)
    },
    crumbs() {
      let crumbs = this.$route.path.split('/')
      let items = []
      let route = ''

      for (let i = 1; i < crumbs.length; i++) {
        let crumb = crumbs[i]

        route = route + '/' + crumbs[i]

        items.push({
          text: crumb,
          to: route
        })
      }
      return items
    }
  },
  data() {
    return {
      isFixed: false,
      collapsed: false,
      list: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          link: '/command-center',
          roles: ['administrator']
        },
        {
          title: 'Area Management',
          icon: 'global',
          link: '/command-center/areas',
          roles: ['administrator'],
          children: [
            {
              title: 'Area List',
              icon: 'bars',
              link: '/command-center/areas'
            },
            {
              title: 'New Area',
              icon: 'plus-circle-o',
              link: '/command-center/areas/new'
            }
          ]
        },
        {
          title: 'Report Categories',
          icon: 'global',
          link: '/command-center/report-categories',
          roles: ['administrator'],
          children: [
            {
              title: 'Categories List',
              icon: 'bars',
              link: '/command-center/report-categories'
            },
            {
              title: 'New Category',
              icon: 'plus-circle-o',
              link: '/command-center/report-categories/new'
            }
          ]
        }
      ]
    }
  },
  methods: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed
    }
  }
}
</script>

<style>
#components-layout-demo-top-side-2 .logo {
  width: 120px;
  height: 31px;
  background: #fff;
  margin: 16px 28px 16px 0;
  float: left;
}
</style>

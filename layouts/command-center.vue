<template>
  <a-layout id="components-layout-demo-top-side-2">
    <no-ssr>
      <div style="height: 64px;">
        <fixed-header :fixed.sync="isFixed">
          <a-layout-header :class="{ 'fixed': isFixed }" :style="{ zIndex: 99999, width: '100%' }">
            <div class="logo flex items-center content-center">
              <router-link to="/">
                <img src="/img/megaworld-logo.png" class="p-4" alt>
              </router-link>
            </div>
            <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
              <a-dropdown :trigger="['click']" class="float-right text-white hover:text-grey">
                <a class="ant-dropdown-link" href="#">
                  {{ $auth.user.email }}
                  <a-icon type="down"/>
                </a>

                <a-menu slot="overlay">
                  <a-menu-item key="0" v-if="$store.getters['auth/hasPermission']('resolve')">
                    <router-link to="/resolver">Resolver Dashboard</router-link>
                  </a-menu-item>
                  <a-menu-item key="1" v-if="$store.getters['auth/hasPermission']('respond')">
                    <router-link to="/responder">Responder Dashboard</router-link>
                  </a-menu-item>
                  <a-menu-item key="2">
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
        <CommandCenterSidebar/>
        <a-layout style="padding: 0 24px 24px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item v-for="(crumb, index) in crumbs" :key="`crumb-${index}`">
              <router-link
                class="capitalize"
                :to="crumb.to"
                v-if="index < crumbs.length "
              >{{ crumb.text.replace('-', ' ') }}</router-link>
            </a-breadcrumb-item>
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
import FixedHeader from "vue-fixed-header";
import CommandCenterSidebar from "~/components/CommandCenterSidebar";
export default {
  components: {
    FixedHeader,
    CommandCenterSidebar
  },
  data() {
    return {
      isFixed: false
    };
  },
  computed: {
    crumbs() {
      let crumbs = this.$route.path.split("/");
      let items = [];
      let route = "";

      for (let i = 1; i < crumbs.length; i++) {
        let crumb = crumbs[i];

        route = route + "/" + crumbs[i];

        items.push({
          text: crumb,
          to: route
        });
      }
      return items;
    }
  }
};
</script>

<style>
#components-layout-demo-top-side-2 .logo {
  width: 120px;
  height: 35px;
  background: #fff;
  margin: 16px 28px 16px 0;
  float: left;
}
</style>

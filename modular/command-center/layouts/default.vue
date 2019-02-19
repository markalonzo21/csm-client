<template>
  <a-layout id="components-layout-demo-fixed">
    <CommandCenterDrawer
      :visible="isDrawerVisible"
      @close="isDrawerVisible = false"
      @open="isDrawerVisible = true"
    />
    <a-layout-header :style="{ position: 'fixed', zIndex: 401, width: '100%' }">
      <nuxt-link
        class="logo cursor-pointer"
        to="/"
      ></nuxt-link>
      <a-menu
        :style="{ lineHeight: '64px' }"
        mode="horizontal"
        theme="dark"
      >
        <a-menu-item
          @click="isDrawerVisible = true"
          key="1"
          style="background: transparent;"
        >
          <a-icon
            :type="isDrawerVisible ? 'menu-fold' : 'menu-unfold'"
            class="trigger"
          />
        </a-menu-item>
        <a-dropdown
          :key="0"
          :trigger="['click']"
          class="float-right text-white"
        >
          <a class="ant-dropdown-link outline-none select-none hover:text-white hover:no-underline">
            <a-avatar
              icon="user"
              v-if="windowWidth >= 600"
            />
            <span v-if="windowWidth >= 600">&nbsp; {{ $store.state.auth.user.role.name }}&nbsp;</span>
            <a-icon type="down"/>
          </a>

          <a-menu
            slot="overlay"
            v-if="$route.path.includes('command-center')"
          >
            <a-menu-item
              disabled
              v-if="windowWidth <= 330"
            >{{ $store.state.auth.user.email }}</a-menu-item>
            <a-menu-divider v-if="windowWidth <= 330"></a-menu-divider>
            <a-menu-item key="5">
              <nuxt-link to="/">Home</nuxt-link>
            </a-menu-item>
            <a-menu-item
              key="0"
              v-if="$store.getters['auth/hasPermission']('resolve')"
            >
              <nuxt-link to="/resolver">Resolver Dashboard</nuxt-link>
            </a-menu-item>
            <a-menu-item
              key="1"
              v-if="$store.getters['auth/hasPermission']('respond')"
            >
              <nuxt-link to="/responder">Responder Dashboard</nuxt-link>
            </a-menu-item>

            <a-menu-item key="2">
              <a @click.prevent="$store.dispatch('auth/logout')">Log Out</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </a-menu>
    </a-layout-header>

    <a-layout-content :style="{ padding: isDesktopWidth ? '0 50px' : '0', marginTop: '64px' }">
      <a-breadcrumb style="margin: 16px 20px">
        <a-breadcrumb-item
          :key="`crumb-${index}`"
          v-for="(crumb, index) in crumbs"
        >
          <nuxt-link
            :to="crumb.to"
            class="capitalize"
            v-if="index < crumbs.length "
          >{{ crumb.text.replace('-', ' ') }}</nuxt-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div
        :style="{ background: '#fff', padding: '24px', minHeight: '81vh', height: 'auto', overflow: 'hidden' }"
      >
        <nuxt/>
      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">© 2018 Powered by Systems Terasoft Inc.</a-layout-footer>
  </a-layout>
</template>

<script>
import CommandCenterDrawer from "~/components/CommandCenterDrawer";

export default {
  components: {
    CommandCenterDrawer
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
    },
    isDesktopWidth() {
      return this.windowWidth >= 1024;
    }
  },
  data() {
    return {
      isDrawerVisible: false,
      windowWidth: window.innerWidth
    };
  },
  watch: {
    windowWidth(newWidth) {
      this.windowWidth = newWidth;
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        this.windowWidth = window.innerWidth;
      });
    });
  }
};
</script>

<style>
#components-layout-demo-fixed .logo {
  width: 120px;
  /* height: 31px; */
  background-image: url("/img/sentinel-logo.png");
  /* background-size: 120px 31px !important; */
  background-size: cover;
  /* background-color: white; */
  margin: 16px 24px 16px 0;
  float: left;
}
</style>

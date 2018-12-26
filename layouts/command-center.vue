<template>
  <a-layout id="components-layout-demo-fixed">
    <CommandCenterDrawer :visible="isDrawerVisible" @open="isDrawerVisible = true" @close="isDrawerVisible = false"/>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <div class="logo" />
      <a-menu
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
      >
        <a-menu-item key="1" style="background: transparent;" @click="isDrawerVisible = true">
           <a-icon
             class="trigger"
             :type="isDrawerVisible ? 'menu-fold' : 'menu-unfold'"
           />
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item v-for="(crumb, index) in crumbs" :key="`crumb-${index}`">
          <router-link
            class="capitalize"
            :to="crumb.to"
            v-if="index < crumbs.length "
          >{{ crumb.text.replace('-', ' ') }}</router-link>
        </a-breadcrumb-item>
      </a-breadcrumb>
      <div :style="{ background: '#fff', padding: '24px', minHeight: '81vh' }">
        <nuxt/>
      </div>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      © 2018 Powered by Systems Terasoft Inc.
    </a-layout-footer>
  </a-layout>
</template>

<script>
  import CommandCenterDrawer from '~/components/CommandCenterDrawer'

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
      }
    },
    data() {
      return {
        isDrawerVisible: false
      }
    }
  }
</script>

<style>
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background-image: url('/img/megaworld-logo.png');
  background-size: cover;
  margin: 16px 24px 16px 0;
  float: left;
}
</style>

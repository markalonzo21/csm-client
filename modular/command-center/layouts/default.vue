<template>
  <a-layout
    id="components-layout-demo-fixed"
    v-if="$store.state.auth.user"
  >
    <LayoutDrawer
      :visible="isDrawerVisible"
      @close="isDrawerVisible = false"
      @open="isDrawerVisible = true"
    />
    <a-layout-header :style="{ position: 'fixed', zIndex: 401, width: '100%' }">
      <nuxt-link
        class="cursor-pointer"
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
    <!-- <a-layout-footer :style="{ textAlign: 'center' }">© 2018
      Powered by Systems Terasoft Inc.
    </a-layout-footer>-->
  </a-layout>
</template>

<script>
import LayoutDrawer from "~/modular/command-center/layouts/-Drawer";

// Antd Import all antd components on command center pages
import Vue from "vue";
import {
  Avatar,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  Layout,
  message,
  Menu,
  Modal,
  notification,
  Pagination,
  Popconfirm,
  Popover,
  Row,
  Select,
  Spin,
  Switch,
  Table,
  Tooltip,
  Upload,
  Drawer
} from "ant-design-vue/lib";

Vue.use(Button);
import "ant-design-vue/lib/button/style/css";
Vue.use(Tooltip);
import "ant-design-vue/lib/tooltip/style/css";
Vue.use(Table);
import "ant-design-vue/lib/table/style/css";
Vue.use(Pagination);
import "ant-design-vue/lib/pagination/style/css";
Vue.use(Form);
import "ant-design-vue/lib/form/style/css";
Vue.use(Input);
import "ant-design-vue/lib/input/style/css";
Vue.use(Icon);
import "ant-design-vue/lib/icon/style/css";
Vue.use(Checkbox);
import "ant-design-vue/lib/checkbox/style/css";
Vue.use(Spin);
import "ant-design-vue/lib/spin/style/css";
Vue.use(Menu);
import "ant-design-vue/lib/menu/style/css";
Vue.use(Layout);
import "ant-design-vue/lib/layout/style/css";
Vue.use(Drawer);
import "ant-design-vue/lib/drawer/style/css";
Vue.use(Breadcrumb);
import "ant-design-vue/lib/breadcrumb/style/css";
Vue.use(Dropdown);
import "ant-design-vue/lib/dropdown/style/css";
Vue.use(Select);
import "ant-design-vue/lib/select/style/css";
Vue.use(Avatar);
import "ant-design-vue/lib/avatar/style/css";
Vue.use(Col);
import "ant-design-vue/lib/col/style/css";
Vue.use(Row);
import "ant-design-vue/lib/row/style/css";
Vue.use(DatePicker);
import "ant-design-vue/lib/date-picker/style/css";
Vue.use(Popconfirm);
import "ant-design-vue/lib/popconfirm/style/css";
Vue.use(Popover);
import "ant-design-vue/lib/popover/style/css";
Vue.use(Modal);
import "ant-design-vue/lib/modal/style/css";
Vue.use(Upload);
import "ant-design-vue/lib/upload/style/css";
Vue.use(Switch);
import "ant-design-vue/lib/switch/style/css";

export default {
  components: {
    LayoutDrawer
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

<style lang="postcss">
.drawer-filter .ant-drawer-body {
  @apply mx-8 !important;
  @apply mt-4 !important;
}
.drawer-filter .ant-form-item {
  @apply mb-4 !important;
}
.drawer-filter label {
  @apply text-white !important;
}
.drawer-filter .anticon-close {
  @apply text-white !important;
}

#components-layout-demo-fixed .logo {
  width: 120px !important;
  /* height: 31px !important; */
  /* background-image: url("/img/sentinel-logo.png") !important; */
  /* background-size: 120px 31px !important !important; */
  background-size: cover !important;
  /* background-color: white !important; */
  margin: 16px 24px 16px 0 !important;
  float: left !important;
}
.ant-drawer-close {
  color: white !important;
}
</style>


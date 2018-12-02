<template functional>
  <a-sub-menu v-on="listeners" v-bind="data.attrs">
    <span slot="title"><a-icon :type="data.attrs.menuInfo.icon" /><span>{{data.attrs.menuInfo.title}}</span></span>
    <template v-for="item in data.attrs.menuInfo.children">
      <a-menu-item v-if="!item.children" :key="item.link">
        <router-link :to="item.link" v-if="item.link">
          <a-icon :type="item.icon" />
          <span>{{item.title}}</span>
        </router-link>
      </a-menu-item>
      <sub-menu v-else :menuInfo="item" :key="item.link"/>
    </template>
  </a-sub-menu>
</template>

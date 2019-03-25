<template>
  <el-scrollbar wrapClass="scrollbar-wrapper">
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="path"
      :collapse="isCollapse">
      <div class="brand">
        <span v-if="!isCollapse">好乐互娱管理平台</span>
      </div>
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.name"
        :item="route"
        :base-path="route.path">
      </sidebar-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
  import {mapGetters} from 'vuex';
  import SidebarItem from './SidebarItem';

  export default {
    data() {
      return {
        path: ''
      };
    },
    components: {
      SidebarItem
    },
    created() {
      this.path = this.$route.path;
    },
    watch: {
      $route(route) {
        this.path = route.path;
        const match = route.matched[1];
        let index = match.path.indexOf(':');
        if (index > -1) {
          this.path = match.path.substring(0, index - 1);
        }
      }
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .brand {
    height: 60px;
    line-height: 60px;
    margin-right: -1px;
    font-size: 16px;
    text-align: center;
    color: #fff;
    background: #2945cb;
  }
</style>

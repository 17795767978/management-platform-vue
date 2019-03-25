<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      class="hamburger-container"
      :toggleClick="toggleSideBar"
      :isActive="sidebar.opened">
    </hamburger>

    <breadcrumb class="breadcrumb-container"></breadcrumb>

    <div class="right-menu">
      <audit-message class="right-menu-item"></audit-message>
      <el-tooltip
        effect="dark"
        content="全屏"
        placement="bottom">
        <screenfull class="screenfull right-menu-item"></screenfull>
      </el-tooltip>

      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <!--<img class="user-avatar" src="">-->
          <span>{{name}}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>首页</el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span @click="logout" style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-menu>
</template>

<script>
  import {mapGetters} from 'vuex';
  import Breadcrumb from '../../../components/Breadcrumb';
  import Hamburger from '../../../components/Hamburger';
  import Screenfull from '../../../components/Screenfull';
  import AuditMessage from '../../../components/AuditMessage';

  export default {
    name: 'Navbar',
    computed: {
      ...mapGetters([
        'sidebar',
        'name'
      ])
    },
    components: {
      Breadcrumb,
      Hamburger,
      Screenfull,
      AuditMessage
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar');
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .navbar {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 10;
    height: 61px;
    line-height: 61px;
    border-radius: 0 !important;
    background-image: linear-gradient(143deg, #2945cb 20%, #2b83f9 81%, #3a9dff);

    .hamburger-container {
      line-height: 70px;
      height: 60px;
      float: left;
      padding: 0 10px;
    }

    .breadcrumb-container {
      float: left;
    }

    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }

    .right-menu {
      float: right;
      height: 100%;

      &:focus {
        outline: none;
      }

      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }

      .screenfull {
        height: 20px;
        margin-top: 15px;
      }

      .international {
        vertical-align: top;
      }

      .theme-switch {
        vertical-align: 15px;
      }
      .message-container{
        position: relative;
        margin-right: 30px;
        height: 50px;
        .message-wrapper{
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          color: #fff;
          font-size: 16px;
          top: -15px;
        }
        .msg-count{
          font-size: 12px;
          background-color: #E65D6E;
          color: #fff;
          position: absolute;
          top: 10px;
          left: -10px;
          text-align: center;
          height: 20px;
          min-width: 20px;
          line-height: 18px;
          border-radius: 20px;
          border: 2px solid #fff
        }
      }
      .avatar-container {
        height: 50px;
        margin-right: 50px;

        .avatar-wrapper {
          cursor: pointer;
          margin-top: 5px;
          position: relative;
          color: #fff;
          font-size: 16px;
          top: -15px;

          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }

          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>

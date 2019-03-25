<template>
  <div>
    <el-dropdown class="message-container" trigger="click">
      <div class="message-wrapper">
        <span class="msg-count">{{auditMessage.length}}</span>
        <i class="el-icon-bell"></i>
        <span>消息</span>
      </div>
      <el-dropdown-menu slot="dropdown">
          <el-dropdown-item :key="item.id" v-for="item in auditMessage">
            <router-link class="message-item" :to="{path:'/band/band-auditing-detail',query:{id:item.objectId}}" v-if="item.objectType === 'band'">
              <div><span class="band">[乐队审核]</span>{{item.createName}}</div>
              <div class="content">{{item.content}}</div>
            </router-link>
            <router-link class="message-item" :to="{path:'/musicians/detail',query:{id:item.objectId}}" v-if="item.objectType === 'musician'">
              <div><span class="musician">[音乐人审核]</span>{{item.content}}</div>
              <div class="content">{{item.content}}</div>
            </router-link>
          </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  export default {
    name: 'AuditMessage',
    computed: {
      ...mapGetters(['auditMessage'])
    },
    mounted() {
      console.log(this.message);
    }
  };
</script>

<style lang="scss" scoped>
  .message-item {
    padding: 5px 0;
    border-bottom: 1px solid #eee;
    display: block;
    font-size: 13px;
    .musician{
      color: #E6A23C;
      margin-right: 5px;
    }
    .band{
      color: #409EFF;
      margin-right: 5px;
    }
    .content {
      color: #999;
      font-size: 12px;
      min-width: 200px;
      line-height: 1.5;
      padding-bottom: 5px;
    }
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
</style>

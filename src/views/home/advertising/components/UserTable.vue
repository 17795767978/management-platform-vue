<template>
  <div class="wrapper">
    <div class="search">
      <el-form
        class="fl"
        :inline="true"
        :model="form">
        <el-form-item>
          <el-input
            style="width: 300px"
            v-model="form.cont"
            placeholder="用户姓名、类型、关键字模糊查询">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="用户ID">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户名称">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.telphone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="第三方账号">
          <template slot-scope="scope">
            <span>{{scope.row.openid}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="个性签名">
          <template slot-scope="scope">
            <span>{{scope.row.introduction}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="歌单数">
          <template slot-scope="scope">
            <span>{{scope.row.songSheetCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">
            <span>{{scope.row.identity}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册时间">
          <template slot-scope="scope">
            <span>{{scope.row.signUpTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.status === 0 ? '正常' : '停封'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleSelect(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :current-page="current"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getUserList } from '../../../../server/user';

  export default {
    name: 'User',
    data () {
      return {
        form: {
          cont: ''
        },
        list: [],
        current: 1,
        total: 0
      };
    },
    created () {
      this.getUserData({
        current: 1,
        size: 10
      });
    },
    methods: {
      getUserData (params) {
        getUserList('member/memberList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getUserData({
          current: 1,
          size: 10,
          keyWord: this.form.cont
        });
      },
      handleCurrentChange (val) {
        this.getUserData({
          current: val,
          size: 10,
          keyWord: this.form.cont
        });
      },
      handleSelect (row) {
        this.$emit('changeJump', row);
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>

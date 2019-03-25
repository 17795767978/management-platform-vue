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
            placeholder="用户ID、用户昵称、手机号">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.identity">
            <el-option
              v-for="item in form.identityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.closure">
            <el-option
              v-for="item in form.closureOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="list"
        size="small"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="用户ID">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="头像" width="70">
          <template slot-scope="scope">
            <span><img width="50" v-if="scope.row.headImage" :src="scope.row.headImage" alt=""></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户昵称">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册账号">
          <template slot-scope="scope">
            <span>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="歌单数">
          <template slot-scope="scope">
            <span>{{scope.row.songSheetCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="粉丝数">
          <template slot-scope="scope">
            <span>{{scope.row.fansCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="认证身份">
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
            <span>{{scope.row.closure === 0 ? '正常' : '停封'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="$router.push({
                name: 'UserDetail',
                query: {
                  id: scope.row.id,
                  bandId: scope.row.bandId
                }
              })">查看</el-button>
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
  import { getUserList } from '../../server/user';

  export default {
    name: 'User',
    data () {
      return {
        form: {
          cont: '',
          identity: 'all',
          identityOptions: [{
            value: 'all',
            label: '认证身份-全部'
          }, {
            value: 'chapter',
            label: '队长'
          }, {
            value: 'member',
            label: '队员'
          }, {
            value: 'musician',
            label: '音乐人'
          }, {
            value: 'empty',
            label: '未认证'
          }],
          closure: 0,
          closureOptions: [{
            value: 0,
            label: '正常'
          }, {
            value: 1,
            label: '封禁'
          }]
        },
        list: [],
        current: 1,
        total: 0
      };
    },
    created () {
      this.getUserData({
        current: 1,
        size: 10,
        identity: this.form.identity,
        closure: this.form.closure,
        virtual: 0,
        musician: 0
      });
    },
    methods: {
      getUserData (params) {
        getUserList('musician/musicianList', params).then(res => {
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
          keyWord: this.form.cont,
          identity: this.form.identity,
          closure: this.form.closure,
          virtual: 0,
          musician: 0
        });
      },
      handleCurrentChange (val) {
        this.getUserData({
          current: val,
          size: 10,
          keyWord: this.form.cont,
          identity: this.form.identity,
          closure: this.form.closure,
          virtual: 0,
          musician: 0
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>

<template>
  <div class="wrapper">
    <div class="search">
      <el-form
        class="fl"
        :inline="true"
        :model="form">
        <el-form-item>
          <el-input
            style="width: 350px"
            v-model="form.cont"
            placeholder="用户名称">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.statusUser">
            <el-option
              v-for="item in form.statusUsers"
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
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="用户id">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="头像">
          <template slot-scope="scope">
            <img width="80" height="80" :src="scope.row.headImage" alt="">
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
        <el-table-column align="center" label="照片">
          <template slot-scope="scope">
            <img width="80" height="80" :src="scope.row.picture" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系电话">
          <template slot-scope="scope">
            <span>{{scope.row.telephone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="擅长技能">
          <template slot-scope="scope">
            <span>{{scope.row.certifiedInstrument}}</span>
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
        <el-table-column align="center" label="申请时间">
          <template slot-scope="scope">
            <span>{{scope.row.auditTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.auditStateName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="$router.push({
                name: 'musicianDetail',
                query: {
                  id: scope.row.id
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

<script type="text/ecmascript-6">
import {auditMusicianList} from 'server/musician';
import {ERR_OK} from 'config/env.js';
export default {
  name: 'musiciansExamine',
  data () {
    return {
      form: {
        cont: '',
        status: '认证行为',
        statusUser: 0,
        statusOptions: [{value: '乐队认证'}, {value: '乐队认领'}],
        statusUsers: [{value: 0, label: '已申请'}, {value: 1, label: '审核通过'}, {value: 2, label: '驳回'}]
      },
      total: 0,
      current: 1,
      list: []
    };
  },
  created () {
    this.handleSearch({
      current: 1,
      size: 10,
      keyWord: this.form.cont,
      auditState: this.form.statusUser
    });
  },
  methods: {
    handleSearch (params) {
      auditMusicianList('/musician/auditMusicianList', {
        keyWord: this.form.cont,
        auditState: this.form.statusUser
      }).then(res => {
        if (res.code === ERR_OK) {
          this.list = res.data.records;
          if (this.list.length === ERR_OK) {
            this.$message.error('未查找到任何信息');
          }
        }
      });
    },
    handleCurrentChange (val) {
      this.handleSearch({
        current: val,
        size: 10,
        keyWord: this.form.cont,
        auditState: this.form.statusUser
      });
    }
  }
};

</script>

<style lang="scss" scoped>
</style>

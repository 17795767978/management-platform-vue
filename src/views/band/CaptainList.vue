<template>
  <div>
    <div class="wrapper">
      <div class="search">
        <el-form
          class="fl"
          :inline="true"
          :model="captainForm">
          <el-form-item>
            <el-input
              style="width: 350px"
              v-model="captainForm.cont"
              placeholder="用户名称、角色、关键字模糊查询">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleCaptainSearch">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table">
        <el-table
          :data="captainList"
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
          <el-table-column align="center" label="归属乐队">
            <template slot-scope="scope">
              <span>{{scope.row.ascriptionBand}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="认证乐器">
            <template slot-scope="scope">
              <span>{{scope.row.certifiedInstrument}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="注册时间">
            <template slot-scope="scope">
              <span>{{scope.row.signUpTime}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="状态">
            <template slot-scope="scope">
              <span>{{scope.row.status === 0 ? '正常' : '封禁'}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" @click="handleCaptain(scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          background
          :page-size="5"
          :current-page="captainCurrent"
          @current-change="handleCaptainCurrentChange"
          layout="total, prev, pager, next, jumper"
          :total="captainTotal">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import { getBandMemberList } from '../../server/content';

  export default {
    name: 'CaptainList',
    data () {
      return {
        captainForm: {
          cont: ''
        },
        captainList: [],
        captainCurrent: 1,
        captainTotal: 0
      };
    },
    props: ['bandId'],
    created () {
      this.getMemberData({
        current: 1,
        size: 5,
        bandId: this.bandId
      });
    },
    methods: {
      getMemberData (params) {
        getBandMemberList('bandInfo/bandMemberList', params).then(res => {
          if (res.code === 0) {
            this.captainList = res.data.records;
            this.captainTotal = res.data.total;
          }
        });
      },
      handleCaptainSearch () {
        this.getMemberData({
          current: 1,
          size: 5,
          bandId: this.bandId,
          keyWord: this.captainForm.cont
        });
      },
      handleCaptainCurrentChange (val) {
        this.getMemberData({
          current: val,
          size: 5,
          bandId: this.bandId,
          keyWord: this.captainForm.cont
        });
      },
      handleCaptain (row) {
        this.$emit('selectCaptain', {
          id: row.id,
          bandId: this.bandId
        });
      }
    }
  };
</script>

<style scoped>

</style>

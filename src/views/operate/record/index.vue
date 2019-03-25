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
            placeholder="操作人、操作对象">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="操作人">
          <template slot-scope="scope">
            <span>{{scope.row.userName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作对象">
          <template slot-scope="scope">
            <span>{{scope.row.operateObject}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作类型">
          <template slot-scope="scope">
            <span>{{scope.row.operationType|getOperationText()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|parseTime()}}</span>
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
  import { getLogList } from '../../../server/sys';
  import { getOperationText, parseTime } from '../../../filter';

  export default {
    name: 'Record',
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
      this.getLogData({
        current: 1,
        size: 10
      });
    },
    filters: {
      getOperationText,
      parseTime
    },
    methods: {
      getLogData (params) {
        getLogList('sys/log/page', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      onSearch () {
        this.getLogData({
          cond: this.form.cont,
          current: 1,
          size: 10
        });
      },
      handleCurrentChange (val) {
        this.getLogData({
          cond: this.form.cont,
          current: val,
          size: 10
        });
      }
    }
  };
</script>

<style scoped>

</style>

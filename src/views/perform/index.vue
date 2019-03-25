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
            placeholder="演出标题、演出城市、演出地点">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button class="fr" type="primary" @click="$router.push({name: 'performEntry'})">新建演出</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="演出标题">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.start_time|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.end_time|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="演出城市">
          <template slot-scope="scope">
            <span>{{scope.row.province_name}}--{{scope.row.city_name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="演出地点" width="130">
          <template slot-scope="scope">
            <span>{{scope.row.address}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="130">
          <template slot-scope="scope">
            <span>{{scope.row.timeStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="演出标签" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.tagName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="$router.push({
                name: 'performEntry',
                query: {
                  id: scope.row.id
                }
              })"
              type="primary">编辑</el-button>
            <el-button
              size="mini"
              type="primary"
              @click="$router.push({
                name: 'performDetail',
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

<script>
  import { getPerformanceList } from '../../server/content';
  import { parseTime } from '../../filter';

  export default {
    name: 'Perform',
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
      this.getPerformanceData({
        current: 1,
        size: 10
      });
    },
    filters: {
      parseTime
    },
    methods: {
      getPerformanceData(params) {
        getPerformanceList('performanceInfo/page', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getPerformanceData({
          current: 1,
          size: 10,
          cond: this.form.cont
        });
      },
      handleCurrentChange (val) {
        this.getPerformanceData({
          current: val,
          size: 10,
          cond: this.form.cont
        });
      }
    }
  };
</script>

<style scoped>

</style>

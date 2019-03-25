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
            placeholder="音频标题、乐队名称、音频标签、专辑名称">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">搜索</el-button>
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
        <el-table-column align="center" label="举报类型">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="举报人">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="举报内容">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">
            <span></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :current-page="1"
        layout="total, prev, pager, next, jumper"
        :total="0">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Report',
    data () {
      return {
        form: {
          cont: ''
        },
        list: []
      };
    }
  };
</script>

<style scoped>

</style>

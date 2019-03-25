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
            placeholder="乐队、风格标签">
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
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="乐队标题">
          <template slot-scope="scope">
            <span>{{scope.row.bandName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="乐队队长">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="专辑数">
          <template slot-scope="scope">
            <span>{{scope.row.albumCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="音频数">
          <template slot-scope="scope">
            <span>{{scope.row.musicCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="视频数">
          <template slot-scope="scope">
            <span>{{scope.row.videoCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
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
  import { getBandList } from '../../../../server/content';

  export default {
    name: 'Band',
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
      this.getBandData({
        current: 1,
        size: 10
      });
    },
    methods: {
      getBandData (params) {
        getBandList('bandInfo/bandList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getBandData({
          current: 1,
          size: 10,
          keyWord: this.form.cont
        });
      },
      handleCurrentChange (val) {
        this.getBandData({
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
<style lang="scss">
  .wrapper {
    .banner-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .banner-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 180px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }
    .avatar {
      width: 180px;
      height: 120px;
      display: block;
    }
  }
</style>

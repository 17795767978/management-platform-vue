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
            placeholder="音频标题、乐队名称、音频标签、专辑名称">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.status"
            placeholder="请选择音频状态">
            <el-option label="已下架" value="0"></el-option>
            <el-option label="已上架" value="1"></el-option>
            <el-option label="审核中" value="2"></el-option>
            <el-option label="未发布" value="3"></el-option>
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
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="音频标题">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="点播数">
          <template slot-scope="scope">
            <span>{{scope.row.playCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收藏数">
          <template slot-scope="scope">
            <span>{{scope.row.likeCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="评论数">
          <template slot-scope="scope">
            <span>{{scope.row.commentsCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="音频归属">
          <template slot-scope="scope">
            <span>{{scope.row.ascriptionName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="归属专辑">
          <template slot-scope="scope">
            <span>{{scope.row.albumTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="播放时长">
          <template slot-scope="scope">
            <span>{{scope.row.media_time}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布时间">
          <template slot-scope="scope">
            <span>{{scope.row.submitTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.status}}</span>
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
  import { getAudioList } from '../../../../server/content';

  export default {
    name: 'ContentAudio',
    data () {
      return {
        form: {
          cont: '',
          status: ''
        },
        list: [],
        current: 1,
        total: 0
      };
    },
    created () {
      this.getAudioData({
        current: 1,
        size: 10
      });
    },
    methods: {
      getAudioData (params) {
        getAudioList('musicInfo/musicList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getAudioData({
          current: 1,
          size: 10,
          keyWord: this.form.cont,
          auditStatus: this.form.status
        });
      },
      handleCurrentChange (val) {
        this.getAudioData({
          current: val,
          size: 10,
          keyWord: this.form.cont,
          auditStatus: this.form.status
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

<template>
  <div>
    <div class="search">
      <el-form
        class="fl"
        :inline="true"
        :model="form">
        <el-form-item>
          <el-input
            style="width: 300px"
            v-model="form.cont"
            placeholder="视频标题、视频归属、视频标签">
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
        <el-table-column align="center" label="视频标题">
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
        <el-table-column align="center" label="视频归属">
          <template slot-scope="scope">
            <span>{{scope.row.ascriptionName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="播放时长">
          <template slot-scope="scope">
            <span>{{scope.row.mediaTime}}</span>
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
            <el-button type="primary" @click="handleAddVideo(scope.row.id)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :page-size="5"
        :current-page="current"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getVideoList } from '../../../server/content';

  export default {
    name: 'HomeVideo',
    data () {
      return {
        form: {
          cont: '',
          status: 1
        },
        list: [],
        current: 1,
        total: 0
      };
    },
    created () {
      this.getVideoData({
        current: 1,
        size: 5,
        auditStatus: this.form.status
      });
    },
    methods: {
      getVideoData (params) {
        getVideoList('videoInfo/videoList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleCurrentChange (val) {
        this.getVideoData({
          current: val,
          size: 5,
          keyWord: this.form.cont,
          auditStatus: this.form.status
        });
      },
      handleSearch () {
        this.getVideoData({
          current: 1,
          size: 5,
          keyWord: this.form.cont,
          auditStatus: this.form.status
        });
      },
      handleAddVideo (id) {
        this.$emit('selectVideo', id);
      }
    }
  };
</script>

<style scoped>

</style>

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
            placeholder="视频标题">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="form.status"
            placeholder="请选择视频状态">
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
      <el-button
        class="fr"
        type="primary"
        @click="$router.push({name: 'addVideo'})"
      >添加视频</el-button>
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
        <el-table-column align="center" label="是否转码">
          <template slot-scope="scope">
            <span>{{scope.row.mediaOutStatus}}</span>
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
            <el-button size="mini" type="primary" @click="$router.push({
                name: 'videoDetail',
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
  import { getVideoList } from '../../../server/content';

  export default {
    name: 'ContentVideo',
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
      this.getVideoData({
        current: 1,
        size: 10
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
      // goTodetail (row) {
      //   console.log(row);
      //   getVideoDetail('/videoInfo/videoDetails', {
      //     videoId: row.id
      //   }).then(res => {
      //     if (res.code === 0) {
      //       console.log(res.data);
      //       sessionStorage.setItem('getVideoDetail', JSON.stringify(res.data));
      //       this.$router.push({
      //         path: '/content/video-detail'
      //       });
      //     }
      //   });
      // },
      handleCurrentChange (val) {
        this.getVideoData({
          current: val,
          size: 10,
          keyWord: this.form.cont,
          auditStatus: this.form.status
        });
      },
      handleSearch () {
        this.getVideoData({
          current: 1,
          size: 10,
          keyWord: this.form.cont,
          auditStatus: this.form.status
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>

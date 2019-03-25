<template>
  <div class="wrapper">
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
              <el-button
                size="mini"
                type="primary"
                @click="selectAudio(scope.row.id)">添加</el-button>
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
  </div>
</template>

<script>
  import { getAudioList } from '../../../server/content';

  export default {
    name: 'HomeAudioList',
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
      this.getAudioData({
        current: 1,
        size: 5,
        auditStatus: this.form.status
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
          size: 5,
          keyWord: this.form.cont,
          auditStatus: this.form.status
        });
      },
      handleCurrentChange (val) {
        this.getAudioData({
          current: val,
          size: 5,
          keyWord: this.form.cont,
          auditStatus: this.form.status
        });
      },
      selectAudio (id) {
        this.$emit('selectAudio', id);
      }
    }
  };
</script>

<style lang="scss" scoped>

</style>

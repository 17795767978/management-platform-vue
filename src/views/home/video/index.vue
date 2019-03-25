<template>
  <div class="wrapper">
    <el-row
      type="flex"
      justify="space-between"
      align="middle">
      <el-col :span="6">
        首页显示视频推荐
      </el-col>
      <el-col :span="6">
        <div class="fr">
          <el-button type="primary" @click="handleSort">完成排序</el-button>
          <el-button v-if="list.length < 3" type="primary" @click="dialogVisible=true">添加视频</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
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
        <el-table-column align="center" label="点播数" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.playCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收藏数" width="80">
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
            <span>{{scope.row.submitTime|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.viewStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="$router.push({
                name: 'videoDetail',
                query: {
                  id: scope.row.videoId
                }
              })">查看</el-button>
            <el-button
              @click="handleRemove(scope.row.id)"
              v-if="list.length > 1"
              size="mini"
              type="primary">
              删除
            </el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="拖拽" width="80">
          <template slot-scope="scope">
              <span>
                <i class="fa fa-arrows drag-handler"></i>
              </span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="1400px">
      <video-list v-if="dialogVisible" @selectVideo="selectVideo"></video-list>
    </el-dialog>
  </div>
</template>

<script>
  import { getHomeVideoList, removeHomeVideo, addRecommendVideo, sortVideo } from '../../../server/home';
  import VideoList from './List';
  import Sortable from 'sortablejs';

  export default {
    name: 'HomeVideo',
    data () {
      return {
        list: [],
        dialogVisible: false,
        sortable: null
      };
    },
    created () {
      this.getHomeVideoData();
    },
    components: {
      VideoList
    },
    methods: {
      getHomeVideoData () {
        getHomeVideoList('audio/recommend/index/video/list').then(res => {
          if (res.code === 0) {
            this.list = res.data;
            this.$nextTick(() => {
              this.setSort();
            });
          }
        });
      },
      handleRemove (id) {
        removeHomeVideo('audio/recommend/index/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getHomeVideoData();
          }
        });
      },
      selectVideo (id) {
        addRecommendVideo('audio/recommend/index/add', {
          mediaType: 0,
          id
        }).then(res => {
          if (res.code === 0) {
            this.dialogVisible = false;
            this.getHomeVideoData();
            this.$message.success('添加成功！');
          }
        });
      },
      setSort () {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '');
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0];
            this.list.splice(evt.newIndex, 0, targetRow);
          }
        });
      },
      handleSort () {
        let orderIds = this.list.map(item => item.id);
        sortVideo('audio/recommend/index/order/update', {
          mediaType: 0,
          orderIds: orderIds.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('完成排序！');
            this.getHomeVideoData();
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>

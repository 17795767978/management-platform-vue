<template>
  <div class="wrapper">
    <el-row
      type="flex"
      justify="space-between"
      align="middle">
      <el-col :span="6">首页显示音频推荐</el-col>
      <el-col :span="6">
        <div class="fr">
          <el-button type="primary" @click="handleSort">
            完成排序
          </el-button>
          <el-button
            v-if="audioList.length < 6"
            type="primary"
            @click="dialogVisible=true">添加音频</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="audioList"
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
          <el-table-column align="center" label="评论数" width="80">
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
          <el-table-column align="center" label="音频操作">
            <template slot-scope="scope">
              <el-button
                @click="$router.push({
                  name: 'audioDetail',
                  query: {
                    id: scope.row.audioId
                  }
                })"
                size="mini"
                type="primary">查看</el-button>
              <el-button
                v-if="audioList.length > 4"
                size="mini"
                type="primary"
                @click="handleRemove(scope.row.id)">删除</el-button>
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
      </el-col>
    </el-row>
    <audio-group></audio-group>
    <el-dialog
      title="添加音频"
      :visible.sync="dialogVisible"
      width="1200px">
      <audio-list v-if="dialogVisible" @selectAudio="selectAudio"></audio-list>
    </el-dialog>
  </div>
</template>

<script>
  import { getHomeAudioList, removeHomeAudio, addHomeAudio, sortAudio } from '../../../server/home';
  import { parseTime } from '../../../filter';
  import Sortable from 'sortablejs';
  import AudioList from './List';
  import AudioGroup from './Group';

  export default {
    name: 'HomeAudio',
    data () {
      return {
        audioList: [],
        sortable: null,
        dialogVisible: false
      };
    },
    created () {
      this.getHomeAudioData();
    },
    filters: {
      parseTime
    },
    components: {
      AudioList,
      AudioGroup
    },
    methods: {
      getHomeAudioData () {
        getHomeAudioList('audio/recommend/index/list').then(res => {
          if (res.code === 0) {
            this.audioList = res.data;
            this.$nextTick(() => {
              this.setSort();
            });
          }
        });
      },
      handleRemove (id) {
        removeHomeAudio('audio/recommend/index/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功!');
            this.getHomeAudioData();
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
            const targetRow = this.audioList.splice(evt.oldIndex, 1)[0];
            this.audioList.splice(evt.newIndex, 0, targetRow);
          }
        });
      },
      selectAudio (id) {
        addHomeAudio('audio/recommend/index/add', {
          id: id,
          mediaType: 1
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('添加成功！');
            this.dialogVisible = false;
            this.getHomeAudioData();
          }
        });
      },
      handleSort () {
        let sortIds = this.audioList.map(item => item.id);
        sortAudio('audio/recommend/index/order/update', {
          mediaType: 1,
          orderIds: sortIds.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('排序成功！');
            this.getHomeAudioData();
          }
        });
      }
    }
  };
</script>

<template>
  <div class="group">
    <el-row>
      <el-col :span="24">
        <div class="fr">
          <el-button type="primary" @click="handleCreateGroup">新建推荐分组</el-button>
        </div>
      </el-col>
    </el-row>
    <div v-for="(item, index) in groupList" :key="index">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="10">
          <span>推荐分组：{{item.groupTitle}}</span>
        </el-col>
        <el-col :span="14">
          <div class="fr">
            <el-button type="primary" @click="handleSort(item.id, index)">完成排序</el-button>
            <el-button type="primary" @click="handleAddGroupAudio(item.id)">添加音频</el-button>
            <el-button type="primary" @click="handleRemoveGroup(item.id)">删除分组</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-table
          class="group-tab"
          :data="item.children"
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
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                @click="$router.push({
                  name: 'audioDetail',
                  query: {
                    id: scope.row.audioId
                  }
                })"
                type="primary"
                size="mini">查看</el-button>
              <el-button type="primary" size="mini" @click="handleRemoveAudio(scope.row.id)">删除</el-button>
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
    </div>
    <el-dialog
      title="新建推荐分组"
      :visible.sync="dialogVisible"
      width="360px">
      <div>
        <span>分组名称：</span>
        <el-input style="width: 240px" v-model="groupTitle" placeholder="请输入分组名称"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddGroup">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="添加音频"
      :visible.sync="audioVisible"
      width="1200px">
      <audio-list v-if="audioVisible" @selectAudio="selectAudio"></audio-list>
    </el-dialog>
  </div>
</template>

<script>
  import { addGroup, getMoreAudioList, removeGroup, addRecommendAudio, sortGroupAudio } from '../../../server/home';
  import AudioList from './List';
  import Sortable from 'sortablejs';
  import { parseTime } from '../../../filter';

  export default {
    name: 'HomeAudioGroup',
    data () {
      return {
        dialogVisible: false,
        audioVisible: false,
        groupTitle: '',
        groupList: [],
        groupId: '',
        sortables: []
      };
    },
    created () {
      this.getMoreAudioData();
    },
    filters: {
      parseTime
    },
    components: {
      AudioList
    },
    methods: {
      getMoreAudioData () {
        getMoreAudioList('media/recommend/more/list').then(res => {
          if (res.code === 0) {
            this.groupList = res.data;
            this.$nextTick(() => {
              this.setSort();
            });
          }
        });
      },
      handleCreateGroup () {
        this.dialogVisible = true;
        this.groupTitle = '';
      },
      handleAddGroup () {
        addGroup('media/recommend/more/group/add', {
          groupTitle: this.groupTitle
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('新建成功！');
            this.getMoreAudioData();
            this.dialogVisible = false;
          }
        });
      },
      handleRemoveGroup (id) {
        removeGroup('media/recommend/more/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getMoreAudioData();
          }
        });
      },
      handleAddGroupAudio (id) {
        this.groupId = id;
        this.audioVisible = true;
      },
      selectAudio (id) {
        addRecommendAudio('media/recommend/more/media/add', {
          groupId: this.groupId,
          mediaId: id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('添加成功！');
            this.audioVisible = false;
            this.getMoreAudioData();
          }
        });
      },
      handleRemoveAudio (id) {
        removeGroup('media/recommend/more/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getMoreAudioData();
          }
        });
      },
      setSort () {
        const els = document.querySelectorAll('.group-tab .el-table__body-wrapper > table > tbody');
        let elsArr = Array.from(els);
        elsArr.forEach((item, index) => {
          this.sortables[index] = Sortable.create(item, {
            ghostClass: 'sortable-ghost',
            setData: function(dataTransfer) {
              dataTransfer.setData('Text', '');
            },
            onEnd: evt => {
              const targetRow = this.groupList[index].children.splice(evt.oldIndex, 1)[0];
              this.groupList[index].children.splice(evt.newIndex, 0, targetRow);
            }
          });
        });
      },
      handleSort (id, index) {
        const sortIds = this.groupList[index].children.map(el => el.id);
        sortGroupAudio('media/recommend/more/order/update', {
          groupId: id,
          orderIds: sortIds.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('排序成功！');
            this.getMoreAudioData();
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .drag-handler {
    font-size: 20px;
    cursor: pointer;
  }
</style>
<style>
  .sortable-ghost {
    opacity: .8;
    color: #fff!important;
    background: #42b983!important;
  }
</style>

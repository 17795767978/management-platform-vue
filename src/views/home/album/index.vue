<template>
  <div class="wrapper">
    <el-row
      type="flex"
      justify="space-between"
      align="middle">
      <el-col :span="6">
        首页显示专辑推荐
      </el-col>
      <el-col :span="6">
        <div class="fr">
          <el-button type="primary" @click="handleSort">完成排序</el-button>
          <el-button type="primary" @click="dialogVisible=true">添加专辑</el-button>
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
        <el-table-column align="center" label="专辑标题">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="点播数">
          <template slot-scope="scope">
            <span>{{scope.row.playCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="归属">
          <template slot-scope="scope">
            <span>{{scope.row.ascriptionName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="曲目数">
          <template slot-scope="scope">
            <span>{{scope.row.musicCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布时间">
          <template slot-scope="scope">
            <span>{{scope.row.pubTime|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="$router.push({
                name: 'albumDetail',
                query: {
                  id: scope.row.albumId
                }
              })">查看</el-button>
            <el-button
              @click="handleRemove(scope.row.id)"
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
      <album-list v-if="dialogVisible" @selectAlbum="selectAlbum"></album-list>
    </el-dialog>
  </div>
</template>

<script>
  import { getHomeAlubmList, removeHomeAlbum, sortAlbum, addHomeAlbum } from '../../../server/home';
  import Sortable from 'sortablejs';
  import AlbumList from './List';
  import {parseTime} from '../../../filter';

  export default {
    name: 'HomeAlbum',
    data () {
      return {
        list: [],
        dialogVisible: false,
        sortable: null
      };
    },
    created () {
      this.getHomeAlubmData();
    },
    components: {
      AlbumList
    },
    filters: {
      parseTime
    },
    methods: {
      getHomeAlubmData () {
        getHomeAlubmList('albumRecommend/list').then(res => {
          if (res.code === 0) {
            this.list = res.data;
            this.$nextTick(() => {
              this.setSort();
            });
          }
        });
      },
      handleRemove (id) {
        removeHomeAlbum('albumRecommend/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getHomeAlubmData();
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
        sortAlbum('albumRecommend/order/update', {
          orderIds: orderIds.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('完成排序！');
            this.getHomeAlubmData();
          }
        });
      },
      selectAlbum (id) {
        addHomeAlbum('albumRecommend/add', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.dialogVisible = false;
            this.getHomeAlubmData();
            this.$message.success('添加成功！');
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>

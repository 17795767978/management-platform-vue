<template>
  <div class="wrapper">
    <el-row
      type="flex"
      justify="space-between"
      align="middle">
      <el-col :span="6">
        首页显示乐队推荐
      </el-col>
      <el-col :span="6">
        <div class="fr">
          <el-button type="primary" @click="handleSort">完成排序</el-button>
          <el-button v-if="list.length < 20" type="primary" @click="dialogVisible=true">添加乐队</el-button>
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
        <el-table-column align="center" label="乐队标题">
          <template slot-scope="scope">
            <span>{{scope.row.bandName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="乐队队长">
          <template slot-scope="scope">
            <span>{{scope.row.bandHeader}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="专辑数">
          <template slot-scope="scope">
            <span>{{scope.row.albumCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="音频数">
          <template slot-scope="scope">
            <span>{{scope.row.audioCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="视频数">
          <template slot-scope="scope">
            <span>{{scope.row.videoCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              @click="$router.push({
              path: '/band/band-detail',
              query: {
                id: scope.row.bandId
              }
            })"
              size="mini"
              type="primary">查看</el-button>
            <el-button
              @click="handleRemoveBand(scope.row.id)"
              v-if="list.length > 3"
              size="mini"
              type="primary">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="拖拽">
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
      <band-list v-if="dialogVisible" @selectBand="selectBand"></band-list>
    </el-dialog>
  </div>
</template>

<script>
  import { getHomeBandList, addHomeBand, removeHomeBand, sortBand } from '../../../server/home';
  import { parseTime } from '../../../filter';
  import BandList from './List';
  import Sortable from 'sortablejs';

  export default {
    name: 'HomeBand',
    data () {
      return {
        list: [],
        dialogVisible: false,
        sortable: null
      };
    },
    created () {
      this.getBandData();
    },
    filters: {
      parseTime
    },
    components: {
      BandList
    },
    methods: {
      getBandData () {
        getHomeBandList('bandRecommend/page').then(res => {
          if (res.code === 0) {
            this.list = res.data;
            this.$nextTick(() => {
              this.setSort();
            });
          }
        });
      },
      selectBand (id) {
        addHomeBand('bandRecommend/add', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.dialogVisible = false;
            this.$message.success('添加成功！');
            this.getBandData();
          }
        });
      },
      handleRemoveBand (id) {
        removeHomeBand('bandRecommend/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getBandData();
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
        sortBand('bandRecommend/order/update', {
          orderIds: orderIds.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('排序成功！');
            this.getBandData();
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>

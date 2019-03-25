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
            placeholder="专辑标题">
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
            <span>{{scope.row.pubTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="$router.push({
                name: 'albumDetail',
                query: {
                  id: scope.row.id
                }
              })"
            >
              查看
            </el-button>
            <el-button size="mini" type="primary" @click="handleAddAlbum(scope.row.id)">添加</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :current-page="current"
        :page-size="5"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getAlbumForHoyo } from '../../../server/home';

  export default {
    name: 'AlbumList',
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
      this.getAlbumData({
        current: 1,
        size: 5
      });
    },
    methods: {
      getAlbumData (params) {
        getAlbumForHoyo('album/albumPageForHoyo', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getAlbumData({
          current: 1,
          size: 5,
          cond: this.form.cont
        });
      },
      handleCurrentChange (val) {
        this.getAlbumData({
          current: val,
          size: 5,
          cond: this.form.cont
        });
      },
      handleAddAlbum (id) {
        this.$emit('selectAlbum', id);
      }
    }
  };
</script>

<style scoped>

</style>

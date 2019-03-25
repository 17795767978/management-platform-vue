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
            placeholder="专辑标题、乐队名称">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button class="fr" @click="$router.push({path: 'add-album'})" type="primary">添加专辑</el-button>
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
            <span>{{scope.row.play_count}}</span>
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
                path: '/content/album-detail',
                query: {
                  id: scope.row.id
                }
              })"
            >
              查看
            </el-button>
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
  import { getAlbumList } from '../../../server/content';

  export default {
    name: 'Album',
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
        size: 10
      });
    },
    methods: {
      getAlbumData (params) {
        getAlbumList('album/albumList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getAlbumData({
          current: 1,
          size: 10,
          keyWord: this.form.cont
        });
      },
      handleCurrentChange (val) {
        this.getAlbumData({
          current: val,
          size: 10,
          keyWord: this.form.cont
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>

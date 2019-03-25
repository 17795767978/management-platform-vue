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
            placeholder="评论内容">
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
        <el-table-column align="center" label="归属">
          <template slot-scope="scope">
            <span>{{scope.row.ascriptionName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="评论人">
          <template slot-scope="scope">
            <span>{{scope.row.commentatorName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="评论时间">
          <template slot-scope="scope">
            <span>{{scope.row.commentatorTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="回复人">
          <template slot-scope="scope">
            <span>{{scope.row.replyName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="回复时间">
          <template slot-scope="scope">
            <span>{{scope.row.replyTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="$router.push({
                path: '/content/comments-detail',
                query: {
                  id: scope.row.commentatorId,
                  replyId: scope.row.replyId
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
  import { getCommentList } from '../../../server/content';

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
      this.getCommentData({
        current: 1,
        size: 10
      });
    },
    methods: {
      getCommentData (params) {
        getCommentList('commentInfo/commentInfoList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getCommentData({
          current: 1,
          size: 10,
          keyword: this.form.cont
        });
      },
      handleCurrentChange (val) {
        this.getCommentData({
          current: val,
          size: 10,
          keyword: this.form.cont
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
</style>

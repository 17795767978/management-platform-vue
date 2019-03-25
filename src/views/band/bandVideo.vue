<template>
  <div>
    <el-table
    :data="videoInfoList"
    border
    style="width: 1460px; margin-left:2%">
    <el-table-column
    fixed
    align="center"
    prop="id"
    label="视频ID"
    width="100">
    </el-table-column>
    <el-table-column
    align="center"
    prop="title"
    label="视频标题"
    width="300">
    </el-table-column>
    <el-table-column
    prop="playCount"
    align="center"
    label="点播数"
    width="150">
    </el-table-column>
    <el-table-column
    prop="likeCount"
    align="center"
    label="收藏数"
    width="150">
    </el-table-column>
    <el-table-column
    prop="commentsCount"
    align="center"
    label="评论数"
    width="150">
    </el-table-column>
    <el-table-column
    prop="mediaTime"
    align="center"
    label="播放时长"
    width="200">
    </el-table-column>
    <el-table-column
    prop="submitTime"
    align="center"
    label="发布时间"
    width="250">
    </el-table-column>
    <el-table-column
    prop="status"
    label="状态"
    align="center"
    width="100">
    </el-table-column>
    <el-table-column
    fixed="right"
    label="操作"
    align="center"
    width="50">
    <template slot-scope="scope">
        <el-button @click="handleClickTable(scope.row)" type="text" size="small">查看</el-button>
    </template>
    </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      videoInfoList: {
        type: Array
      }
    },
    data () {
      return {
        dataList: []
      };
    },
    methods: {
      handleClickTable (row) {
        this.$router.push({
          path: '/content/video-detail',
          query: {
            id: row.id
          }
        });
      }
    }
  };
</script>

<style scoped lang="scss">
</style>

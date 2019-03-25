<template>
  <div>
    <el-table
    :data="bandAlbumList"
    border
    style="width: 1310px; margin-left:10%">
    <el-table-column
    fixed
    align="center"
    prop="id"
    label="音频ID"
    width="100">
    </el-table-column>
    <el-table-column
    align="center"
    prop="title"
    label="专辑标题"
    width="300">
    </el-table-column>
    <el-table-column
    prop="playCount"
    align="center"
    label="点播数"
    width="150">
    </el-table-column>
    <el-table-column
    prop="ascriptionName"
    align="center"
    label="归属"
    width="200">
    </el-table-column>
    <el-table-column
    prop="musicCount"
    align="center"
    label="曲目数"
    width="200">
    </el-table-column>
    <el-table-column
    prop="pubTime"
    label="发布时间"
    align="center"
    width="200">
    </el-table-column>
    <el-table-column
    fixed="right"
    label="操作"
    align="center"
    width="150">
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
      bandAlbumList: {
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
          path: '/content/album-detail',
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

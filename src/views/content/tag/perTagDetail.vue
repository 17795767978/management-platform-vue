<template>
 <div class="tag-detail">
   <el-row>
      <el-button style="width: 80%; margin-left: 10%;" type="primary">新建类型</el-button>
   </el-row>
   <hr />
   <div v-for="(tags, index) in perTagDetail" :key="index">
    <el-row :gutter="20">
    <el-col :span="18">
      <span style="font-size: 25px;">类型：{{tags.tagType.tagName}}</span>
    </el-col>
    <el-col :span="3">
      <el-button type="primary">新建标签</el-button>
    </el-col>
    <el-col :span="3">
      <el-button type="danger">删除该类型</el-button>
    </el-col>
    </el-row>
    <el-row>
     <el-table
        :data="tags.tagClassify"
        border
        style="width: 45%; margin-left: 20%">
        <el-table-column
        fixed
        align="center"
        prop="tagName"
        label="标签名"
        width="200">
        </el-table-column>
        <el-table-column
        prop="count"
        align="center"
        label="内容数"
        width="200">
        </el-table-column>
        <el-table-column
        prop="playCount"
        align="center"
        label="点播数"
        width="200">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="120">
        <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small">删除</el-button>
        </template>
        </el-table-column>
        </el-table>
      </el-row>
   </div>
 </div>
</template>

<script>
  export default {
    props: {
      perTagDetail: {
        type: Array
      }
    },
    data () {
      return {
        dataList: []
      };
    },
    methods: {
      handleClick (row, index) {
        console.log(row, index);
      }
    }
  };
</script>

<style scoped lang="scss">
</style>

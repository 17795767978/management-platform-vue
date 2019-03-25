<template>
  <div class="wrapper">
    <el-form label-width="120px">
      <el-form-item label="演出图片：">
        <img :src="performInfo.mainImage" alt="" width="180" height="120">
      </el-form-item>
      <el-form-item label="演出标题：">
        <span>{{performInfo.name}}</span>
      </el-form-item>
      <el-form-item label="演出标签：">
        <span>{{tags}}</span>
      </el-form-item>
      <el-form-item label="开始时间：">
        <span>{{performInfo.startTime|parseTime()}}</span>
      </el-form-item>
      <el-form-item label="结束时间：">
        <span>{{performInfo.endTime|parseTime()}}</span>
      </el-form-item>
      <el-form-item label="演出城市：">
        <span>{{performInfo.cityName}}</span>
      </el-form-item>
      <el-form-item label="演出场馆：">
        <span>{{performInfo.address}}</span>
      </el-form-item>
      <el-form-item label="演出详情图片：">
        <span v-for="(item, index) in detailImages" :key="index" style="padding-right: 20px;">
          <img :src="item" alt="" width="180" height="120">
        </span>
      </el-form-item>
      <el-form-item label="演出场馆详情：">
        <span v-for="(item, index) in venueImages" :key="index" style="padding-right: 20px;">
          <img :src="item" alt="" width="180" height="120">
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getPerformanceInfo } from '../../server/content';
  import { parseTime } from '../../filter';

  export default {
    name: 'PerformDetail',
    data () {
      return {
        performInfo: {
        },
        detailImages: [],
        venueImages: [],
        tags: ''
      };
    },
    created () {
      getPerformanceInfo('performanceInfo/info', {
        id: this.$route.query.id
      }).then(res => {
        if (res.code === 0) {
          this.performInfo = res.data.performanceInfo;
          this.tags = res.data.tags;
          this.detailImages = res.data.performanceInfo.detailPicture.split(',');
          this.venueImages = res.data.performanceInfo.informationPicture.split(',');
        }
      });
    },
    filters: {
      parseTime
    }
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    .pr40 {
      padding-right: 40px;
    }
  }
</style>

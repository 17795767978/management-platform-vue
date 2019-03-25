<template>
  <div class="band-detail">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-tabs v-model="activated" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <band-info @change="changeNum" :bandInfo="bandInfo" :bandMemberDetailsList="bandMemberDetailsList"></band-info>
          </el-tab-pane>
          <el-tab-pane label="乐队专辑" name="second">
            <band-audio :bandAlbumList="bandAlbumList"></band-audio>
          </el-tab-pane>
          <el-tab-pane label="乐队视频" name="third">
            <band-video :videoInfoList="videoInfoList"></band-video>
          </el-tab-pane>
          <el-tab-pane label="乐队日程" name="fourth">
            <band-event :bandInfo="bandInfo"></band-event>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // const today = new Date();
  import {getBandDetails} from 'server/content';
  import bandInfo from './bandInfo';
  import bandAudio from './bandAudio';
  import bandVideo from './bandVideo';
  import bandEvent from './bandEvent';
  export default {
    name: 'BandDetail',
    data () {
      return {
        activated: 'first',
        checkBand: false,
        bandInfo: {},
        bandAlbumList: [],
        bandMemberDetailsList: [],
        videoInfoList: [],
        dataList: []
      };
    },
    components: {
      bandInfo,
      bandAudio,
      bandVideo,
      bandEvent
    },
    methods: {
      handleClick (tab, event) {
        console.log(tab, event);
      },
      handleClickTable (row) {
        console.log(row);
      },
      _getBandDetails () {
        getBandDetails('/bandInfo/bandDetails', {
          id: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            this.bandInfo = res.data.bandInfo;
            this.bandAlbumList = res.data.bandAlbumList;
            this.bandMemberDetailsList = res.data.bandMemberDetailsList;
            this.videoInfoList = res.data.videoInfoList;
          }
        });
      },
      changeNum () {
        this._getBandDetails();
      }
    },
    activated () {
      console.log(123);
      this._getBandDetails();
    },
    created () {
      this._getBandDetails();
    }
  };
</script>

<style lang="scss" scoped>
.el-row {
  padding: 0 20px;
  box-sizing: border-box;
}
.logo {
  width: 200px;
  height: 200px;
  background-color: #aaa;
}
.banner {
  width: 267px;
  height: 200px;
  background-color: #aaa;
}
.el-tabs__nav-scroll {
  height: 60px;
}
.wrapper-event {
  background-color: #ffffff;
  color: #000;
  border-radius: 6px;
  padding: 10px 0;
  box-sizing: border-box;
  margin-bottom: 10px;
  .res-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .button{
    border: transparent;
    padding: 5px 10px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: rgba(242, 149, 67, 0.3);
    outline: none;
    font-size: 14px;
    letter-spacing: 2px;
  }
}
</style>

<template>
  <div class="album-detail">
    <div class="wrapper">
      <el-row :gutter="20">
        <el-col :span="20">
          <span>专辑名称：</span>
          <span>{{alibumDetail.title}}</span>
          <p v-if="editDetail === true">
            <span>修改专辑名称：</span>
            <el-input style="width: 250px;" type="text" v-model="AlbumTitle"></el-input>
          </p>
        </el-col>
        <el-col :span="4">
          <el-button v-show="!editDetail" type="primary" @click="editDetail = true">编辑</el-button>
          <el-button v-show="editDetail" type="primary" @click="changeTitle">保存</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <img v-if="alibumDetail.main_image && editDetail === false" :src="mainImage" width="300" height="300">
          <el-upload
            class="avatar-uploader"
            action=""
            :http-request="fnUploadRequests"
            v-else-if="alibumDetail.main_image && editDetail"
            >
            <img v-if="mainImage" :src="mainImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <img v-else src="http://iph.href.lu/370x40" alt="">
        </el-col>
        <el-col :span="14">
          <p>归属：{{alibumDetail.ascriptionName ? alibumDetail.ascriptionName : '好乐'}}</p>
          <p>发布时间：{{alibumDetail.pubTime}}</p>
          <el-row style="height: 30px;line-height: 30px;">
            <el-col :span="6">点播：{{alibumDetail.play_count}}</el-col>
            <el-col :span="12" v-show="editDetail">点播修改：<input  type="text" v-model="playNum" :placeholder="playNum"></el-col>
            <el-col :span="2" v-show="editDetail"><el-button type="primary" size="mini" @click="changePlayNum">保存</el-button></el-col>
          </el-row>
        </el-col>
        <el-col :span="4" v-show="!editDetail">
          <el-button
            type="primary"
            @click="$router.push({
              path: '/band/band-detail',
              query: {
                id: alibumDetail.ascription
              }
            })"
            >查看乐队</el-button>
        </el-col>
      </el-row>
    </div>
    <hr />
    <el-dialog title="选择专辑" :visible.sync="dialogTableAlbum">
      <span>搜索功能：</span>
      <el-input style="width: 40%;margin-bottom: 20px; margin-right: 20px;" placeholder="乐队标题" v-model="searchContent"></el-input>
      <el-button @click="searchBandTo" size="medium" type="primary">搜索专辑</el-button>
      <el-table :data="gridData">
        <el-table-column property="title" label="专辑名称" width="150"></el-table-column>
        <el-table-column property="ascriptionName" label="归属乐队" width="200"></el-table-column>
        <el-table-column property="musicCount" label="音频数量"></el-table-column>
        <el-table-column
        align="center"
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
            <el-button @click="changeAlbum(scope.row)" type="text" size="small">选择</el-button>
            <!-- <el-button v-if="editDetail === true" type="text" size="small">删除</el-button> -->
        </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="padding-left: 200px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="totalPage">
      </el-pagination>
    </el-dialog>
    <el-table
        :data="dataList"
        border
        style="width: 95%; margin-left: 2.5%">
        <el-table-column
        align="center"
        prop="title"
        label="音频标题"
        width="120">
        </el-table-column>
        <el-table-column
        align="center"
        prop="id"
        label="音频ID"
        width="100">
        </el-table-column>
        <el-table-column
        align="center"
        prop="playCount"
        label="点播数"
        width="100"
        >
        </el-table-column>
        <el-table-column
        align="center"
        prop="likeCount"
        label="收藏数"
        width="100"
        >
        </el-table-column>
        <el-table-column
        align="center"
        prop="commentsCount"
        label="评论数"
        width="100"
        >
        </el-table-column>
        <el-table-column
        align="center"
        prop="tag"
        label="音频标签"
        width="410"
        >
        </el-table-column>
        <el-table-column
        align="center"
        prop="ascriptionName"
        label="音频归属"
        width="120"
        >
        </el-table-column>
        <el-table-column
        align="center"
        prop="albumTitle"
        label="归属专辑"
        width="120"
        >
        </el-table-column>
        <el-table-column
        align="center"
        prop="media_time"
        label="播放时长"
        width="100"
        >
        </el-table-column>
        <el-table-column
        align="center"
        prop="submitTime"
        label="发布时间"
        width="250"
        >
        </el-table-column>
        <el-table-column
        align="center"
        prop="status"
        label="状态"
        width="100"
        >
        </el-table-column>
        <el-table-column
        align="center"
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
            <el-button @click="handleAudioDetail(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="openAlbumList(scope.row)" v-if="editDetail === true" type="text" size="small">移动</el-button>
            <!-- <el-button v-if="editDetail === true" type="text" size="small">删除</el-button> -->
        </template>
        </el-table-column>
    </el-table>
    <el-button
      type="primary"
      style="width: 94%; margin-left: 3%;margin-top: 20px;"
      v-show="editDetail"
      @click="$router.push({
        name: 'addAudio',
        query: {
          title: alibumDetail.title,
          id: alibumDetail.id,
          ascription: alibumDetail.ascription,
          ascriptionName: alibumDetail.ascriptionName
        }
      })"
      >
      添加音频
    </el-button>
    <hr />
    <br />
  </div>
</template>

<script>
import {
  getAlbumDetail,
  moveAlbum,
  signUpAblum,
  changePlayNum,
  bandAlbumList,
  HoyoAudio
} from 'server/status';
import {getAlbumList} from 'server/content';
import {doUpload} from 'utils/upload.js';
import {checkNumber} from 'utils/check.js';
export default {
  name: 'albumDetail',
  data () {
    return {
      editDetail: false,
      dialogTableVisible: false,
      dialogTableAlbum: false,
      alibumDetail: {},
      AlbumTitle: '',
      musicId: '',
      dataList: [],
      gridData: [],
      playNum: '',
      searchValue: '音频标题、乐队名称、音频标签、专辑名称',
      value: '',
      mainImage: '',
      searchContent: '',
      currentPage: 1,
      totalPage: ''
    };
  },
  methods: {
    handleAudioDetail (row) {
      this.$router.push({
        path: '/content/audio-detail',
        query: {
          id: row.id
        }
      });
    },
    openAlbumList (row) {
      this.musicId = row.id;
      this.dialogTableAlbum = true;
    },
    changeAlbum (row) {
      console.log(row);
      moveAlbum('/album/musicChangeAlbum', {
        albumId: row.id,
        musicId: this.musicId
      }).then(res => {
        if (res.code === 0) {
          this.dialogTableAlbum = false;
          this._getAlbumDetail();
        }
      });
    },
    changeTitle () {
      signUpAblum('/album/editAlbum', {
        id: this.alibumDetail.id,
        title: this.AlbumTitle,
        mainImage: this.mainImage
      }).then(res => {
        if (res.code === 0) {
          this._getAlbumDetail();
          this.editDetail = false;
        }
      });
    },
    changePlayNum () {
      checkNumber(this.playNum).then(() => {
        changePlayNum('/album/editAlbumPlayCount', {
          id: this.alibumDetail.id,
          playCount: this.playNum
        }).then(res => {
          if (res.code === 0) {
            this._getAlbumDetail();
            this.playNum = '';
          }
        });
      }).catch((err) => {
        this.$message.error(err);
      });
    },
    fnUploadRequests (option) {
      doUpload(option, 'image/band').then((res) => {
        this.mainImage = `${res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'))}`;
      });
    },
    _bandAlbumList (params) {
      console.log(this.alibumDetail);
      if (this.alibumDetail.ascription_type === 0) {
        HoyoAudio('/album/albumPageForHoyo', params).then(res => {
          if (res.code === 0) {
            this.gridData = res.data.records;
            this.totalPage = res.data.total;
          }
        });
      } else if (this.alibumDetail.ascription_type === 1) {
        bandAlbumList('/album/bandAlbumList', {
          bandId: this.alibumDetail.ascription,
          keyword: this.searchContent
        }).then(res => {
          if (res.code === 0) {
            this.gridData = res.data;
            this.totalPage = res.data.length;
          }
        });
      }
    },
    handleSizeChange (val) {
      console.log(val);
    },
    handleCurrentChange (val) {
      console.log(val);
      this.currentPage = val;
      this._bandAlbumList(
          {
          current: val,
          size: 10,
          keyWord: this.searchBand
        }
      );
    },
    searchBandTo () {
      this._bandAlbumList({
        current: 1,
        size: 10,
        cond: this.searchContent
      });
    },
    _getAlbumDetail () {
      getAlbumDetail('/album/albumDetails', {
        albumId: this.$route.query.id
      }).then(res => {
        if (res.code === 0) {
          this.alibumDetail = res.data;
          this.AlbumTitle = this.alibumDetail.title;
          this.dataList = res.data.musicList;
          this.mainImage = this.alibumDetail.main_image;
          console.log(res.data);
          this._bandAlbumList(
            {
              current: 1,
              size: 10,
              cond: this.searchContent
            }
          );
        }
      });
    },
    _getAlbumList () {
      getAlbumList('/album/albumList', {
        current: 1,
        size: 1000
      }).then(res => {
        if (res.code === 0) {
          // this.gridData = res.data.records;
          // console.log(this.gridData);
        }
      });
    }
  },
  created () {
    this._getAlbumDetail();
    this._getAlbumList();
  },
  activated () {
    this._getAlbumDetail();
  }
};
</script>

<style lang="scss" scoped>
.avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
</style>
<style lang="scss">
  .avatar-uploader .el-upload {
    width: 200px;
    height: 200px;
  }
</style>

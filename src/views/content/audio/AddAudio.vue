<template>
  <div class="wrapper">
    <div class="uplaod-wrapper">
      <el-row>
        <el-col :span="24">
          <div class="clearfix upload-video">
            <span class="text fl">第一步，上传音频</span>
          <el-upload
              ref="upload"
              class="fl"
              action=""
              accept="audio/*"
              :data="formData"
              :http-request="fnUploadRequests"
              :multiple="multiple"
              :before-upload="beforeUpload"
              :file-list="fileList"
              :limit="limit"
              :on-success="onSuccess"
              :auto-upload="autoUpload"
              >
              <el-button slot="trigger" size="large" type="primary">选取音频</el-button>
              <el-button style="margin-left: 10px;" size="middle" type="success" @click="submitUpload(fileList)">上传到服务器</el-button>
            </el-upload>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-show="mulList" class="audio-info">
      <h4>第二步，编辑音频信息</h4>
      <div v-for="(list, index) in apiData.list" :key="index" style="border-bottom: 1px solid #eee;border-top: 1px solid #eee; padding-top: 10px; box-sizing: border-box">
      <el-row style="line-height: 36px;">
        <el-col :span="20" style="margin-bottom: 20px;">
          <span>音频名称：</span>
          <el-input style="width: 200px;" v-model="list.title" placeholder="请输入音频名称"></el-input>
        </el-col>
        <el-col :span="20" style="margin-bottom: 20px;">
          <span>音频副标题：</span>
          <el-input style="width: 200px;" v-model="list.secondTitle" placeholder="请输入音频名称"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">
          <span>添加标签：</span>
          <el-button type="primary" @click="selectTags(index)">选择标签</el-button>
        </el-col>
        <el-col :span="6">
          <span>音频标签：</span>
          <span style="margin-right: 10px; line-height: 2" v-for="(tag, index) in musicTagValue[index]" :key="index">{{tag.replace(/\d+/g,'')}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="6">
          <div class="audio">
            <audio v-if="list.mediaUrl" controls width="370" id="time" ref="videoInfo" height="40" :src="list.mediaUrl"></audio>
            <img v-else src="http://iph.href.lu/370x40" alt="">
          </div>
        </el-col>
        <el-col :span="10">
          <p>播放时长：{{list.mediaTime}}</p>
          <p>文件数据：{{list.mediaSize}}</p>
          <p>文件路径：{{list.mediaUrl}}</p>
        </el-col>
      </el-row>
      </div>
    </div>
    <div v-show="!mulList" class="audio-info">
      <h4>第二步，编辑音频信息</h4>
      <el-row style="line-height: 36px;">
        <el-col :span="20" style="margin-bottom: 20px;">
          <span>音频名称：</span>
          <el-input style="width: 200px;" v-model="apiData.title" placeholder="请输入音频名称"></el-input>
        </el-col>
        <el-col :span="20" style="margin-bottom: 20px;">
          <span>音频副标题：</span>
          <el-input style="width: 200px;" v-model="apiData.secondTitle" placeholder="请输入音频名称"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="3">
          <span>添加标签：</span>
          <el-button type="primary" @click="dialogVisible=true">选择标签</el-button>
        </el-col>
        <el-col :span="6" v-if="musicTagValue.length !== 0">
          <span>音频标签：</span>
          <span style="margin-right: 10px; line-height: 2" v-for="(tag, index) in musicTagValue" :key="index">{{tag}}</span>
        </el-col>
      </el-row>
      <el-row :gutter="40">
        <el-col :span="6">
          <div class="audio">
            <audio v-if="apiData.mediaUrl" controls width="370" id="time" ref="videoInfo" height="40" :src="apiData.mediaUrl"></audio>
            <img v-else src="http://iph.href.lu/370x40" alt="">
          </div>
        </el-col>
        <el-col :span="10">
          <p>播放时长：{{apiData.mediaTime}}</p>
          <p>文件数据：{{apiData.mediaSize}}</p>
          <p>文件路径：{{apiData.mediaUrl}}</p>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <p>第三步，音频归属</p>
      <el-col :span="20" style="margin-bottom: 20px;">
          <span>归属：</span>
          <el-select v-model="value" placeholder="请选择归属">
            <el-option v-for="(item, index) in belong" :key="index" :value="item.label">
              {{item.label}}
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="20" style="margin-bottom: 20px;" v-if="value === '乐队' && !$route.query.id">
          <span>选择乐队：</span>
          <el-button @click="tableBand = true" size="medium" type="primary">选择乐队</el-button>
          <el-dialog title="选择乐队" :visible.sync="tableBand">
            <span>搜索功能：</span>
            <el-input style="width: 40%;margin-bottom: 20px; margin-right: 20px;" placeholder="乐队标题" v-model="searchBand"></el-input>
            <el-button @click="searchBandTo" size="medium" type="primary">搜索乐队</el-button>
            <el-table :data="gridData">
              <el-table-column property="id" label="乐队ID" width="100"></el-table-column>
              <el-table-column property="bandName" label="乐队名称" width="150"></el-table-column>
              <el-table-column property="musicCount" label="单曲数量" width="200"></el-table-column>
              <el-table-column property="videoCount" label="视频数量"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="100">
                <template slot-scope="scope">
                  <el-button @click="handleBandClick(scope.row)" type="text" size="small">选择</el-button>
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
        </el-col>
        <el-col :span="5" v-if="value === '乐队' && bandTitle">
          <span>归属乐队：</span>
          <span>{{bandTitle}}</span>
        </el-col>
    </el-row>
    <el-row style="line-height: 36px;" v-if="value === '好乐' || value === '乐队' && bandTitle">
        <el-col :span="8" v-if="!this.$route.query.id">
          <span>选择专辑：</span>
          <el-button size="medium" @click="tableAblum = true" type="primary">选择专辑</el-button>
          <el-dialog title="选择乐队" :visible.sync="tableAblum">
            <el-table :data="albumData" v-if="albumData[0] && albumData[0].ascriptionType === 1">
              <el-table-column property="id" label="专辑ID" width="100"></el-table-column>
              <el-table-column property="title" label="专辑名称" width="200"></el-table-column>
              <el-table-column property="ascriptionName" label="归属乐队" width="200"></el-table-column>
              <el-table-column property="musicCount" label="音频数量" width="150"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <el-button @click="handleAlbumClick(scope.row)" type="text" size="small">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
             <el-table :data="albumData" v-else>
              <el-table-column property="id" label="专辑ID" width="300"></el-table-column>
              <el-table-column property="title" label="专辑名称" width="300"></el-table-column>
              <el-table-column
                fixed="right"
                label="操作"
                width="200">
                <template slot-scope="scope">
                  <el-button @click="handleAlbumClick(scope.row)" type="text" size="small">选择</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
        </el-col>
      </el-row>
      <el-row>
        <span v-if="albumTitle">归属专辑：{{albumTitle}}</span>
      </el-row>
    <el-row>
      <el-col :span="24">
        <div class="clearfix upload-video">
          <span class="text fl">第四步，发布音频</span>
          <el-button size="large" type="primary" @click="goToCommit">发布</el-button>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="选择标签"
      :visible.sync="dialogVisible"
      width="30%">
      <el-row>
        <el-col :span="24">
          <el-tabs type="card">
            <el-tab-pane v-for="(item, index) in tagList" :key="index" :label="item.tagType.tagName">
              <el-checkbox-group v-model="tagOne" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(tag, index) in item.tagClassify" :key="index" :label="`${tag.id}${tag.tagName}`">{{tag.tagName}}</el-checkbox>
              </el-checkbox-group>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="dialogVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="tagSelect">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {doUpload} from 'utils/upload.js';
  import { getBandList, getAlbumList, getBandTag, addAudio } from 'server/content';
  import { bandAlbumList, getHoyoAlbum } from 'server/status';
  import { timeTo } from 'utils/time.js';
  import { arrLoop } from 'utils/listLoop.js';
  export default {
    name: 'AddAudio',
    data () {
      return {
        dialogVisible: false,
        tableBand: false,
        tableAblum: false,
        multiple: true,
        autoUpload: false,
        limit: 100,
        fileList: [],
        fileArr: [],
        activeName: 'style',
        formData: {},
        gridData: [],
        albumData: [],
        tagList: [],
        tagOne: [],
        value: '乐队',
        bandTitle: '',
        bandId: '',
        albumTitle: '',
        musicTagValue: [],
        mediaUrlList: [],
        belong: [{value: '0', label: '好乐'}, {value: '1', label: '乐队'}],
        apiData: {
          ascription: '',
          ascriptionType: '',
          albumId: '',
          qualityCode: '',
          list: [],
          musicInfoParam: ''
        },
        searchBand: '',
        currentPage: 1,
        totalPage: ''
      };
    },
    methods: {
      fnUploadRequests (option) {
        doUpload(option, 'audio/band').then((res) => {
          this.fileArr.push(option.file);
          this.mediaUrlList.push(res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?')));
          let progress = document.getElementsByClassName('el-upload-list__item is-uploading');
          setTimeout(() => {
            for (let i = 0; i < progress.length; i++) {
              progress[i].style.display = 'block';
            }
          }, 1000);
          // this.apiData.mediaUrl = res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'));
          // this.apiData.title = option.file.name.substring(0, option.file.name.length - 4);
          // this.apiData.mediaSize = `${Math.round(option.file.size / 1024 / 1024)}`;
          // setTimeout(() => {
          //   let time = `${Math.round(cc.duration)}`;
          //   this.apiData.mediaTime = timeTo(time);
          // }, 3000);
          if (this.fileArr.length === progress.length) {
            this.fileList = this.fileArr;
            this.mulList = true;
            let maps = new Array(progress.length);
            for (let i = 0; i < this.mediaUrlList.length; i++) {
              maps[i] = Object.create(null);
              maps[i].title = '';
              maps[i].secondTitle = '';
              maps[i].mediaTime = '';
              maps[i].mediaUrl = '';
              maps[i].tagIds = '';
              maps[i].mediaSize = '';
            }
            arrLoop(this.mediaUrlList, maps);
            arrLoop(this.fileList, maps);
            this.apiData.list = maps;
            if (progress.length <= 10) {
              setTimeout(() => {
                let times = document.getElementsByTagName('audio');
                console.log(times);
                for (let i = 0; i < times.length; i++) {
                  this.apiData.list[i].mediaTime = timeTo(times[i].duration);
                }
              }, 5000);
            } else if (progress.length > 10 && progress.length <= 30) {
              setTimeout(() => {
                let times = document.getElementsByTagName('audio');
                console.log(times);
                for (let i = 0; i < times.length; i++) {
                  this.apiData.list[i].mediaTime = timeTo(times[i].duration);
                }
              }, 10000);
            } else if (progress.length > 30 && progress.length < 60) {
              setTimeout(() => {
                let times = document.getElementsByTagName('audio');
                console.log(times);
                for (let i = 0; i < times.length; i++) {
                  this.apiData.list[i].mediaTime = timeTo(times[i].duration);
                }
              }, 20000);
            }
            // let times = document.getElementsByTagName('audio');
            // setTimeout(() => {
            //   console.log(times[3]);
            // }, 5000);
            // for (let i = 0; i < times.length; i++) {
            //   console.log(times[i]);
            // }
            console.log(this.fileList);
            console.log(this.mediaUrlList);
          }
        });
      },
      selectTags (index) {
        this.dialogVisible = true;
        this.tagIndex = index;
      },
      tagSelect () {
        console.log(123);
        this.musicTagValue.length = this.mediaUrlList.length;
        this.musicTagValue[this.tagIndex] = this.tagIndexList;
        console.log(this.tagIndex);
        this.dialogVisible = false;
      },
      goToCommit () {
        if (this.value === '好乐') {
          this.apiData.ascriptionType = 0;
        } else if (this.value === '乐队') {
          this.apiData.ascriptionType = 1;
        }
        console.log(this.apiData);
        // this.apiData.list = this.apiData.list.map((map) => {
        //   return JSON.stringify(map);
        // });
        this.apiData.musicInfoParam = JSON.stringify(this.apiData.list);
        addAudio('/musicInfo/batchAddMusic', this.apiData).then(res => {
          console.log(this.apiData);
          if (res.code === 0) {
            if (this.$route.query.id) {
              this.$router.push({
                name: 'albumDetail',
                query: {
                  id: this.$route.query.id
                }
              });
            } else {
              this.$router.push({
                path: '/content/audio'
              });
            }
            this.$message.success('添加成功');
          }
        });
      },
      beforeUpload (file) {
      },
      onSuccess (response, file, fileList) {
        console.log(response, file, fileList);
      },
      submitUpload (fileList) {
        this.$refs.upload.submit();
      },
      handleBandClick (row) {
        this.apiData.ascription = row.id;
        this.bandTitle = row.bandName;
        this.tableBand = false;
        this._bandAlbumList();
      },
      handleAlbumClick (row) {
        this.apiData.albumId = row.id;
        this.albumTitle = row.title;
        this.tableAblum = false;
      },
      handleCheckedCitiesChange (value) {
        this.tagIndexList = value;
        let newValue = [];
        value.forEach(item => {
          let newItem = parseInt(item);
          newValue.push(newItem);
        });
        this.apiData.list.forEach((list, index) => {
          this.apiData.list[this.tagIndex].tagIds = newValue.join(',');
        });
      },
      _getBandList (params) {
        getBandList('bandInfo/bandList', params).then((res) => {
          this.gridData = res.data.records;
          this.totalPage = res.data.total;
          console.log(this.gridData);
          this.searchBand = '';
        });
      },
      searchBandTo () {
        // getBandList('bandInfo/bandList', {
        //   current: 1,
        //   size: 10000,
        //   keyWord: this.searchBand
        // }).then((res) => {
        //   this.gridData = res.data.records;
        //   this.searchBand = '';
        //   console.log(this.gridData);
        // });
        this._getBandList(
          {
            current: 1,
            size: 10,
            keyWord: this.searchBand
          }
        );
      },
      handleSizeChange (val) {
        console.log(val);
      },
      handleCurrentChange (val) {
        this.currentPage = val;
        // console.log(val);
        this._getBandList(
          {
          current: val,
          size: 10,
          keyWord: this.searchBand
        }
        );
      },
      _bandAlbumList () {
        bandAlbumList('/album/bandAlbumList', {
          bandId: this.apiData.ascription
        }).then(res => {
          if (res.code === 0) {
            this.albumData = res.data;
            console.log(res.data);
          }
        });
      },
      _getAlbumList () {
        getAlbumList('/album/albumList', {
          current: 1,
          size: 10000
        }).then(res => {
          if (res.code === 0) {
            this.albumData = res.data.records;
          }
        });
      },
      _getHoyoAlbum () {
        getHoyoAlbum('/album/hoyoAlbum').then(res => {
          this.albumData = res.data;
          console.log(res);
        });
      },
      _getBandTag () {
        getBandTag('/tagInfo/tagList', {
          tagType: 0
        }).then(res => {
          if (res.code === 0) {
            console.log(res.data);
            this.tagList = res.data;
          }
        });
      },
      _albumTitleHav () {
        if (this.$route.query.id) {
          this.albumTitle = this.$route.query.title;
          this.apiData.albumId = this.$route.query.id;
          if (this.$route.query.ascriptionType === 0) {
            this.value = '好乐';
          }
          if (this.$route.query.ascriptionName.length !== 0 && this.$route.query.ascription) {
            this.bandTitle = this.$route.query.ascriptionName;
            this.apiData.ascription = this.$route.query.ascription;
            console.log(123);
          }
        }
      }
    },
    watch: {
      value () {
        if (this.value === '好乐') {
          this.apiData.ascriptionType = 0;
          this.apiData.ascription = '';
          console.log(123);
          this._getHoyoAlbum();
        } else if (this.value === '乐队') {
          this.apiData.ascriptionType = 1;
        }
      },
      tableBand () {
        this._getBandList(
          {
            current: 1,
            size: 10,
            keyWord: this.searchBand
          }
        );
      },
      fileList () {
        // console.log(this.fileList);
      }
    },
    created () {
      this._getBandList();
      this._getAlbumList();
      this._getBandTag();
      this._albumTitleHav();
      this.mulList = false;
      this.tagIndex = '';
      this.tagIndexList = [];
    }
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    .text {
      padding-right: 30px;
      line-height: 40px;
    }
    .audio-info {
      h4 {
        font-weight: normal;
      }
    }
    .audio {
      margin-top: 40px;
    }
  }
</style>

<style lang="scss">
.uplaod-wrapper {
  .el-upload-list--text {
    width: 216px;
    .el-upload-list__item {
      height: 30px;
      .el-upload-list__item-name {
        display: block;
      }
    }
  }
}
</style>

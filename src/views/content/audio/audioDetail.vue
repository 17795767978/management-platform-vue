<template>
  <div class="audio-detail">
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-pturple">
          音频标题：{{audioDetail.title}}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-pturple">
          音频副标题：{{audioDetail.second_title}}
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content bg-purple">
          当前状态：{{audioDetail.status}}
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-button v-if="audioDetail.status === '已上架'" type="primary" @click="lowerShelf">下架</el-button>
          <el-button v-if="audioDetail.status === '已下架'" type="primary" @click="upperShelf">上架</el-button>
          <el-button v-if="audioDetail.status === '已下架'" type="primary" @click="recheck = true">编辑</el-button>
          <el-button v-if="audioDetail.status === '审核中'" type="primary" @click="goToReject">驳回</el-button>
          <el-button v-if="audioDetail.status === '审核中'" type="primary" @click="goToPass">通过</el-button>
          <el-button v-if="audioDetail.status === '未发布'" type="primary" @click="goToExamine">去审核</el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          音频id：{{audioDetail.id}}
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          归属类型：{{type}}
        </div>
      </el-col>
      <el-col :span="6" v-if="audioDetail.ascription_type === 1">
        <div class="grid-content bg-purple">
          音频归属：{{audioDetail.ascriptionName}}
        </div>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple" v-if="audioDetail.ascription_type === 1">
          <el-button
            type="primary"
            @click="$router.push({
              path: '/band/band-detail',
              query: {
                id: audioDetail.ascription
              }
            })"
            >
            查看乐队
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="6">
        <div class="grid-content bg-purple">
          <span>是否为独家：</span>
          <span v-if="audioDetail.is_alone === 0">否</span>
          <span v-if="audioDetail.is_alone === 1">是</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content bg-purple">
          发布时间：{{audioDetail.submitTime}}
        </div>
      </el-col>
      <el-col :span="6" v-if="audioDetail.albumTitle">
        <div class="grid-content bg-purple">
          归属专辑：{{audioDetail.albumTitle}}
        </div>
      </el-col>
      <el-col :span="2" v-if="audioDetail.albumTitle">
        <div class="grid-content bg-purple">
          <el-button
            type="primary"
            @click="$router.push({
              path: '/content/album-detail',
              query: {
                id: audioDetail.album_id
              }
            })"
            >
            查看专辑
          </el-button>
        </div>
      </el-col>
    </el-row>
    <el-row style="margin-top:20px" :gutter="200">
      <el-col :span="12">
        <el-row>
          <el-col :span="4">
            <span>点播：{{audioDetail.playCount}}</span>
          </el-col>
          <el-col :span="10">
            <span>点播修改：</span>
            <input type="text" v-model="play">
          </el-col>
          <el-col :span="2">
            <el-button size="mini" type="primary" @click="changePlayCount">保存</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>收藏：{{audioDetail.likeCount}}</span>
          </el-col>
          <el-col :span="10">
            <span>收藏修改：</span>
            <input type="text" v-model="like">
          </el-col>
          <el-col :span="2">
            <el-button size="mini" type="primary" @click="changeLikeCount">保存</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <span>评论：{{audioDetail.commentsCount}}</span>
          </el-col>
          <el-col :span="10">
            <span>评论修改：</span>
            <input type="text" v-model="ratings">
          </el-col>
          <el-col :span="2">
            <el-button size="mini" type="primary" @click="changeCommentsCount">保存</el-button>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <span>音频标签：</span>
        <p style="line-height: 1.2">
          <span style="margin-right: 10px" v-for="(tag, index) in audioDetail.relationTag" :key="index">{{tag.tagName}}</span>
        </p>
      </el-col>
      <el-col :span="2">
        <el-button style="margin-left: 5px" type="primary" @click="dialogVisible = true">标签编辑</el-button>
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
            <el-button type="primary" @click="changeTag">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
    <hr />
    <el-row :gutter="20">
      <el-col :span="10">
        <audio :src="audioDetail.media_url" controls="controls"></audio>
      </el-col>
    </el-row>
    <!-- <p>音频音质：（128kbit/s）</p> -->
    <el-row :gutter="100">
      <el-col :span="6">
        <span>播放时长：{{audioDetail.media_time}}</span>
      </el-col>
      <el-col :span="12">
        <span>原始文件路径：{{audioDetail.media_url}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="100">
      <el-col :span="6">
        <span>文件数据：{{audioDetail.media_size}}</span>
      </el-col>
      <el-col :span="12" v-if="audioDetail.sound_too_media_url">
        <span>打码文件路径：{{audioDetail.sound_too_media_url}}</span>
      </el-col>
    </el-row>
    <hr />
    <p>
      是否添加声码：
      <span v-if="audioDetail.is_sound_too === 0">否</span>
      <span v-if="audioDetail.is_sound_too === 1">是</span>
    </p>
    <el-row :gutter="100">
      <el-col :span="10" v-if="audioDetail.sound_too_code">
        <span>声码1编号：{{audioDetail.sound_too_code}}</span>
      </el-col>
    </el-row>
    <hr />
    <!--  -->
    <el-dialog title="上下架操作说明" :visible.sync="dialogFormVisible">
      <el-form >
        <el-form-item label="原因">
          <el-input type="textarea" v-model="reason" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="subMitShelf">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="警告" :visible.sync="dialogWarningVisible">
      <el-form >
        <p>{{warningMsg}}</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWarningVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="goAhead">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="审核操作说明" :visible.sync="dialogExamineVisible">
      <el-form >
        <el-form-item v-if="passOrReject === false" label="原因">
          <el-input type="textarea" v-model="reasonStatus" autocomplete="off"></el-input>
        </el-form-item>
        <p v-else>是否通过审核？</p>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogExamineVisible = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="examineStatus">确 定</el-button>
      </div>
    </el-dialog>
    <div class="kobe">
    <el-dialog title="编辑音频" :visible.sync="recheck">
      <el-form >
        <el-form-item label="音频标题：">
          <el-input type="text" v-model="recheckDetail.title" style="width: 215px;"></el-input>
        </el-form-item>
        <el-form-item label="音频副标题：">
          <el-input type="text" v-model="recheckDetail.secondTitle" style="width: 215px;"></el-input>
        </el-form-item>
        <el-form-item label="归属类型：">
          <el-select v-model="value" placeholder="请选择归属">
            <el-option v-for="(item, index) in belong" :key="index" :value="item.label">
              {{item.label}}
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音频归属：" v-if="value === '乐队'">
          <span v-if="audioDetail.ascriptionName">{{audioDetail.ascriptionName}}</span>
        </el-form-item>
        <el-form-item label="更换乐队：" v-if="value === '乐队'">
          <el-button type="primary" @click="dialogTableBand = true" size="medium">更换乐队</el-button>
        </el-form-item>
        <el-form-item label="独家：">
          <el-radio v-model="recheckDetail.isAlone" label="1">是</el-radio>
          <el-radio v-model="recheckDetail.isAlone" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="归属专辑：">
          <span v-if="audioDetail.albumTitle">{{audioDetail.albumTitle}}</span>
        </el-form-item>
        <el-form-item label="更换专辑：">
          <el-button type="primary" @click="dialogTableAblum = true" size="medium">更换专辑</el-button>
        </el-form-item>
        <el-form-item label="上传打码音频：">
          <el-upload
            class="fl"
            ref="elUpload"
            accept="audio/*"
            action=""
            :http-request="fnUploadRequests"
            v-if="recheck === true"
            >
            <el-button size="small" type="primary">上传打码音频</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传打码音频：" v-if="recheckDetail.soundTooMediaUrl">
          <audio :src="recheckDetail.soundTooMediaUrl" controls></audio>
        </el-form-item>
        <el-form-item label="上传打码音频地址：" v-if="recheckDetail.soundTooMediaUrl">
          <span>{{recheckDetail.soundTooMediaUrl}}</span>
        </el-form-item>
        <el-form-item label="添加声码：">
          <el-radio v-model="recheckDetail.isSoundToo" label="1">是</el-radio>
          <el-radio v-model="recheckDetail.isSoundToo" label="0">否</el-radio>
        </el-form-item>
        <el-form-item label="声码编号：" v-if="recheckDetail.isSoundToo === '1'">
          <el-input type="text" style="width: 215px;" v-model="recheckDetail.soundTooCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recheck = false">取 消</el-button>
        <!-- <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button> -->
        <el-button type="primary" @click="subMitCommit">去审核</el-button>
      </div>
    </el-dialog>
    </div>
    <div class="kobe">
    <el-dialog ref="elDialog" title="选择乐队" :visible.sync="dialogTableBand">
      <el-table :data="bandData">
        <el-table-column property="id" label="乐队ID" width="100"></el-table-column>
        <el-table-column property="bandName" label="乐队名称" align="center" width="200"></el-table-column>
        <el-table-column property="musicCount" label="音频数量" align="center" width="100"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleBandClick(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    </div>
    <div class="kobe">
    <el-dialog title="选择专辑" :visible.sync="dialogTableAblum">
      <el-table :data="albumData">
        <el-table-column property="title" label="专辑名称" align="center" width="200"></el-table-column>
        <el-table-column property="musicCount" label="音频数量" align="center" width="100"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button @click="handleAlbumClick(scope.row)" type="text" size="small">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    </div>
  </div>
</template>

<script>
  import { getAudioDetail, changeAudioNum, getBandTag, changeVideoTag, getBandList, getAlbumList } from 'server/content';
  import { subMitAudio, goToAudioCommit, getAudioCommit, bandAlbumList, audioToHome, getHoyoAlbum } from 'server/status';
  import {doUpload} from 'utils/upload.js';
  import {uniq} from 'utils/removal.js';
  import {checkNumber} from 'utils/check.js';
  export default {
    name: 'AudioDetail',
    data () {
      return {
        dataList: [],
        audioDetail: {},
        recheckDetail: {
          id: '',
          title: '',
          secondTitle: '',
          ascription: '',
          ascriptionType: '',
          albumId: '',
          isAlone: '',
          soundTooMediaUrl: '',
          isSoundToo: '',
          soundTooCode: ''
        },
        belong: [{value: '0', label: '好乐'}, {value: '1', label: '乐队'}],
        value: '',
        tagList: [],
        tagOne: [],
        musicTagValue: [],
        tagIds: '',
        type: '',
        play: '',
        like: '',
        ratings: '',
        reason: '',
        reasonStatus: '',
        upAndLowShelf: '',
        activeName: 'first',
        dialogVisible: false,
        dialogFormVisible: false,
        dialogWarningVisible: false,
        isIndeterminate: true,
        recheck: false,
        dialogTableBand: false,
        dialogTableAblum: false,
        dialogExamineVisible: false,
        dialogConfirmVisible: false,
        bandData: [],
        albumData: [],
        passOrReject: false,
        warningMsg: ''
      };
    },
    methods: {
      _getAudioDetail () {
        getAudioDetail('/musicInfo/musicDetails', {
          musicId: this.$route.query.audioId
        }).then((res) => {
          if (res.code === 0) {
            let arr = [];
            res.data.relationTag.forEach(item => {
              arr.push(item.id);
            });
            this.tagIds = arr.join(',');
            console.log(this.tagIds);
            this.audioDetail = res.data;
            this.recheckDetail.id = this.audioDetail.id;
            this.recheckDetail.title = this.audioDetail.title;
            this.recheckDetail.secondTitle = this.audioDetail.second_title;
            this.recheckDetail.isSoundToo = `${this.audioDetail.is_sound_too}`;
            this.recheckDetail.albumId = this.audioDetail.album_id;
            this.recheckDetail.ascription = this.audioDetail.ascription;
            this.recheckDetail.ascriptionType = this.audioDetail.ascription_type;
            this.recheckDetail.isAlone = `${this.audioDetail.is_alone}`;
            this.recheckDetail.soundTooMediaUrl = this.audioDetail.sound_too_media_url;
            this.recheckDetail.soundTooCode = this.audioDetail.sound_too_code;
            console.log(this.recheckDetail);
            res.data.relationTag.forEach((tag) => {
              this.tagOne.push(`${tag.id}${tag.tagName}`);
            });
            console.log(this.audioDetail);
            this._bandAlbumList();
            if (this.audioDetail.ascription_type === 0) {
              this.type = '好乐';
              this.value = '好乐';
              this._getHoyoAlbum();
            } else if (this.audioDetail.ascription_type === 1) {
              this.type = '乐队';
              this.value = '乐队';
            }
          }
        });
      },
      _getBandTag () {
        getBandTag('/tagInfo/tagList', {
          tagType: 0
        }).then(res => {
          if (res.code === 0) {
            console.log(res.data);
            this.tagList = res.data;
            console.log(this.tagList);
          }
        });
      },
      _getBandList () {
        getBandList('/bandInfo/bandList', {
          current: 1,
          size: 10000
        }).then(res => {
          if (res.code === 0) {
            this.bandData = res.data.records;
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
            console.log(res.data.records);
            // this.albumData = res.data.records;
          }
        });
      },
      _bandAlbumList () {
        bandAlbumList('/album/bandAlbumList', {
          bandId: this.recheckDetail.ascription || this.audioDetail.ascription
        }).then(res => {
          if (res.code === 0) {
            this.albumData = res.data;
            console.log(res.data);
          }
        });
      },
      _getHoyoAlbum () {
        getHoyoAlbum('/album/hoyoAlbum').then(res => {
          this.albumData = res.data;
          console.log(res);
        });
      },
      changePlayCount () {
        checkNumber(this.play).then(() => {
          changeAudioNum('/musicInfo/updateMusicInfo', {
            id: this.audioDetail.id,
            playCount: this.play
          }).then(res => {
            if (res.code === 0) {
              this._getAudioDetail();
              this.play = '';
            }
          });
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      changeLikeCount () {
        checkNumber(this.like).then(() => {
          changeAudioNum('/musicInfo/updateMusicInfo', {
            id: this.audioDetail.id,
            likeCount: this.like
          }).then(res => {
            if (res.code === 0) {
              this._getAudioDetail();
              this.like = '';
            }
          });
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      changeCommentsCount () {
        checkNumber(this.ratings).then(() => {
           changeAudioNum('/musicInfo/updateMusicInfo', {
            id: this.audioDetail.id,
            commentsCount: this.ratings
          }).then(res => {
            if (res.code === 0) {
              this._getAudioDetail();
              this.ratings = '';
            }
          });
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      lowerShelf () {
        audioToHome('/musicInfo/isRecommendMusic', {
          id: this.audioDetail.id
        }).then(res => {
          if (res.code === 0) {
            this.dialogFormVisible = true;
            this.dialogWarningVisible = false;
            this.upAndLowShelf = 0;
          } else if (res.code === 1) {
            this.dialogWarningVisible = true;
            this.dialogFormVisible = false;
            this.warningMsg = res.msg;
            this.upAndLowShelf = 0;
          }
        });
      },
      goAhead () {
        this.dialogFormVisible = true;
        this.dialogWarningVisible = false;
        this.upAndLowShelf = 0;
      },
      upperShelf () {
        this.dialogFormVisible = true;
        this.upAndLowShelf = 1;
      },
      subMitShelf () {
        subMitAudio('/musicInfo/upAndLowShelf', {
          id: this.audioDetail.id,
          stage: this.upAndLowShelf,
          reason: this.reason
        }).then(res => {
          if (res.code === 0) {
            this._getAudioDetail();
          }
        });
        this.dialogFormVisible = false;
      },
      handleBandClick (row) {
        console.log(row);
        this.recheckDetail.ascription = row.id;
        this.audioDetail.ascriptionName = row.bandName;
        this.audioDetail.albumTitle = '';
        this.dialogTableBand = false;
        this._bandAlbumList();
      },
      handleAlbumClick (row) {
        console.log(row);
        this.recheckDetail.albumId = row.id;
        this.audioDetail.albumTitle = row.title;
        this.dialogTableAblum = false;
        console.log(this.recheckDetail);
      },
      handleClick (tab, event) {
        console.log(tab, event);
      },
      handleCheckAllChange(val) {
        // this.checkedCities = val ? cityOptions : [];
        // this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        console.log(value);
        this.musicTagValue = value;
        let newValue = [];
        value.forEach(item => {
          let newItem = parseInt(item);
          newValue.push(newItem);
          // this.tagIds = newValue.join(',');
        });
        console.log(uniq(newValue));
        this.tagIds = uniq(newValue).join(',');
        // console.log(this.tagIds);
      },
      changeTag () {
        // console.log(this.tagIds);
        changeVideoTag('/mediatagref/addOrEditTagRef', {
          mediaId: this.audioDetail.id,
          tagIds: this.tagIds,
          mediaType: 1
        }).then(res => {
          if (res.code === 0) {
            this._getAudioDetail();
          }
        });
        this.dialogVisible = false;
      },
      fnUploadRequests (option) {
        doUpload(option, 'sound-code/audio').then((res) => {
          let progress = document.getElementsByClassName('el-upload-list__item is-uploading');
          setTimeout(() => {
            for (let i = 0; i < progress.length; i++) {
              progress[i].style.display = 'none';
            }
          }, 1000);
          this.recheckDetail.soundTooMediaUrl = res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'));
        });
      },
      subMitCommit () {
        if (this.value === '好乐') {
          this.recheckDetail.ascriptionType = 0;
          this.recheckDetail.ascription = '';
        } else if (this.value === '乐队') {
          this.recheckDetail.ascriptionType = 1;
        }
        console.log(this.recheckDetail);
        goToAudioCommit('/musicInfo/musicInAudit', this.recheckDetail).then(res => {
          if (res.code === 0) {
            this._getAudioDetail();
            this.recheck = false;
          }
        });
      },
      goToReject () {
        this.passOrReject = false;
        this.dialogExamineVisible = true;
      },
      goToPass () {
        this.passOrReject = true;
        this.dialogExamineVisible = true;
      },
      examineStatus () {
        if (this.passOrReject === false) {
          getAudioCommit('/musicInfo/musicAudit', {
            id: this.audioDetail.id,
            auditStage: 3,
            reason: this.reasonStatus
          }).then(res => {
            if (res.code === 0) {
              console.log(res.data);
              this._getAudioDetail();
              this.dialogExamineVisible = false;
            }
          });
        } else {
          getAudioCommit('/musicInfo/musicAudit', {
            id: this.audioDetail.id,
            auditStage: 2,
            reason: this.reasonStatus
          }).then(res => {
            if (res.code === 0) {
              console.log(res.data);
              this._getAudioDetail();
              this.dialogExamineVisible = false;
            }
          });
        }
      },
      goToExamine () {
        if (this.value === '好乐') {
          this.recheckDetail.ascriptionType = 0;
          this.recheckDetail.ascription = '';
          this.recheckDetail.albumId = '';
        } else if (this.value === '乐队') {
          this.recheckDetail.ascriptionType = 1;
        }
        console.log(this.recheckDetail);
        goToAudioCommit('/musicInfo/musicInAudit', this.recheckDetail).then(res => {
          if (res.code === 0) {
            this._getAudioDetail();
          }
        });
      }
    },
    created () {
      this._getAudioDetail();
      this._getBandTag();
      this._getBandList();
      // this._getAlbumList();
    },
    watch: {
      value () {
        if (this.value === '好乐') {
          console.log(123);
          this._getHoyoAlbum();
          this.recheckDetail.ascription = '';
        }
      }
    }
  };
</script>

<style scoped lang="scss">
.audio-detail {
  padding:0 20px;
}
.el-row {
  margin-bottom: 5px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  margin-bottom: 5px;
}
.grid-content {
  border-radius: 4px;
  min-height: 60px;
  line-height: 60px;
}
.row-bg {
  padding: 10px 0;
  background-color: #fff;
}
</style>
<style lang="scss">
.kobe {
  .el-dialog {
    width: 30%;
  }
  .el-upload-list__item {
    height: 30px !important;
  }
}
</style>

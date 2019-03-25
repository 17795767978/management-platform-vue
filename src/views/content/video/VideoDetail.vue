<template>
  <div class="wrapper">
    <el-row>
      <el-col :span="4" v-if="recheck === false">
        <span class="text" >
          视频标题：{{videoDetail.title}}
        </span>
      </el-col>
      <el-col :span="6" v-else>
        视频标题：<el-input style="width: 200px;" v-model="formLabelAlign.title">{{formLabelAlign.title}}</el-input>
      </el-col>
      <el-col :span="4">
        <span class="text">
          当前状态：{{videoDetail.status}}
        </span>
      </el-col>
      <el-col :span="4">
        <el-button v-if="videoDetail.status === '已上架' && recheck === false" type="primary" @click="goHeadOrWarning">下架</el-button>
        <el-button v-if="videoDetail.status === '已下架' && recheck === false" type="primary" @click="dialogFormVisible = true">上架</el-button>
        <el-button v-if="videoDetail.status === '已下架' && recheck === false" type="primary" @click="recheck = true">编辑</el-button>
        <el-button v-if="recheck || videoDetail.status === '未发布'" type="primary" @click="getCheckDetail">去审核</el-button>
      </el-col>
      <el-col :span="4">
        <el-button v-if="videoDetail.status === '审核中'" type="primary" @click="goToReject">驳回</el-button>
        <el-button v-if="videoDetail.status === '审核中'" type="primary" @click="goToPass">通过</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <span class="text">
          视频ID：{{videoDetail.id}}
        </span>
      </el-col>
      <el-col :span="4" v-if="recheck === false">
        <span class="text">
          归属类型：{{type}}
        </span>
      </el-col>
      <el-col :span="6" v-else>
        归属类型： <el-select v-model="formLabelAlign.ascriptionType" placeholder="请选择">
          <el-option
            v-for="item in belong"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <span class="text" v-if="formLabelAlign.ascriptionType === '1' || videoDetail.ascription_type === 1 && formLabelAlign.ascriptionType === '1'">
          视频归属：{{videoDetail.ascriptionName}}
        </span>
      </el-col>
      <el-col :span="4" >
        <el-button
          v-if="recheck === false && videoDetail.ascription_type === 1"
          size="medium"
          type="primary"
          @click="$router.push({
            path: '/band/band-detail',
            query: {
              id: videoDetail.ascription
            }
          })"
          >查看乐队</el-button>
        <el-button v-if="recheck === true && formLabelAlign.ascriptionType === '1'" @click="tableBand = true" size="medium" type="primary">更换乐队</el-button>
        <el-dialog title="选择乐队" :visible.sync="tableBand">
          <el-table :data="gridData">
            <el-table-column property="id" label="乐队ID" width="100"></el-table-column>
            <el-table-column property="bandName" label="乐队名称" width="150"></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row)" type="text" size="small">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-dialog>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" v-if="recheck === false">
        <span class="text">是否为独家：{{isAlone}}</span>
      </el-col>
      <el-col :span="4" v-else>
         是否为独家：
        <el-radio v-model="formLabelAlign.isAlone" label="1">是</el-radio>
        <el-radio v-model="formLabelAlign.isAlone" label="0">否</el-radio>
      </el-col>
      <el-col :span="4">
        <span class="text">发布时间：{{timeStatus}}</span>
      </el-col>
      <el-col style="line-height: 36px" :span="4">
        <span>是否转码：{{videoDetail.mediaOutStatus}}</span>
      </el-col>
      <el-col :span="5">
        <span class="text">
          视频标签：<span style="margin-right: 10px" v-for="(item, index) in this.videoDetail.relationTag" :key="index">{{item.tagName}}</span>
        </span>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="dialogVisible=true">标签编辑</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="5">
        <span>点播：{{videoDetail.playCount}}</span>
        <el-input style="width: 100px" placeholder="修改" v-model="countPlay"></el-input>
        <el-button type="primary" @click="changePlay">保存</el-button>
      </el-col>
      <el-col :span="5">
        <span>收藏：{{videoDetail.likeCount}}</span>
        <el-input style="width: 100px" placeholder="修改" v-model="countLike"></el-input>
        <el-button type="primary" @click="changeLike">保存</el-button>
      </el-col>
      <el-col :span="5">
        <span>评论：{{videoDetail.commentsCount}}</span>
        <el-input style="width: 100px" placeholder="修改" v-model="countRating"></el-input>
        <el-button type="primary" @click="changeRating">保存</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <h3>
          <video
            width="500"
            height="300"
            v-if="videoDetail.media_url && videoDetail.media_url.length !== 0" controls :src="formLabelAlign.soundTooMediaUrl || videoDetail.media_out_url || videoDetail.media_url">
          </video>
          <img v-else src="http://iph.href.lu/500x300">
        </h3>
      </el-col>
      <el-col :span="20">
        <p>
          <span>播放时长：{{videoDetail.mediaTime}}</span>
          <!-- <span>
              <a :href="formLabelAlign.soundTooMediaUrl || videoDetail.media_url" target="blank" download="下载该文件">
                <el-button type="primary">下载视频</el-button>
              </a>
          </span> -->
        </p>
        <p>
          <span>文件数据：{{videoDetail.media_size}}</span>
        </p>
        <el-row>
          <el-col>
            <p>原始文件路径：{{videoDetail.media_url}}</p>
            <p v-if="videoDetail.media_out_url">转码文件路径：{{videoDetail.media_out_url}}</p>
            <p v-if="formLabelAlign.soundTooMediaUrl || videoDetail.sound_too_media_url">打码文件路径：{{formLabelAlign.soundTooMediaUrl || videoDetail.sound_too_media_url}}</p>
          </el-col>
        </el-row>
        <el-row>
          <el-upload
            accept="video/mp4"
            class="res-video"
            action=""
            :data="formData"
            :http-request="fnUploadRequests"
            v-if="recheck === true"
            >
            <el-button size="small" type="primary">上传视频</el-button>
          </el-upload>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col v-if="recheck === false" :span="4">
        是否添加声码：{{formLabelAlign.isSoundToo === '0' ? '否' : '是'}}
      </el-col>
      <el-col v-else :span="4">
        是否添加声码：<el-radio v-model="formLabelAlign.isSoundToo" label="1">是</el-radio>
        <el-radio v-model="formLabelAlign.isSoundToo" label="0">否</el-radio>
      </el-col>
      <el-col v-if="recheck === true" :span="6">
        声码编号：<el-input style="width: 250px;" type="text" v-model="formLabelAlign.soundTooCode"></el-input>
      </el-col>
      <el-col :span="6" v-if="recheck === false">
        声码编号：{{videoDetail.sound_too_code}}
      </el-col>
      <!-- <el-col :span="4" v-if="this.isSoundToo === '是' && recheck === false">
        声码1起始时间：{{videoDetail.sound_too_start_time}}
      </el-col>
      <el-col :span="4" v-if="this.isSoundToo === '是' && recheck === false">
        声码1间隔时间：{{videoDetail.sound_too_interval}}
      </el-col> -->
    </el-row>
    <!-- <el-row>
      <el-col :span="24">
        <div class="title">操作记录</div>
        <div class="table">
          <el-table
            :data="list"
            row-key="id"
            border
            fit
            highlight-current-row
            style="width: 100%">
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作时间">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="管理员">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="备注">
              <template slot-scope="scope">
                <span></span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row> -->
    <!-- <el-dialog
      title="选择标签"
      :visible.sync="dialogVisible"
      width="30%">
      <el-row>
        <el-col :span="24">
          <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="风格" name="style">
              <el-checkbox label="标签" border></el-checkbox>
            </el-tab-pane>
            <el-tab-pane label="场景" name="scenario">
              <el-checkbox label="标签" border></el-checkbox>
            </el-tab-pane>
            <el-tab-pane label="心情" name="mood">
              <el-checkbox label="标签" border></el-checkbox>
            </el-tab-pane>
            <el-tab-pane label="主题" name="theme">
              <el-checkbox label="标签" border></el-checkbox>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog title="操作原因" :visible.sync="dialogFormVisible">
      <el-input v-model="form.reason" type="textarea"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="subMitVideo">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="警告" :visible.sync="dialogWarningVisible">
      <p>{{warningMsg}}</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogWarningVisible = false">取 消</el-button>
        <el-button type="primary" @click="goAhead">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      ref="elDialog"
      title="选择标签"
      :visible.sync="dialogVisible"
      width="30%">
      <el-row>
        <el-col :span="24">
          <el-tabs type="card">
            <el-tab-pane v-for="(tags, index) in tagAll" :key="index" :label="tags.tagType.tagName">
              <el-checkbox-group v-model="tagOne" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(tag, index) in tags.tagClassify" :key="index" :label="`${tag.id}${tag.tagName}`">{{tag.tagName}}</el-checkbox>
              </el-checkbox-group>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="changeVideo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <el-dialog title="编辑视频信息" :visible.sync="recheck">
      <el-form label-width="80px" :model="formLabelAlign">
        <el-form-item label="音频标题">
          <el-input v-model="formLabelAlign.title"></el-input>
        </el-form-item>
        <el-form-item label="归属类型">
          <el-select v-model="formLabelAlign.ascriptionType" placeholder="请选择">
            <el-option
              v-for="item in belong"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="独家">
          <el-radio v-model="formLabelAlign.isAlone" label="1">是</el-radio>
          <el-radio v-model="formLabelAlign.isAlone" label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="recheck = false">取 消</el-button>
        <el-button type="primary" @click="getCheckDetail">确 定</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
  import {
    getVideoDetail,
    getBandList,
    getBandTag,
    changeVideoTag,
    changeVideoNum
  } from '../../../server/content';
  import { subMitVideo, goToCommit, commitStatus, getlog, videoToHome } from 'server/status';
  import {doUpload} from 'utils/upload.js';
  import {uniq} from 'utils/removal.js';
  import {checkNumber} from 'utils/check.js';
  export default {
    name: 'VideoDetail',
    data () {
      return {
        form: {
          reason: ''
        },
        belong: [{value: '0', label: '好乐'}, {value: '1', label: '乐队'}],
        formLabelAlign: {
          title: '',
          id: '',
          isAlone: '',
          ascriptionType: '',
          ascription: '',
          soundTooMediaUrl: '',
          isSoundToo: '',
          soundTooCode: '',
          soundTooStartTime: '',
          soundTooInterval: ''
        },
        dialogFormVisible: false,
        dialogWarningVisible: false,
        dialogVisible: false,
        dialogFormVideo: false,
        tableBand: false,
        activeName: 'style',
        recheck: false,
        warningMsg: '',
        list: [],
        videoDetail: {},
        gridData: [],
        tagAll: [],
        tagOne: [],
        tagConfirm: {
          mediaId: '',
          tagIds: '',
          mediaType: 0
        },
        type: '',
        isAlone: '',
        timeStatus: '',
        isSoundToo: '',
        tagIds: '',
        countPlay: '',
        countLike: '',
        countRating: '',
        formData: {}
      };
    },
    methods: {
      _getBandDetail () {
        getVideoDetail('/videoInfo/videoDetails', {
          videoId: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            this.videoDetail = res.data;
            console.log(res.data);
            let arr = [];
            res.data.relationTag.forEach(item => {
              arr.push(item.id);
            });
            this.tagConfirm.tagIds = arr.join(',');
            console.log(this.tagConfirm.tagIds);
            this.formLabelAlign.title = res.data.title;
            this.formLabelAlign.ascriptionType = `${res.data.ascription_type}`;
            this.formLabelAlign.soundTooMediaUrl = res.data.sound_too_media_url;
            this.formLabelAlign.ascription = res.data.ascription;
            this.formLabelAlign.isSoundToo = res.data.is_sound_too;
            this.formLabelAlign.isAlone = `${res.data.is_alone}`;
            this.formLabelAlign.soundTooCode = res.data.sound_too_code;
            console.log(this.formLabelAlign);
            res.data.relationTag.forEach((tag) => {
              this.tagOne.push(`${tag.id}${tag.tagName}`);
            });
            this.tagConfirm.mediaId = res.data.id;
            this.formLabelAlign.id = res.data.id;
            if (this.videoDetail.ascription_type === 1) {
              this.type = '乐队';
            } else if (this.videoDetail.ascription_type === 2) {
              this.type = '用户';
            } else if (this.videoDetail.ascription_type === 0) {
              this.type = '好乐';
            };
            if (this.videoDetail.is_alone === 0) {
              this.isAlone = '否';
            } else if (this.videoDetail.is_alone === 1) {
              this.isAlone = '是';
            };
            if (this.videoDetail.submitTime === null) {
              this.timeStatus = '未发布';
            } else {
              this.timeStatus = this.videoDetail.submitTime;
            };
            if (this.videoDetail.is_sound_too === 0) {
              this.formLabelAlign.isSoundToo = '0';
            } else if (this.videoDetail.is_sound_too === 1) {
              this.formLabelAlign.isSoundToo = '1';
            }
          }
        });
      },
      _videoToHome () {
        videoToHome('/videoInfo/isRecommendVideo', {
          id: this.videoDetail.id
        }).then(res => {
          if (res.code === 0) {
            this.dialogFormVisible = true;
            this.dialogWarningVisible = false;
          } else if (res.code === 1) {
            this.warningMsg = res.msg;
            this.dialogFormVisible = false;
            this.dialogWarningVisible = true;
          }
        });
      },
      _getBandList () {
        getBandList('bandInfo/bandList', {
          current: 1,
          size: 10000
        }).then((res) => {
          this.gridData = res.data.records;
          console.log(this.gridData);
        });
      },
      _getBandTag () {
         getBandTag('/tagInfo/tagList', {
          tagType: 1
        }).then((res) => {
          this.tagAll = res.data;
        });
      },
      _getlog () {
        getlog('/sys/log/page', {
          current: 1,
          size: 10000
        }).then((res) => {
          console.log(res);
        });
      },
      changePlay () {
        checkNumber(this.countPlay).then(() => {
          changeVideoNum('/videoInfo/updateVideoInfo', {
            id: this.videoDetail.id,
            playCount: this.countPlay
          }).then((res) => {
            if (res.code === 0) {
              this._getBandDetail();
              this.countPlay = '';
            }
          });
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      changeLike () {
        checkNumber(this.countLike).then(() => {
          changeVideoNum('/videoInfo/updateVideoInfo', {
            id: this.videoDetail.id,
            likeCount: this.countLike
          }).then((res) => {
            if (res.code === 0) {
              this._getBandDetail();
              this.countLike = '';
            }
          });
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      changeRating () {
        checkNumber(this.countRating).then(() => {
          changeVideoNum('/videoInfo/updateVideoInfo', {
            id: this.videoDetail.id,
            commentsCount: this.countRating
          }).then((res) => {
            if (res.code === 0) {
              this._getBandDetail();
              this.countRating = '';
            }
          });
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      goHeadOrWarning () {
        this._videoToHome();
      },
      goAhead () {
        this.dialogWarningVisible = false;
        this.dialogFormVisible = true;
      },
      subMitVideo () {
        this.dialogFormVisible = false;
        if (this.videoDetail.status === '已上架') {
          subMitVideo('/videoInfo/upAndLowShelf', {
            id: this.videoDetail.id,
            stage: 0,
            reason: this.form.reason
          }).then(res => {
            if (res.code === 0) {
              this._getBandDetail();
              this.form.reason = '';
            }
          });
        } else if (this.videoDetail.status === '已下架') {
          subMitVideo('/videoInfo/upAndLowShelf', {
            id: this.videoDetail.id,
            stage: 1,
            reason: this.form.reason
          }).then(res => {
            if (res.code === 0) {
              this._getBandDetail();
              this.form.reason = '';
            }
          });
        }
      },
      handleCheckedCitiesChange (value) {
        console.log(value);
        this.tagValue = value;
        let newValue = [];
        value.forEach(item => {
          let newItem = parseInt(item);
          newValue.push(newItem);
        });
        this.tagConfirm.tagIds = uniq(newValue).join(',');
      },
      handleClick (row) {
        console.log(row);
        this.formLabelAlign.ascription = row.id;
        this.videoDetail.ascriptionName = row.bandName;
        this.tableBand = false;
      },
      changeVideo () {
        changeVideoTag('/mediatagref/addOrEditTagRef', this.tagConfirm).then(res => {
          if (res.code === 0) {
            this._getBandDetail();
            this.dialogVisible = false;
          };
        });
      },
      fnUploadRequests (option) {
        console.log(123);
        doUpload(option, 'sound-code/video').then((res) => {
          console.log(res);
          let progress = document.getElementsByClassName('el-upload-list__item is-uploading');
          setTimeout(() => {
            for (let i = 0; i < progress.length; i++) {
              progress[i].style.display = 'none';
            }
          }, 1000);
          this.formLabelAlign.soundTooMediaUrl = res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'));
        });
      },
      getCheckDetail () {
        console.log(this.formLabelAlign);
        if (this.formLabelAlign.ascriptionType === '0') {
          this.formLabelAlign.ascription = '';
        }
        goToCommit('/videoInfo/videoInAudit', this.formLabelAlign).then(res => {
          if (res.code === 0) {
            this._getBandDetail();
            this.recheck = false;
          };
        });
      },
      goToReject () {
        commitStatus('/videoInfo/videoAudit', {
          id: this.videoDetail.id,
          auditStage: 3
        }).then(res => {
          if (res.code === 0) {
            this._getBandDetail();
            this.recheck = false;
          }
        });
      },
      goToPass () {
        commitStatus('/videoInfo/videoAudit', {
          id: this.videoDetail.id,
          auditStage: 2
        }).then(res => {
          if (res.code === 0) {
            this._getBandDetail();
            this.recheck = false;
          }
        });
      }
      // getVideo () {
      //   downLoad('video/1545877372250.mp4').then(res => {
      //     console.log(res);
      //   });
      // }
    },
    created () {
      this._getBandDetail();
      this._getBandList();
      this._getBandTag();
      this._getlog();
      console.log(this.tagOne);
    }
  };
</script>
<style lang="scss" scoped>
  .wrapper {
    .text {
      line-height: 34px;
    }
    .table {
      margin-top: 20px;
    }
  }
</style>
<style lang="scss">
.res-video{
  .el-dialog__wrapper .el-dialog {
    width: 30%;
  }
  .el-upload-list__item .is-uploading {
    height: 30px;
  }
  .el-progress .el-progress--line {
    height: 30px;
  }
}
</style>

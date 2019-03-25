<template>
  <div class="wrapper add-video">
    <el-row>
      <el-col :span="24">
        <div class="clearfix upload-video">
          <span class="text fl">第一步，上传视频</span>
          <el-upload
            class="fl"
            accept="video/*"
            action=""
            :data="formData"
            :http-request="fnUploadRequests"
            :show-file-list="true"
            ref="videoFile"
            >
            <el-button size="large" type="primary">上传视频</el-button>
          </el-upload>
        </div>
      </el-col>
    </el-row>
    <div class="video-info">
      <h4>第二步，编辑视频信息</h4>
      <el-row :gutter="40">
        <el-col :span="8">
          <h3>
            <video v-if="apiData.mediaUrl" controls width="370" id="time" ref="videoInfo" height="200" :src="apiData.mediaUrl"></video>
            <img v-else src="http://iph.href.lu/370x200">
          </h3>
        </el-col>
        <el-col :span="18">
          <el-row :gutter="18">
            <el-col :span="6">
              <span>视频名称：</span>
              <el-input style="width: 200px;" v-model="apiData.title" placeholder="请输入视频名称"></el-input>
            </el-col>
            <el-col :span="6">
              <span>归属：</span>
              <el-select v-model="value" placeholder="请选择归属">
                <el-option v-for="(item, index) in belong" :key="index" :value="item.label">
                  {{item.label}}
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="3">
              <el-button v-if="apiData.ascriptionType === 1" @click="tableBand = true" size="medium" type="primary">选择乐队</el-button>
              <el-dialog title="选择乐队" :visible.sync="tableBand">
                <span>搜索功能：</span>
                <el-input style="width: 40%;margin-bottom: 20px; margin-right: 20px;" placeholder="乐队标题" v-model="searchBand"></el-input>
                <el-button @click="searchBandTo" size="medium" type="primary">搜索乐队</el-button>
                <el-table :data="gridData">
                  <el-table-column property="id" align="center" label="乐队ID" width="100"></el-table-column>
                  <el-table-column property="band_name" align="center" label="乐队名称" width="150"></el-table-column>
                  <el-table-column property="musicCount" align="center" label="单曲数量" width="200"></el-table-column>
                  <el-table-column property="videoCount" align="center" label="视频数量"></el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button @click="handleClick(scope.row)" type="text" size="small">选择</el-button>
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
              <!-- <el-button v-if="apiData.ascriptionType === 2" @click="dialogTableUser = true" size="medium" type="primary">选择用戶</el-button>
              <el-dialog title="选择用户" :visible.sync="dialogTableUser">
                <el-table :data="gridData">
                  <el-table-column property="date" label="乐队名称" width="150"></el-table-column>
                  <el-table-column property="name" label="单曲数量" width="200"></el-table-column>
                  <el-table-column property="address" label="视频数量"></el-table-column>
                  <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                    <template slot-scope="scope">
                      <el-button @click="handleClick(scope.row)" type="text" size="small">选择</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-dialog> -->
            </el-col>
            <el-col style="line-height: 36px;" :span="4" v-if="apiData.ascriptionType === 1">
              <span>乐队名称：{{band_name}}</span>
            </el-col>
          </el-row>
          <el-button
            size="medium"
            type="primary"
            @click="dialogVisible=true"
          >标签选择</el-button>
          <el-row :gutter="20" style="margin-top: 30px;">
            <el-col :span="11.5">
              <span class="text">视频标签：<span style="margin-right: 5px;" v-for="(value, index) in tagValue" :key="index">{{value.replace(/\d+/g,'')}}</span></span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <p>播放时长：{{apiData.mediaTime}}</p>
              <p>文件数据：{{apiData.mediaSize}}</p>
              <p>文件路径：{{apiData.mediaUrl}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-row>
      <el-col :span="24">
        <div class="clearfix upload-video">
          <span class="text fl">第三步，发布视频</span>
            <el-button size="large" type="primary" @click="goToVideoList">发布</el-button>
        </div>
      </el-col>
    </el-row>
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
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {doUpload} from 'utils/upload.js';
  import {mapGetters} from 'vuex';
  import { getBandTag, getBandList } from 'server/content';
  import { subMitVideo } from 'server/status';
  import { timeTo } from 'utils/time.js';
  // 帧数
  const FRAME_NUM = 'x-oss-process=video/snapshot,t_10000,f_jpg,w_800,h_600,m_fast';

  export default {
    name: 'AddVideo',
    data () {
      return {
        uploadUrl: '',
        dialogVisible: false,
        tableBand: false,
        dialogTableUser: false,
        formData: {},
        tagOne: [],
        belong: [{value: '0', label: '好乐'}, {value: '1', label: '乐队'}],
        activeName: 'style',
        value: '',
        tagValue: '',
        gridData: [],
        tagAll: [],
        band_name: '',
        apiData: {
          mediaFormat: '',
          mediaResolution: '',
          mediaSize: '',
          mainImage: '',
          title: '',
          mediaTime: '',
          ascriptionType: Number,
          mediaUrl: '',
          qualityCode: '',
          tagIds: ''
        },
        searchBand: '',
        currentPage: 1,
        totalPage: ''
      };
    },
    computed: {
      ...mapGetters(['uploadData'])
    },
    methods: {
      fnUploadRequests (option) {
        console.log(this.$refs.videoFile);
        doUpload(option, 'video/band').then((res) => {
          let progress = document.getElementsByClassName('el-upload-list__item is-uploading');
          setTimeout(() => {
            for (let i = 0; i < progress.length; i++) {
              progress[i].style.display = 'none';
            }
          }, 1000);
          this.apiData.mediaUrl = res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'));
          this.apiData.mainImage = `${res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'))}?${FRAME_NUM}`;
          this.apiData.title = option.file.name.substring(0, option.file.name.length - 4);
          this.apiData.mediaSize = `${Math.round(option.file.size / 1024 / 1024)}`;
          // this.apiData.mediaTime = this.$refs.videoInfo.duration;
          this.$nextTick(() => {
            setTimeout(() => {
              let time = `${Math.round(document.getElementById('time').duration)}`;
              console.log(this.$refs.videoInfo.duration);
              // this.apiData.mediaTime = `${Math.round(document.getElementById('time').duration)}`;
              this.apiData.mediaTime = timeTo(time);
              // this.apiData.mediaTime = Math.floor(time / 3600) + ':' + Math.floor(time % 3600 / 60) + ':' + time % 60;
            }, 4000);
          });
        });
      },
      handleClick(tab) {
        console.log(tab);
        this.band_name = tab.bandName;
        this.apiData.ascription = tab.id;
        console.log(this.apiData.ascription);
        this.tableBand = false;
      },
      handleCheckedCitiesChange (value) {
        console.log(value);
        this.tagValue = value;
        let newValue = [];
        value.forEach(item => {
          let newItem = parseInt(item);
          newValue.push(newItem);
        });
        this.apiData.tagIds = newValue.join(',');
        console.log(this.apiData.tagIds);
      },
      goToVideoList () {
        console.log(this.apiData);
        subMitVideo('/videoInfo/addVideo', this.apiData).then(res => {
          if (res.code === 0) {
            console.log(res.data);
            this.$router.push({
              path: '/content/video'
            });
            this.$message.success('添加成功');
          }
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
      }
    },
    watch: {
      value () {
        if (this.value === '好乐') {
          this.apiData.ascriptionType = 0;
          this.apiData.ascription = '';
        } else if (this.value === '乐队') {
          this.apiData.ascriptionType = 1;
        };
        // else if (this.value === '用户') {
        //   this.apiData.ascriptionType = 2;
        // };
      },
      tableBand () {
        this._getBandList(
          {
            current: 1,
            size: 10,
            keyWord: this.searchBand
          }
        );
      }
    },
    created() {
      getBandTag('/tagInfo/tagList', {
        tagType: 1
      }).then((res) => {
        this.tagAll = res.data;
      });
      this._getBandList();
    },
    mounted () {
      this.$nextTick(() => {
      });
    }
  };
</script>

<style lang="scss" scoped>
  .add-video {
    .text {
      padding-right: 30px;
      line-height: 40px;
    }
    .video-info {
      h4 {
        font-weight: normal;
      }
    }
  }
</style>
<style>
  /* .el-upload-list .el-upload-list--text {
    display: none;
  } */
  .el-upload-list__item {
    display: block;
    width: 200px;
    height: 50px !important;
  }
</style>

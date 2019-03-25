<template>
  <div class="wrapper">
    <div class="search">
      <el-form
        class="fl"
        :inline="true"
        :model="form">
        <el-form-item>
          <el-input
            style="width: 300px"
            v-model="form.cont"
            placeholder="用户ID、昵称、账号、姓名">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.status">
            <el-option
              v-for="item in form.statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button class="fr" type="primary" @click="handleAddBand">添加乐队</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        size="small"
        border
        stripe
        fit
        style="width: 100%">
        <el-table-column align="center" label="乐队ID">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="LOGO" width="80">
          <template slot-scope="scope">
            <span><img width="50" v-if="scope.row.logo" :src="scope.row.logo" alt=""></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="乐队">
          <template slot-scope="scope">
            <span>{{scope.row.bandName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="城市">
          <template slot-scope="scope">
            <span>{{scope.row.provinceName}} {{scope.row.cityName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="队长昵称">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="队长账号">
          <template slot-scope="scope">
            <span>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="人数" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.memberCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="专辑数" width="60">
          <template slot-scope="scope">
            <span>{{scope.row.albumCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="音乐数">
          <template slot-scope="scope">
            <span>{{scope.row.musicCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="视频数">
          <template slot-scope="scope">
            <span>{{scope.row.videoCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.authenticationTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.authenticationStatus === 0" type="info" size="mini">未认证</el-tag>
            <el-tag v-else type="success" size="mini">已认证</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="280">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.authenticationStatus === 0"
              @click="handleAddCaptain(scope.row.id)"
              size="mini"
              type="text">添加队长
            </el-button>
            <el-button
              v-if="scope.row.authenticationStatus === 1"
              @click="handleEditPlayer(scope.row.id)"
              size="mini"
              type="text">乐队管理
            </el-button>
            <el-button
              @click="handleEditBand(scope.row.id)"
              size="mini"
              type="text">修改基本信息
            </el-button>
            <el-button size="mini" type="text" @click="$router.push({
              path: '/band/band-detail',
              query: {
                id: scope.row.id
              }
            })">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :current-page="current"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      top="50px"
      width="700px"
      title="乐队管理"
      :visible.sync="dialogVisible">
      <el-form
        ref="bandForm"
        :model="bandForm"
        :rules="rules"
        label-width="110px">
        <div v-if="!memberStatus">
          <el-form-item label="乐队LOGO：" prop="logo">
            <el-upload
              class="banner-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadAvatar"
              :show-file-list="false">
              <img v-if="bandForm.logo" :src="bandForm.logo" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span style="color: red">请上传200*200大小的图片</span>
          </el-form-item>
          <el-form-item label="主题图片：" prop="mainImage">
            <el-upload
              class="banner-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :before-upload="beforeAvatarUpload"
              :http-request="uploadMainImage"
              :show-file-list="false">
              <img v-if="bandForm.mainImage" :src="bandForm.mainImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span style="color: red">请上传500*440大小的图片</span>
          </el-form-item>
          <el-form-item label="乐队名称：" prop="bandName">
            <el-input
              style="width: 240px"
              v-model="bandForm.bandName"
              placeholder="请输入乐队名称">
            </el-input>
          </el-form-item>
          <el-form-item label="城市：" prop="cityId">
            <el-cascader
              style="width: 240px"
              :options="cascaderOptions"
              v-model="selectProvinceAndCity">
            </el-cascader>
          </el-form-item>
          <el-form-item label="乐队简介：" prop="introduction">
            <el-input
              style="width: 240px"
              type="textarea"
              :rows="4"
              placeholder="请输入简介"
              v-model="bandForm.introduction">
            </el-input>
          </el-form-item>
        </div>
        <div v-if="!bandForm.id">
          <el-form-item label="乐队队长：">
            <span>
              {{captainInfo.name}}
              {{captainInfo.name ? '——' : ''}}
              {{captainInfo.certifiedInstrument}}
            </span>
            <!--<el-button size="mini" type="primary" @click="handleAddCaptain">
              {{captainInfo.id ? '修改队长' : '添加队长'}}
            </el-button>-->
            <el-button size="mini" type="primary" @click="handleCreateAddCaptain">
              添加队长
            </el-button>
          </el-form-item>
          <el-form-item v-if="captainInfo.id" label="乐队成员：">
            <div v-for="(item, index) in memberList" :key="item.id">
              <span style="padding-right: 10px">{{item.nickname}}——{{item.certifiedInstrument}}</span>
              <el-button
                size="mini"
                type="primary"
                @click="handleRemoveMember(index)">删除成员
              </el-button>
            </div>
            <el-button
              size="mini"
              type="primary"
              @click="handleCreateAddMember">添加成员
            </el-button>
          </el-form-item>
        </div>
        <div v-if="memberStatus">
          <el-table
            :data="memberList"
            size="small"
            style="width: 100%">
            <el-table-column width="100px"
              label="昵称">
              <template slot-scope="scope">
                <span>{{scope.row.nickname}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.realName}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="性别">
              <template slot-scope="scope">
                <span>{{scope.row.sex | getGeneralText}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="擅长技能">
              <template slot-scope="scope">
                <span>{{scope.row.certifiedInstrument}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="队长">
              <template slot-scope="scope">
                <span>{{scope.row.identity === 0 ? '队长':''}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-if="scope.row.identity !== 0"
                  type="danger" @click="removeMember(scope.row)">踢出乐队
                </el-button>
                <el-button
                  size="mini"
                  type="success"
                  v-if="scope.row.identity !== 0"
                  @click="setCaptain(scope.row)">设为队长
                </el-button>
              </template>
              <el-button
                size="mini">编辑
              </el-button>
            </el-table-column>
          </el-table>
          <div class="btn-box">
            <el-button
              size="mini"
              @click="handleAddMember">添加成员
            </el-button>
          </div>
          <!--<el-form-item label="乐队成员：">
            <div v-for="(item, index) in memberList" :key="item.id">
              <span style="padding-right: 10px">{{item.nick}}——{{item.certifiedInstrument}}</span>
              <el-button
                size="mini"
                type="primary"
                @click="handleRemoveMember(index)">删除成员
              </el-button>
            </div>
            <el-button
              size="mini"
              type="primary"
              @click="handleAddMember">添加成员
            </el-button>
          </el-form-item>-->
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-if="memberStatus" type="primary" @click="dialogVisible = false">确 定</el-button>
        <el-button v-else type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      top="50px"
      :title="isMember ? '添加成员':'添加队长'"
      :visible.sync="musiciansVisible"
      width="60%"
      append-to-body>
      <div class="wrapper">
        <div class="search">
          <el-form
            class="fl"
            :inline="true"
            :model="captainForm">
            <el-form-item>
              <el-input
                style="width: 350px"
                v-model="captainForm.cont"
                placeholder="输入用户ID、昵称、账号、姓名">
              </el-input>
            </el-form-item>
           <!-- <el-form-item>
              <el-select v-model="captainForm.status">
                <el-option
                  v-for="item in captainForm.statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>-->
            <el-form-item>
              <el-button type="primary" @click="handleCaptainSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table">
          <el-table
            :data="captainList"
            border
            empty-text="请在上方输入关键字进行以及状态进行搜索"
            size="mini"
            fit
            highlight-current-row
            style="width: 100%">
            <el-table-column align="center" label="用户ID" >
              <template slot-scope="scope">
                <span>{{scope.row.id}}</span>
              </template>
            </el-table-column>
            <el-table-column
              align="center" label="头像" width="70">
              <template slot-scope="scope">
                <span><img width="50" v-if="scope.row.headImage" :src="scope.row.headImage" alt=""></span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="昵称">
              <template slot-scope="scope">
                <span>{{scope.row.nickname}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="注册账号">
              <template slot-scope="scope">
                <span>{{scope.row.account}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="姓名">
              <template slot-scope="scope">
                <span>{{scope.row.realName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="归属乐队">
              <template slot-scope="scope">
                <span>{{scope.row.ascriptionBand}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="擅长技能">
              <template slot-scope="scope">
                <span>{{scope.row.certifiedInstrument}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="注册时间">
              <template slot-scope="scope">
                <span>{{scope.row.signUpTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="认证">
              <template slot-scope="scope">
                <span>{{scope.row.identity}}</span>
              </template>
            </el-table-column>
           <!-- <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.status === 0 ? '正常' : '封禁'}}</span>
              </template>
            </el-table-column>-->
            <el-table-column align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="success" size="mini" @click="handleSetMember(scope.row)">添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      top="50px"
      width="1200px"
      title="修改队长"
      :visible.sync="captainVisible">
      <captain-list v-if="captainVisible" :bandId="bandForm.id" @selectCaptain="selectCaptain"></captain-list>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getBandList,
    getBandsmenList,
    createBand,
    getBandDetails,
    editCaptain,
    editMember,
    setBandCaptain,
    removeMember
  } from '../../server/content';
  // import { beforeAvatar } from '../../mixins';
  import {provinceAndCityData, CodeToText} from 'element-china-area-data';
  import {doUpload} from '../../utils/upload';
  import {aliOssUrl} from '../../config/env';
  import CaptainList from './CaptainList';

  export default {
    name: 'Band',
    data() {
      return {
        addCaptainFlag: false,
        addMemberFlag: false,
        form: {
          cont: '',
          status: '',
          statusOptions: [{
            value: '',
            label: '全部状态'
          }, {
            value: 0,
            label: '未认证'
          }, {
            value: 1,
            label: '已认证'
          }]
        },
        captainForm: {
          cont: '',
          status: 1,
          statusOptions: [{
            value: '',
            label: '全部状态'
          }, {
            value: 0,
            label: '未认证'
          }, {
            value: 1,
            label: '已认证'
          }]
        },
        list: [],
        current: 1,
        total: 0,
        dialogVisible: false,
        musiciansVisible: false,
        captainVisible: false,
        memberStatus: false,
        bandForm: {
          id: '',
          logo: '',
          bandName: '',
          mainImage: '',
          introduction: '',
          provinceId: '',
          provinceName: '',
          cityId: '',
          cityName: '',
          captainId: '',
          memberIds: ''
        },
        cascaderOptions: provinceAndCityData,
        selectProvinceAndCity: [],
        captainInfo: {},
        memberList: [],
        isMember: false,
        isEdit: false,
        captainList: [],
        captainCurrent: 1,
        captainTotal: 0,
        currentCap: 1,
        rules: {
          logo: [
            {required: true, message: '请上传乐队LOGO', trigger: 'blur'}
          ],
          mainImage: [
            {required: true, message: '请上传主题图片', trigger: 'blur'}
          ],
          bandName: [
            {required: true, message: '请输入乐队名称', trigger: 'blur'}
          ],
          cityId: [
            {required: true, message: '请选择城市', trigger: 'blur'}
          ],
          introduction: [
            {required: true, message: '请输入乐队简介', trigger: 'blur'}
          ],
          captainId: [
            {required: true, message: '请选择乐队队长', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.getBandData({
        current: 1,
        size: 10
      });
    },
    components: {
      CaptainList
    },
    // mixins: [beforeAvatar],
    methods: {
      // 设为队长
      // todo 设置队长接口验证
      setCaptain(memberData) {
        this.$confirm(`是否将${memberData.nickname}设置为队长?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let bandId = this.bandForm.id;
          setBandCaptain('bandInfo/editCaptainId', {
            bandId: bandId,
            id: memberData.id
          }).then(res => {
            if (res.code === 0) {
              this.getBandDetail(bandId);
              this.handleCurrentChange(this.currentCap);
              this.musiciansVisible = false;
              this.$message({
                type: 'success',
                message: res.msg
              });
            }
          });
        });
      },
      removeMember(memberData) {
        // todo 验证踢出成员接口
        this.$confirm(`是否将${memberData.nickname}踢出此乐队?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeMember('bandInfo/kickOutMember', {
            bandId: this.bandForm.id,
            id: memberData.id
          }).then(res => {
            let bandId = this.bandForm.id;
            if (res.code === 0) {
              this.$message({
                type: 'success',
                message: res.msg
              });
              this.getBandDetail(bandId);
              this.handleCurrentChange(this.currentCap);
            }
          });
        });
      },
      getBandData(params) {
        getBandList('bandInfo/bandList', params).then(res => {
          if (res.code === 0) {
            // this.list = res.data;
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      getBandsMenData(params) {
        // todo 数据列表接口调整 获取人员信息
         getBandsmenList('musician/uncertifiedMemberList', params).then(res => {
          if (res.code === 0) {
            this.captainList = res.data;
          }
        });
      },
      handleSearch() {
        this.getBandData({
          current: 1,
          size: 10,
          keyWord: this.form.cont,
          status: this.form.status
        });
      },
      handleCurrentChange(val) {
        console.log(val);
        this.currentCap = val;
        this.getBandData({
          current: val,
          size: 10,
          keyWord: this.form.cont,
          status: this.form.status
        });
      },
      uploadAvatar(option) {
        doUpload(option, 'image/avatar').then(res => {
          this.bandForm.logo = `${aliOssUrl}/${res.name}`;
        });
      },
      uploadMainImage(option) {
        doUpload(option, 'image/avatar').then(res => {
          this.bandForm.mainImage = `${aliOssUrl}/${res.name}`;
        });
      },
      handleAdd() {
        this.dialogVisible = true;
        this.bandForm.provinceId = this.selectProvinceAndCity[0];
        this.bandForm.cityId = this.selectProvinceAndCity[1];
        this.bandForm.provinceName = CodeToText[this.selectProvinceAndCity[0]];
        this.bandForm.cityName = CodeToText[this.selectProvinceAndCity[1]];
        this.bandForm.captainId = this.captainInfo.id;
        this.bandForm.memberIds = this.memberList.map(item => {
          return item.id;
        }).join(',');
        let bandData = Object.assign({}, this.bandForm);
        if (this.bandForm.id) {
          delete bandData.captainId;
          delete bandData.memberIds;
        }
        this.$refs['bandForm'].validate((valid) => {
          if (valid) {
            createBand('bandInfo/addOrUpdateBand', {
              ...bandData
            }).then(res => {
              if (res.code === 0) {
                if (this.bandForm.id) {
                  this.$message.success('编辑成功!');
                } else {
                  this.$message.success('添加成功!');
                }
                this.dialogVisible = false;
                this.getBandData({
                  current: 1,
                  size: 10
                });
              }
            });
          }
        });
      },
      handleAddCaptain(id) {
        this.bandForm.id = id;
        this.musiciansVisible = true;
        this.isMember = false;
        this.addCaptainFlag = false;
        /* this.getBandsMenData({
          current: 1,
          size: 5
        }); */
      },
      handleCreateAddCaptain () {
        // 新建乐队添加队长
        this.musiciansVisible = true;
        this.isMember = false;
        this.addCaptainFlag = true;
      },
      handleAddMember() {
        this.musiciansVisible = true;
        this.isMember = true;
        this.addCaptainFlag = false;
        this.addMemberFlag = false;
      },
      handleCreateAddMember() {
        // 新建乐队添加成员
        this.musiciansVisible = true;
        this.isMember = true;
        this.addMemberFlag = true;
      },
      handleCaptainCurrentChange(val) {
        this.getBandsMenData({
          current: val,
          size: 5
        });
      },
      handleCaptainSearch() {
        if (!this.captainForm.cont) {
          this.$message.error('请输入关键字再进行搜索');
          return;
        }
        this.getBandsMenData({
          keyWord: this.captainForm.cont,
          authenticatedState: this.captainForm.status
        });
      },
      handleSetMember(memberData) {
        // todo 添加队长 队员
        console.log(memberData);
        if (this.isMember) {
          // 判断是否从添加乐队的添加成员入口进入
          if (this.addMemberFlag) {
            this.handleCaptain(memberData);
          } else {
            this.$confirm(`是否将${memberData.nickname}添加为乐队队员?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              removeMember('bandInfo/editMember', {
                bandId: this.bandForm.id,
                id: memberData.id
              }).then(res => {
                let bandId = this.bandForm.id;
                if (res.code === 0) {
                  this.$message({
                    type: 'success',
                    message: res.msg
                  });
                  this.getBandDetail(bandId);
                  this.handleCurrentChange(this.currentCap);
                  this.musiciansVisible = false;
                }
              });
            });
          }
        } else {
          // 判断是否从添加乐队的添加队长入口进入
          if (this.addCaptainFlag) {
            this.handleCaptain(memberData);
          } else {
            this.$confirm(`是否将${memberData.nickname}设置为队长?`, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              let bandId = this.bandForm.id;
              setBandCaptain('bandInfo/editCaptainId', {
                bandId: bandId,
                id: memberData.id
              }).then(res => {
                if (res.code === 0) {
                  this.handleCurrentChange(this.currentCap);
                  this.musiciansVisible = false;
                  this.$message({
                    type: 'success',
                    message: res.msg
                  });
                }
              });
            });
          }
        }
      },
      handleCaptain(row) {
        this.musiciansVisible = false;
        if (this.isMember) {
          this.memberList.push({
            id: row.id,
            nickname: row.nickname,
            name: row.name,
            certifiedInstrument: row.certifiedInstrument
          });
        } else {
          this.captainInfo.id = row.id;
          this.captainInfo.name = row.nickname;
          this.captainInfo.certifiedInstrument = row.certifiedInstrument;
        }
      },
      handleRemoveMember(index) {
        this.memberList.splice(index, 1);
      },
      handleAddBand() {
        this.dialogVisible = true;
        this.captainInfo = {};
        this.memberList = [];
        this.bandForm.id = '';
        this.memberStatus = false;
        Object.keys(this.bandForm).forEach(key => {
          this.bandForm[key] = '';
        });
        this.selectProvinceAndCity = [];
        this.$nextTick(() => {
          this.$refs['bandForm'].resetFields();
        });
      },
      handleEditBand(id) {
        setTimeout(() => {
          if (this.$refs['bandForm']) {
            this.$refs['bandForm'].resetFields();
          }
        }, 20);
        this.dialogVisible = true;
        this.memberStatus = false;
        this.memberList = [];
        this.captainInfo = {};
        getBandDetails('bandInfo/bandDetails', {
          id
        }).then(res => {
          if (res.code === 0) {
            Object.keys(this.bandForm).forEach(key => {
              if (res.data.bandInfo.hasOwnProperty(key)) {
                this.bandForm[key] = res.data.bandInfo[key];
              }
            });
            this.selectProvinceAndCity = [res.data.bandInfo.provinceId, res.data.bandInfo.cityId];
            res.data.bandMemberDetailsList.forEach(item => {
              if (item.identity_flag === 1) {
                this.bandForm.captainId = item.id;
                this.captainInfo.id = item.id;
                this.captainInfo.name = item.nickname;
                this.captainInfo.certifiedInstrument = item.certified_instrument;
              } else {
                this.memberList.push({
                  // todo 成员数据修改
                  id: item.id,
                  nickname: item.nickname,
                  realName: item.realName,
                  certifiedInstrument: item.certified_instrument
                });
              }
            });
          }
        });
      },
      handleEditCaptain(id) {
        this.captainVisible = true;
        this.bandForm.id = id;
      },
      selectCaptain(params) {
        this.captainVisible = false;
        editCaptain('bandInfo/editCaptainId', {
          ...params
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('编辑队长成功！');
            this.getBandData({
              current: this.currentCap || 1,
              size: 10
            });
          }
        });
      },
      handleEditPlayer(id) {
        this.memberStatus = true;
        this.dialogVisible = true;
        this.memberList = [];
        this.bandForm.id = id;
        this.getBandDetail(id);
      },
      getBandDetail(id) {
        getBandDetails('bandInfo/bandMember', {
          id: id
        }).then(res => {
          if (res.code === 0) {
            this.memberList = [];
            res.data.forEach(item => {
              this.memberList.push({
                // todo 成员数据修改
                id: item.id,
                realName: item.realName,
                nickname: item.nickname,
                sex: item.sex,
                identity: item.identity,
                certifiedInstrument: item.certifiedInstrument
              });
            });
          }
        });
      },
      handleConfirmMember() {
        let ids = this.memberList.map(item => item.id).join(',');
        editMember('bandInfo/editMember', {
          bandId: this.bandForm.id,
          ids: ids
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('修改成功！');
            this.memberStatus = false;
            this.dialogVisible = false;
            this.getBandData({
              current: 1,
              size: 10
            });
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .btn-box {
    text-align: right;
    padding: 10px 15px;
  }
</style>
<style lang="scss">
  .wrapper {
    .banner-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }

    .banner-uploader .el-upload:hover {
      border-color: #409EFF;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 180px;
      height: 120px;
      line-height: 120px;
      text-align: center;
    }

    .avatar {
      width: 180px;
      height: 120px;
      display: block;
    }
  }
</style>

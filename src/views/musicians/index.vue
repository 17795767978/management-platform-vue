<template>
  <div class="wrapper">
    <div class="search">
      <el-form
        class="fl"
        :inline="true"
        :model="form">
        <el-form-item>
          <el-input
            style="width: 350px"
            v-model="form.cont"
            placeholder="用户名称">
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
          <el-select v-model="form.statusUser">
            <el-option
              v-for="item in form.statusUsers"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.statusMusician">
            <el-option
              v-for="item in form.statusMusicians"
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
      <el-button type="primary" style="float: right" @click="dialogMusicians = true">新建音乐人</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="用户ID">
          <template slot-scope="scope">
            <span>{{scope.row.id}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="头像">
          <template slot-scope="scope">
            <img width="80" height="80" :src="scope.row.headImage" alt="">
          </template>
        </el-table-column>
        <el-table-column align="center" label="用户昵称">
          <template slot-scope="scope">
            <span>{{scope.row.nickname}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope">
            <span>{{scope.row.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册账号">
          <template slot-scope="scope">
            <span>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="归属乐队">
          <template slot-scope="scope">
            <span>{{scope.row.ascriptionBand}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="粉丝数">
          <template slot-scope="scope">
            <span>{{scope.row.fansCount}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="擅长技能">
          <template slot-scope="scope">
            <span>{{scope.row.certifiedInstrument}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="认证身份">
          <template slot-scope="scope">
            <span>{{scope.row.identity}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册时间">
          <template slot-scope="scope">
            <span>{{scope.row.signUpTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="认证时间">
          <template slot-scope="scope">
            <span>{{scope.row.authenticationTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.closure === 0 ? '正常' : '封禁'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="$router.push({
                name: 'UserDetail',
                query: {
                  id: scope.row.id,
                  bandId: scope.row.bandId,
                  status: 1,
                  virtu: scope.row.virtu
                }
              })">查看</el-button>
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
    <el-dialog title="新建音乐人" :visible.sync="dialogMusicians">
      <el-row :gutter="24">
        <el-col :span="2.5" style="line-height: 36px;">您的姓名*</el-col>
        <el-col :span="8">
          <el-input maxlength="5" v-model="newMusicianList.realName" placeholder="姓名"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="2.5" style="line-height: 36px;">擅长技能*</el-col>
        <el-col :span="6">
          <el-input v-model="newMusicianList.certifiedInstrument" maxlength="10" placeholder="如主唱，贝斯，打击乐"></el-input>
        </el-col>
        <el-col :span="2.5" style="line-height: 36px;">{{newMusicianList.certifiedInstrument.length}}/10</el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="2.5" style="line-height: 36px;">您的性别*</el-col>
        <el-col :span="8">
          <el-select v-model="newMusicianList.sex" placeholder="请选择性别">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="2.5">
          认证身份
        </el-col>
        <el-col :span="3">
          音乐人
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="2.5">
          个人照片*
        </el-col>
        <el-col :span="8">
          <el-upload
            class="avatar-uploader"
            accept="image/*"
            :show-file-list="false"
            action=""
            :http-request="fnUploadRequests"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="newMusicianList.picture" width="200" height="200" :src="newMusicianList.picture" class="avatar">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-col>
        <el-col :span="10"><span style="color: red">请上传200*200的图片</span></el-col>
      </el-row>
      <el-row>关联用户 （可不关联任何用户）</el-row>
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input v-model="keyWord" placeholder="昵称、注册账号"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getUncertifiedMemberList">搜索</el-button>
        </el-col>
        <el-col style="line-height:36px" :span="10">
          <span>仅能查看未封禁，未认证的用户</span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-table
          ref="multipleTable"
          :data="connectUser"
          border
          tooltip-effect="dark"
          style="width: 100%">
          <el-table-column
            align="center"
            label="用户ID"
            prop="id"
            width="60">
          </el-table-column>
          <el-table-column
            align="center"
            prop="headImage"
            label="头像"
            width="120">
            <template slot-scope="scope">
              <img width="60" height='60' :src="scope.row.headImage" alt="">
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="nickname"
            label="用户昵称"
            width="120">
          </el-table-column>
          <el-table-column
            align="center"
            prop="account"
            label="注册账号"
            width="120">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fansCount"
            label="粉丝数"
            width="80">
          </el-table-column>
          <el-table-column
            align="center"
            label="认证身份"
            prop="identity"
            width="90">
          </el-table-column>
          <el-table-column
            align="center"
            prop="signUpTime"
            label="注册时间"
            width="180">
          </el-table-column>
          <el-table-column
            align="center"
            prop="closure"
            label="状态"
            width="70">
            <template slot-scope="scope">
              {{scope.row.closure == 0 ? '正常' : '禁用'}}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="关联"
            prop="connect"
            width="95"
            >
            <template slot-scope="scope">
              <el-button v-if="scope.row.id == newMusicianList.memberId" size="mini" type="success">已关联</el-button>
              <el-button v-else size="mini" native-type="button" @click="getConnectId(scope.row)">未关联</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMusicians = false">取 消</el-button>
        <el-button type="primary" @click="goToSaveMusician">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { musicianList, saveMusician, uncertifiedMemberList } from '../../server/musician';
  import {doUpload} from 'utils/upload.js';
  const ERR_OK = 0;
  export default {
    name: 'Musicians',
    data () {
      return {
        form: {
          cont: '',
          status: 'all',
          statusUser: 0,
          statusMusician: 0,
          statusOptions: [{value: 'all', label: '全部'}, {value: 'chapter', label: '乐队队长'}, {value: 'member', label: '乐队成员'}, {value: 'musician', label: '音乐人'}],
          statusUsers: [{value: 0, label: '正常用户'}, {value: 1, label: '封禁用户'}],
          statusMusicians: [{value: 0, label: '真实音乐人'}, {value: 1, label: '虚拟音乐人'}]
        },
        options2: [
          {
            value: 1,
            label: '男',
            disabled: false
          },
          {
            value: 2,
            label: '女',
            disabled: false
          }
        ],
        list: [],
        newMusicianList: {
          realName: '',
          sex: '',
          certifiedInstrument: '',
          picture: '',
          memberId: ''
        },
        connectUser: [],
        current: 1,
        total: 0,
        dialogMusicians: false,
        keyWord: '',
        isConnect: true,
        noConnect: false
      };
    },
    created () {
      this._musicianList({
        current: 1,
        size: 10,
        keyWord: this.form.cont,
        identity: this.form.status,
        closure: this.form.statusUser,
        virtual: this.form.statusMusician
      });
    },
    watch: {
      'form.statusMusician': {
        deep: true,
        handler () {
          if (this.form.statusMusician === 1) {
            this.form.status = 'musician';
          }
        }
      }
    },
    methods: {
      _musicianList (params) {
        musicianList('/musician/musicianList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            if (this.list.length === 0) {
              this.$message.error('没有查到相关音乐人');
            }
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this._musicianList({
          current: 1,
          size: 10,
          keyWord: this.form.cont,
          identity: this.form.status,
          closure: this.form.statusUser,
          virtual: this.form.statusMusician
        });
      },
      handleCurrentChange (val) {
        this._musicianList({
          current: val,
          size: 10,
          keyWord: this.form.cont,
          identity: this.form.status,
          closure: this.form.statusUser,
          virtual: this.form.statusMusician
        });
      },
      fnUploadRequests (option) {
        doUpload(option, 'image/band').then((res) => {
          this.newMusicianList.picture = res.res.requestUrls[0].indexOf('?') > 0 ? `${res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'))}` : `${res.res.requestUrls[0]}`;
        });
      },
      getUncertifiedMemberList () {
        if (this.keyWord.length === 0) {
          this.$message.error('请添加搜索内容');
        } else {
          uncertifiedMemberList('/musician/uncertifiedMemberList', {keyWord: this.keyWord, authenticatedState: 0}).then((res) => {
            if (res.code === ERR_OK) {
              this.connectUser = res.data;
            }
          });
        }
      },
      getConnectId (row) {
        this.newMusicianList.memberId = row.id;
        console.log(row.id === this.memberId);
      },
      goToSaveMusician () {
        if (this.newMusicianList.picture.length === 0) {
          this.$message.error('请添加个人照片');
        } else if (this.newMusicianList.realName.length === 0) {
          this.$message.error('请填写您的姓名');
        } else if (this.newMusicianList.sex.length === 0) {
          this.$message.error('请填写您的性别');
        } else if (this.newMusicianList.certifiedInstrument.length === 0) {
          this.$message.error('请填写您擅长的技能');
        } else {
          saveMusician('/musician/saveMusician', this.newMusicianList).then((res) => {
            if (res.code === ERR_OK) {
              this.dialogMusicians = false;
              this.$message.success('添加成功');
              this._auditMusicianList({
                current: 1,
                size: 10
              });
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
.avatar {
  width:200px;
  height: 200px;
}
</style>
<style lang="scss">
  .avatar-uploader {
    .el-upload {
      width: 200px;
      height: 200px;
    }
    .avatar-uploader-icon {
      width: 200px;
      height: 200px;
      line-height: 200px;
    }
  }
</style>

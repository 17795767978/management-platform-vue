<template>
  <div class="wrapper">
    <el-row :gutter="24">
      <el-col style="line-height:36px" :span="18">
        <span>{{detailStatus}}</span>
      </el-col>
      <el-col v-if="memberInfo.auditState === 0" :span="2">
        <el-button type="danger" @click="reject = true">驳回</el-button>
      </el-col>
      <el-col :span="2" v-if="memberInfo.auditState === 0">
        <el-button type="success" @click="pass = true">通过</el-button>
      </el-col>
      <el-col v-if="memberInfo.auditState !== 0" :span="3">
        <span>{{memberInfo.auditStateName}}</span>
      </el-col>
    </el-row>
    <hr/>
    <el-row>
      乐队信息
    </el-row>
    <el-row v-if="memberInfo">
    <el-row :gutter="24">
      <el-col :span="2" style="line-height: 36px;">昵称：</el-col>
      <el-col v-if="memberInfo.nickname" :span="3" style="line-height: 36px;">{{memberInfo.nickname}}</el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2" style="line-height: 36px;">粉丝数：</el-col>
      <el-col v-if="memberInfo.fansCount" :span="3" style="line-height: 36px;">{{memberInfo.fansCount}}</el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2" style="line-height: 36px;">注册账号：</el-col>
      <el-col v-if="memberInfo.account" :span="3" style="line-height: 36px;">{{memberInfo.account}}</el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2" style="line-height: 36px;">头像：</el-col>
      <el-col :span="5" style="line-height: 36px;">
        <div style="height:200px; width: 200px; border-radius: 50%; background-color: #fff; overflow: hidden">
          <img v-if="memberInfo.headImage" :src="memberInfo.headImage" width="200" height="200" alt="">
        </div>
      </el-col>
    </el-row>
    <hr />
    <el-row :gutter="24">
      <el-col :span="20">
        认证信息
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2">
        <span>申请人姓名：</span>
      </el-col>
      <el-col v-if="memberInfo.realName" :span="3">
        <span>{{memberInfo.realName}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2">
        <span>联系电话：</span>
      </el-col>
      <el-col v-if="memberInfo.telphone" :span="3">
        <span>{{memberInfo.telphone}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2">
        <span>擅长技能：</span>
      </el-col>
      <el-col v-if="memberInfo.certifiedInstrument" :span="3">
        <span>{{memberInfo.certifiedInstrument}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2">
        <span>认证身份：</span>
      </el-col>
      <el-col v-if="memberInfo.identity" :span="3">
        <span>{{memberInfo.identity}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2">
        <span>身份证号：</span>
      </el-col>
      <el-col v-if="memberInfo.idCode" :span="3">
        <span>{{memberInfo.idCode}}</span>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="2">
        <span>个人照片：</span>
      </el-col>
      <el-col :span="3">
        <div style="height:200px; width: 200px; border-radius: 50%; background-color: #eee; overflow: hidden">
          <img v-if="memberInfo.picture" :src="memberInfo.picture" width="200" height="200" alt="">
        </div>
      </el-col>
    </el-row>
    <!-- <el-row :gutter="24">
      <el-col :span="2">
        <span>身份证照片：</span>
      </el-col>
      <el-col :span="5">
        <div style="height:150px; width: 200px; background-color: #ccc; overflow: hidden">
          <img v-if="memberInfo.headImage" :src="memberInfo.headImage" width="200" height="150" alt="身份证照片">
        </div>
      </el-col>
      <el-col :span="5">
        <div style="height:150px; width: 200px; background-color: #ccc; overflow: hidden">
          <img v-if="memberInfo.headImage" :src="memberInfo.headImage" width="200" height="150" alt="身份证照片">
        </div>
      </el-col>
    </el-row> -->
    </el-row>
    <el-row v-else>
      <p>当前乐队信息为空 </p>
    </el-row>
    <hr />
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
          style="width: 90%">
          <el-table-column
            align="center"
            prop="headImage"
            label="照片">
            <template slot-scope="scope">
              <img width="60" height='60' :src="scope.row.headImage" alt="">
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="sex"
            label="性别">
          </el-table-column>
          <el-table-column
            align="center"
            prop="account"
            label="归属乐队"
            width="120">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fansCount"
            label="擅长技能">
          </el-table-column>
          <el-table-column
            align="center"
            label="认证身份"
            prop="identity">
          </el-table-column>
          <el-table-column
            align="center"
            prop="signUpTime"
            label="注册时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="关联"
            prop="connect"
            >
            <template slot-scope="scope">
              <el-button v-if="scope.row.id == memberId" size="mini" type="success">已关联</el-button>
              <el-button v-else size="mini" native-type="button" @click="getConnectId(scope.row)">未关联</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    <hr />
    <el-row>
      审核记录
    </el-row>
    <div class="table">
      <el-table
        :data="auditDetail"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="审核记录" width="150">
          <template slot-scope="scope">
            <span>{{scope.row.authenticateRecord}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="详情">
          <template slot-scope="scope">
            <span>{{scope.row.description}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作人" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.creator}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="时间" width="250">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="pass"
      width="30%"
      style="text-align: center">
      <p>审核通过</p>
      <p>请确认是否通过此乐队的认证申请</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="pass = false">取 消</el-button>
        <el-button type="primary" @click="goTopassOrReject(true)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="驳回认证申请" style="text-align: center" width="30%" :visible.sync="reject">
      <h3>请输入驳回原因并确认：</h3>
      <el-input type="textarea" height="100" v-model="rejectReason" autocomplete="off"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reject = false">取 消</el-button>
        <el-button type="primary" @click="goTopassOrReject(false)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import {auditMusicianInfo, uncertifiedMemberList, musicianAudit} from 'server/musician.js';
import {ERR_OK} from 'config/env.js';
export default {
  name: 'musicianDetail',
  data () {
    return {
      detailStatus: '',
      list: [],
      reject: false,
      pass: false,
      rejectReason: '',
      recheckStatus: false,
      recheckValue: '',
      memberInfo: {},
      auditDetail: [],
      connectUser: [],
      memberId: '',
      keyWord: ''
    };
  },
  created () {
    this._auditMusicianInfo();
  },
  methods: {
    _auditMusicianInfo () {
      auditMusicianInfo('/musician/auditMusicianInfo', {
        Id: this.$route.query.id
      }).then((res) => {
        if (res.code === ERR_OK) {
          this.memberInfo = res.data.memberInfo;
          this.auditDetail = res.data.auditRecords;
          console.log(this.memberInfo);
          console.log(this.auditDetail);
          if (this.memberInfo) {
            if (this.memberInfo.auditState === 0) {
              this.detailStatus = '待审核';
            } else if (this.memberInfo.auditState === 1) {
              this.detailStatus = '审核通过';
            } else if (this.memberInfo.auditState === 2) {
              this.detailStatus = '驳回';
            } else if (this.memberInfo.auditState === 3) {
              this.detailStatus = '放弃';
            } else if (this.memberInfo.auditState === 4) {
              this.detailStatus = '失败';
            }
          }
        }
      });
    },
    getUncertifiedMemberList () {
      uncertifiedMemberList('/musician/uncertifiedMemberList', {keyWord: this.keyWord, authenticatedState: 0}).then((res) => {
        if (res.code === ERR_OK) {
          this.connectUser = res.data;
        }
      });
    },
    getConnectId (row) {
      this.memberId = row.id;
    },
    goTopassOrReject (params) {
      if (params === true) {
        musicianAudit('/musician/musicianAudit', {
          Id: this.$route.query.id,
          auditType: 1,
          memberId: this.memberId
        }).then(res => {
          if (res.code === ERR_OK) {
            this.pass = false;
            this.$message.success('审核通过');
          }
        });
      } else {
        musicianAudit('/musician/musicianAudit', {
          Id: this.$route.query.id,
          auditType: 2,
          memberId: this.memberId,
          reason: this.rejectReason
        }).then(res => {
          if (res.code === ERR_OK) {
            this.reject = false;
            this.rejectReason = '';
            this.$message.warning('审核驳回');
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

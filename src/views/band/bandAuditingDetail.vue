<template xmlns:el-cols="http://www.w3.org/1999/html">
  <div class="wrapper">
    <el-row
      type="flex"
      align="middle">
      <div class="title">
        <span v-if="subsidiaryInfo.auditStatus === 0" style="color: #409eff;">{{subsidiaryInfo.auditStatus | getAuditStatusText}}</span>
        <span v-if="subsidiaryInfo.auditStatus === 1" style="color: #67c23a;">{{subsidiaryInfo.auditStatus | getAuditStatusText}}</span>
        <span v-if="subsidiaryInfo.auditStatus === 2" style="color: #e6a23c;">{{subsidiaryInfo.auditStatus | getAuditStatusText}}</span>
        <span v-if="subsidiaryInfo.auditStatus === 3" style="color: #f56c6c;">{{subsidiaryInfo.auditStatus | getAuditStatusText}}</span>
        <span v-if="subsidiaryInfo.auditStatus === 4" style="color: #909399;">{{subsidiaryInfo.auditStatus | getAuditStatusText}}</span>
      </div>
      <template v-if="subsidiaryInfo.auditStatus === 0">
        <el-button
          size="small"
          type="danger"
          @click="handleBandAudit(2)"
          v-if="subsidiaryInfo.auditStatus !== 2"
        >驳回</el-button>
        <el-button
          v-if="subsidiaryInfo.type === 0 && subsidiaryInfo.auditStatus !== 2"
          size="small"
          type="success"
          @click="handleBandAudit(1)"
        >通过</el-button>
        <el-button
          v-else
          size="small"
          type="success"
          @click="handleBandAudit(1)"
          :disabled="passDisabled"
        >通过</el-button>
      </template>
    </el-row>
    <hr>
    <el-row :gutter="20">
      <h4 class="item-title"><span class="text">乐队信息</span><!--<el-button type="text">修改乐队信息</el-button>--></h4>
      <el-col :span="12">
        <el-form label-width="100px">
          <el-form-item label="乐队名称：">
            <span>{{bandInfo.bandName}}</span>
          </el-form-item>
          <el-form-item label="常住城市：">
            <span>{{bandInfo.provinceName}} {{bandInfo.cityName}}</span>
          </el-form-item>
          <el-form-item label="乐队简介：">
            <span>{{bandInfo.introduction}}</span>
            <div class="text-length" v-if="bandInfo.introduction">({{bandInfo.introduction.length}}/200)</div>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form>
          <el-form-item>
            <span><img class="head-img" v-if="bandInfo.logo" :src="bandInfo.logo" alt=""></span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row v-if="subsidiaryInfo.auditStatus === 0">
      <el-col :span="24">
        <div v-if="subsidiaryInfo.type === 0" class="el-alert el-alert--success">
          <div class="el-alert__content">
            <div class="el-alert__title "><strong>{{bandInfo.bandName}}</strong> 不存在，可认证为新乐队
              <el-button class="alert-btn" size="mini" @click="$router.push({
                path: '/band/list'
            })">搜索相似乐队</el-button></div>
          </div>
        </div>
        <div  v-if="subsidiaryInfo.type === 1" class="el-alert el-alert--warning">
          <div class="el-alert__content">
            <div class="el-alert__title " v-show="!passDisabled" >请点击右上角通过完成操作</div>
            <div class="el-alert__title"  v-show="passDisabled"><strong>{{bandInfo.bandName}}</strong> 已存在，但未被认证。确认覆盖现有乐队信息？
              <el-button class="alert-btn" size="mini" type="warning" @click="passDisabled = false">确认覆盖</el-button></div>
            <el-button size="mini" type="text"  @click="$router.push({
                path: '/band/band-detail',
                query: {
                  id:subsidiaryInfo.id
                }
            })">查看乐队详情</el-button>
          </div>
        </div>
        <div  v-if="subsidiaryInfo.type === 2" class="el-alert el-alert--error">
          <div class="el-alert__content">
            <div class="el-alert__title "><strong>{{bandInfo.bandName}}</strong> 已存在，且被认证，不可被认证。</div>
            <el-button size="mini" type="text"  @click="$router.push({
                path: '/band/band-detail',
                query: {
                  id:subsidiaryInfo.id
                }
            })">查看乐队详情</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <hr>
    <el-row :gutter="20">
      <h4 class="item-title"><span class="text">申请人信息（队长信息）</span><el-button type="text" @click="$router.push({
                path: '/user/detail',
                query: {
                  id:applicantInfo.id
                }
            })">查看用户详情</el-button></h4>
      <el-col :span="12">
        <el-form label-width="100px">
          <el-form-item label="申请人姓名：">
            <span>{{applicantInfo.realName}}</span>
          </el-form-item>
          <el-form-item label="联系电话：">
            <span> {{applicantInfo.contactPhone}}</span>
          </el-form-item>
          <el-form-item label="擅长技能：">
            <span>{{bandInfo.certifiedInstrument}}</span>
          </el-form-item>
          <el-form-item label="身份证号：">
            <span>{{applicantInfo.idCard}}</span>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <el-form label-width="100px">
          <el-form-item label="昵称：">
            <span>{{applicantInfo.nickName}}</span>
          </el-form-item>
          <el-form-item label="注册账号：">
            <span>{{applicantInfo.telphone}}</span>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <hr>
    <el-row :gutter="20">
      <h4 class="item-title"><span class="text">审核记录</span></h4>
      <el-col :span="24">
        <div class="table">
          <el-table
            :data="auditingInfo"
            row-key="id"
            size="small"
            stripe
            fit
            style="width: 100%">
            <el-table-column label="审核记录" width="100">
              <template slot-scope="scope">
                <span>{{scope.row.approveStageName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="详情">
              <template slot-scope="scope">
                <span>{{scope.row.reason}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作人">
              <template slot-scope="scope">
                <span>{{scope.row.createName}}</span>
              </template>
            </el-table-column>
            <el-table-column label="时间">
              <template slot-scope="scope">
                <span>{{scope.row.createTime}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      :title="this.auditType===1 ? '审核通过': '驳回认证申请'"
      :visible.sync="auditDialog"
      width="320px"
      center>
      <span v-if="this.auditType===1">请确认是否通过此乐队的认证申请？</span>
      <div v-else>
        <div>请输入驳回原因并确认</div>
        <br>
        <el-form :model="auditForm" :rules="rules" ref="auditForm">
          <el-form-item prop="auditReason">
            <el-input type="textarea" v-model="auditForm.auditReason" placeholder="请输入驳回原因" ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="auditDialog = false">取 消</el-button>
        <el-button type="primary" @click="bandAuditSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {auditBandInfo, applicantInfo, auditLogger, subsidiaryInfo, bandAudit} from '../../server/content';
  export default {
    name: 'UserDetail',
    data () {
      return {
        bandInfo: {
          cityName: '',
          logo: '',
          bandName: '',
          id: '',
          provinceName: '',
          cityId: '',
          provinceId: '',
          introduction: '',
          approveStage: 0
        },
        applicantInfo: {
          realName: '',
          idCard: '',
          nickName: '',
          telphone: '',
          id: '',
          certifiedInstrument: '',
          contactPhone: ''
        },
        auditingInfo: [],
        subsidiaryInfo: {
          auditStatus: '',
          type: ''
        },
        auditDialog: false,
        auditType: '',
        auditForm: {
          auditReason: ''
        },
        passDisabled: true,
        rules: {
          auditReason: [
            { required: true, message: '请填写驳回理由', trigger: 'blur' }
          ]
        }
      };
    },
    created() {
      this.getPageData();
    },
    methods: {
      getPageData () {
        // 获取乐队信息
        auditBandInfo('bandApprove/auditBandInfo', {
          id: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            this.bandInfo = res.data;
          }
        });
        // 获取申请人信息
        applicantInfo('bandApprove/applicantInfo', {
          id: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            this.applicantInfo = res.data;
          }
        });
        // 获取申请记录
        auditLogger('bandApprove/auditLogger', {
          id: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            this.auditingInfo = res.data;
          }
        });
        // 获取乐队附加信息
        subsidiaryInfo('bandApprove/subsidiaryInfo', {
          id: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            this.subsidiaryInfo = res.data;
          }
        });
      },
      handleBandAudit (type) {
        this.auditType = type;
        this.auditDialog = true;
      },
      bandAuditSubmit () {
        if (this.auditType === 1) {
           bandAudit('/bandApprove/bandAudit', {
            id: this.$route.query.id,
            memberId: this.applicantInfo.id,
            auditType: this.auditType
          }).then(res => {
            if (res.code === 0) {
              this.auditDialog = false;
              this.$message.success(res.msg);
              this.getPageData();
            }
          });
        } else {
          this.$refs['auditForm'].validate((valid) => {
            if (valid) {
               bandAudit('/bandApprove/bandAudit', {
                 id: this.$route.query.id,
                 memberId: this.applicantInfo.id,
                 auditType: this.auditType,
                 reason: this.auditForm.auditReason
              }).then(res => {
                 if (res.code === 0) {
                   this.auditDialog = false;
                   this.$message.success(res.msg);
                   this.getPageData();
                 }
               });
            }
          });
        }

       /* bandAudit('/bandApprove/bandAudit', {
          id: this.$route.query.id,
          auditType: this.auditType
        }); */
      }
    },
    filters: {
      getAuditStatusText(text) {
        let auditStatusText = {
          '0': '待审核',
          '1': '审核通过',
          '2': '驳回',
          '3': '放弃',
          '4': '失败'
        };
        return auditStatusText[text];
      }
    }
  };
</script>

<style lang="scss" scoped>
  .title{
    font-size: 18px;
    flex: 1;
  }
  .item-title{
    display: flex;
    align-items: center;
    padding: 0 15px;
    .text{
      flex: 1;
    }
  }
  .head-img{
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: block;
  }
  .text-length{
    color: #666;
  }
  .alert-btn{
    margin-left: 15px;
  }
  .el-alert{
    display: flex;
    align-items: start;
    padding: 10px 16px;
    .el-alert__content{
      width: 100%;
      display: flex;
      align-items: start;
    }
  }
  .el-alert__title{
    flex: 1;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  hr{
    border: none;
    border-bottom: 1px solid #f1f1f1
  }
</style>

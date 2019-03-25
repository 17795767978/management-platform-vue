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
            placeholder="消息标题、消息正文">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button class="fr" type="primary" @click="handleAddSysMessage">新建推送</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="推送类型">
          <template slot-scope="scope">
            <!--<span>{{scope.row.msgType|getMsgTypeText()}}</span>-->
            <span>系统推送</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消息标题">
          <template slot-scope="scope">
            <span>{{scope.row.msgTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="消息正文">
          <template slot-scope="scope">
            <span>{{scope.row.msgContent}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="推送时间">
          <template slot-scope="scope">
            <span>{{scope.row.sendTime|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleView(scope.row.id)">查看</el-button>
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
      title="新建推送"
      :visible.sync="dialogVisible"
      width="390px">
      <el-form ref="msgForm" :model="msgForm" :rules="rules" label-width="100px">
        <el-form-item label="跳转方式：" prop="redirMethod">
          <el-select
            v-model="msgForm.redirMethod"
            placeholder="请选择"
            @change="handleJump"
            style="width: 240px">
            <el-option label="个人主页" value="0"></el-option>
            <el-option label="乐队主页" value="1"></el-option>
            <el-option label="视频页面" value="3"></el-option>
            <el-option label="活动页面" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转对象：" v-if="isJump" prop="redirObj">
          <span v-if="jumpInfo.id" style="padding-right: 20px;">
            {{jumpInfo.name}}
          </span>
          <el-button type="primary" @click="innerVisible=true">关联</el-button>
        </el-form-item>
        <el-form-item label="链接地址：" v-if="isLink" prop="linkUrl">
          <el-input
            v-model="msgForm.linkUrl"
            placeholder="请输入链接地址"
            style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="消息标题：" prop="msgTitle">
          <el-input
            v-model="msgForm.msgTitle"
            placeholder="请输入消息标题"
            style="width: 240px"></el-input>
        </el-form-item>
        <el-form-item label="消息正文：" prop="msgContent">
          <el-input
            placeholder="请输入消息正文"
            style="width: 240px"
            type="textarea"
            v-model="msgForm.msgContent"></el-input>
        </el-form-item>
        <el-form-item label="推送时间：" prop="sendTime">
          <el-date-picker
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="msgForm.sendTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleTimeSubmit">定时发送</el-button>
        <el-button type="primary" @click="handleImmediatelySubmit">立即发送</el-button>
      </span>
      <el-dialog
        top="20px"
        width="1400px"
        title="选择跳转对象"
        :visible.sync="innerVisible"
        append-to-body>
        <component v-if="innerVisible" v-bind:is="componentIndent" @changeJump="changeJump"></component>
      </el-dialog>
    </el-dialog>
    <el-dialog
      title="查看推送"
      :visible.sync="viewDialogVisible"
      width="400px">
      <el-form label-width="120px">
        <el-form-item label="消息标题：">
          <span>{{msgDetail.msgTitle}}</span>
        </el-form-item>
        <el-form-item label="消息正文：">
          <span>{{msgDetail.msgContent}}</span>
        </el-form-item>
        <el-form-item label="推送时间：">
          <span>{{msgDetail.sendTime | parseTime()}}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import {getSysMsgPage, getSysMsgDetail, addSysMsg} from '../../../server/sys';
  import {getMsgTypeText, parseTime} from '../../../filter';
  import UserTable from './components/UserTable';
  import BandTable from './components/BandTable';
  import VideoTable from './components/VideoTable';

  export default {
    name: 'Push',
    data() {
      return {
        form: {
          cont: ''
        },
        msgForm: {
          redirMethod: '',
          linkUrl: '',
          msgTitle: '',
          msgContent: '',
          sendTime: '',
          redirObj: '',
          msgType: 0,
          toId: -1,
          sendType: ''
        },
        rules: {
          redirMethod: [
            { required: true, message: '请选择跳转方式', trigger: 'blur' }
          ],
          redirObj: [
            { required: true, message: '请选择跳转对象', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '请输入链接地址', trigger: 'blur' }
          ],
          msgTitle: [
            { required: true, message: '请输入消息标题', trigger: 'blur' }
          ],
          msgContent: [
            { required: true, message: '请输入消息正文', trigger: 'blur' }
          ],
          sendTime: [
            { required: true, message: '请选择日期时间', trigger: 'blur' }
          ]
        },
        list: [],
        current: 1,
        total: 0,
        msgDetail: {},
        dialogVisible: false,
        viewDialogVisible: false,
        innerVisible: false,
        isLink: false,
        isJump: false,
        componentIndent: '',
        jumpInfo: {}
      };
    },
    created() {
      this.getList({
        current: 1,
        size: 10
      });
    },
    filters: {
      getMsgTypeText,
      parseTime
    },
    components: {
      'component0': UserTable,
      'component1': BandTable,
      'component3': VideoTable
    },
    methods: {
      getList(params) {
        getSysMsgPage('sys/msg/page', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      onSearch() {
        this.getList({
          current: 1,
          size: 10,
          cond: this.form.cont
        });
      },
      handleCurrentChange(val) {
        this.getList({
          current: val,
          size: 10,
          cond: this.form.cont
        });
      },
      handleJump (val) {
        this.componentIndent = `component${val}`;
        this.jumpInfo = {};
        if (val === '4') {
          this.isLink = true;
          this.isJump = false;
        } else {
          this.isLink = false;
          this.isJump = true;
        }
      },
      handleView (id) {
        getSysMsgDetail('sys/msg/info', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.viewDialogVisible = true;
            this.msgDetail = res.data;
          }
        });
      },
      changeJump (params) {
        this.innerVisible = false;
        switch (this.componentIndent) {
          case 'component0':
            this.jumpInfo = {
              id: params.id,
              name: params.nickname
            };
            break;
          case 'component1':
            this.jumpInfo = {
              id: params.id,
              name: params.band_name
            };
            break;
          case 'component3':
            this.jumpInfo = {
              id: params.id,
              name: params.title
            };
        }
      },
      handleAddSysMessage () {
        this.dialogVisible = true;
        Object.keys(this.msgForm).forEach(key => {
          this.msgForm[key] = '';
        });
        this.jumpInfo = {};
        this.$nextTick(() => {
          this.$refs['msgForm'].resetFields();
        });
      },
      handleTimeSubmit () {
        this.$refs['msgForm'].validate((valid) => {
          if (valid) {
            this.msgForm.sendType = 1;
            this.msgForm.redirObj = this.jumpInfo.id;
            this.handleSubmit();
          }
        });
      },
      handleImmediatelySubmit () {
        this.$refs['msgForm'].validate((valid) => {
          if (valid) {
            this.msgForm.sendType = 0;
            this.msgForm.redirObj = this.jumpInfo.id;
            this.handleSubmit();
          }
        });
      },
      handleSubmit () {
        addSysMsg('sys/msg/add', {
          ...this.msgForm
        }).then(res => {
          if (res.code === 0) {
            this.dialogVisible = false;
            this.$message.success('添加成功！');
            this.getList({
              current: 1,
              size: 10
            });
          }
        });
      }
    }
  };
</script>

<style scoped>

</style>

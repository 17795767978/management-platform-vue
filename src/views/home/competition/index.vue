<template>
  <div class="wrapper">
    <div class="search">
      <el-form
        class="fl"
        :inline="true"
        :model="form">
        <el-form-item label="赛事名称">
          <el-input
            v-model="form.cont"
            placeholder="赛事名称">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button class="fr" type="primary" @click="handleAdd">新建赛事</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="赛事名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="赛事web地址">
          <template slot-scope="scope">
            <span>{{scope.row.redirUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上架时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下架时间">
          <template slot-scope="scope">
            <span>{{scope.row.endTime|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="130">
          <template slot-scope="scope">
            <span>{{scope.row.timeStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleRemove(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        :current-page="current"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :total="total">
      </el-pagination>
    </div>
    <el-dialog
      title="新建赛事"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form ref="comForm" :model="comForm" :rules="rules" label-width="100px">
        <el-form-item label="赛事名称：" prop="name">
          <el-input
            style="width: 240px"
            v-model="comForm.name"
            placeholder="请输入赛事名称">
          </el-input>
        </el-form-item>
        <el-form-item label="跳转链接：" prop="redirUrl">
          <el-input
            style="width: 240px"
            v-model="comForm.redirUrl"
            placeholder="请输入跳转链接">
          </el-input>
        </el-form-item>
        <!--<el-form-item label="赛事状态：">
          <el-select
            style="width: 240px"
            v-model="comForm.status"
            placeholder="请选择">
            <el-option label="上架" value="0"></el-option>
            <el-option label="下架" value="1"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="上架时间：" prop="startTime">
          <el-date-picker
            v-model="comForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width: 240px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下架时间：" prop="endTime">
          <el-date-picker
            v-model="comForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width: 240px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上传图片：" prop="mainImage">
          <el-upload
            class="banner-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadAvatar"
            :show-file-list="false">
            <img v-if="comForm.mainImage" :src="comForm.mainImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getCompetitionList, removeCompetition, saveOrUpdateCompetition, getCompetitionDetail } from '../../../server/home';
  import { parseTime } from '../../../filter';
  // import { beforeAvatar } from '../../../mixins';
  import { doUpload } from '../../../utils/upload';
  import { aliOssUrl } from '../../../config/env';

  export default {
    name: 'Competition',
    data () {
      return {
        form: {
          cont: ''
        },
        comForm: {
          id: '',
          name: '',
          mainImage: '',
          redirUrl: '',
          startTime: '',
          endTime: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入赛事名称', trigger: 'blur' }
          ],
          redirUrl: [
            { required: true, message: '请输入跳转链接', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择上架时间', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请选择下架时间', trigger: 'blur' }
          ],
          mainImage: [
            { required: true, message: '请上传图片', trigger: 'blur' }
          ]
        },
        current: 1,
        total: 0,
        list: [],
        dialogVisible: false
      };
    },
    created () {
      this.getCompetitionData({
        current: 1,
        size: 10
      });
    },
    filters: {
      parseTime
    },
    // mixins: [beforeAvatar],
    methods: {
      getCompetitionData (params) {
        getCompetitionList('matchInfo/page', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      onSearch () {
        this.getCompetitionData({
          current: 1,
          size: 10,
          cond: this.form.cont
        });
      },
      handleCurrentChange (val) {
        this.getCompetitionData({
          current: val,
          size: 10,
          cond: this.form.cont
        });
      },
      handleRemove (id) {
        removeCompetition('matchInfo/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getCompetitionData({
              current: 1,
              size: 10
            });
          }
        });
      },
      uploadAvatar (option) {
        doUpload(option, 'image/avatar').then(res => {
          this.comForm.mainImage = `${aliOssUrl}/${res.name}`;
        });
      },
      handleAdd () {
        this.dialogVisible = true;
        Object.keys(this.comForm).forEach(key => {
          this.comForm[key] = '';
        });
        this.$nextTick(() => {
          this.$refs['comForm'].resetFields();
        });
      },
      handleEdit (id) {
        this.$refs['comForm'].resetFields();
        this.dialogVisible = true;
        getCompetitionDetail('matchInfo/info', {
          id
        }).then(res => {
          if (res.code === 0) {
            Object.keys(this.comForm).forEach(key => {
              if (res.data.hasOwnProperty(key)) {
                this.comForm[key] = res.data[key];
              }
            });
            this.comForm.startTime = parseTime(this.comForm.startTime);
            this.comForm.endTime = parseTime(this.comForm.endTime);
          }
        });
      },
      handleSubmit () {
        this.$refs['comForm'].validate((valid) => {
          if (valid) {
            saveOrUpdateCompetition('matchInfo/save', {
              ...this.comForm
            }).then(res => {
              if (res.code === 0) {
                if (this.comForm.id) {
                  this.$message.success('编辑成功！');
                } else {
                  this.$message.success('新建成功！');
                }
                this.dialogVisible = false;
                this.getCompetitionData({
                  current: 1,
                  size: 10
                });
              }
            });
          }
        });
      }
    }
  };
</script>

<style scoped>
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
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
  }
</style>

<template>
  <div class="wrapper">
    <div class="fr" style="margin-bottom: 20px;">
      <el-button type="primary" @click="handleSort">完成排序</el-button>
      <el-button type="primary" @click="handleAdd">新建广告</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="广告标题" width="140">
          <template slot-scope="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="广告分类" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.advertisingPosition === 0 ? 'App banner' : 'App 启动页'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="跳转方式" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.redirType|getRedirTypeText}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="跳转对象">
          <template slot-scope="scope">
            <span>{{scope.row.targetName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="连接地址" width="120">
          <template slot-scope="scope">
            <span>{{scope.row.linkUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上架时间">
          <template slot-scope="scope">
            <span>{{scope.row.startTime|parseTime()}}</span>
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
            <el-button size="mini" type="primary" @click="handleEditAdvert(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleRemoveAdvert(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="拖拽" width="80">
          <template slot-scope="scope">
              <span>
                <i class="fa fa-arrows drag-handler"></i>
              </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="新建"
      top="20px"
      :visible.sync="dialogVisible"
      width="400px">
      <el-form
        ref="adForm"
        :rules="rules"
        :model="adForm"
        label-width="100px">
        <el-form-item label="广告标题：" prop="title">
          <el-input
            style="width: 240px"
            v-model="adForm.title"
            placeholder="请输入广告标题">
          </el-input>
        </el-form-item>
        <el-form-item label="广告分类：" prop="advertisingPosition">
          <el-select
            v-model="adForm.advertisingPosition"
            style="width: 240px"
            placeholder="请选择广告分类">
            <el-option label="App banner" value="0"></el-option>
            <el-option label="App 启动页" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转方式：" prop="redirType">
          <el-select
            v-model="adForm.redirType"
            style="width: 240px"
            @change="handleJump"
            placeholder="请选择跳转方式">
            <el-option label="个人主页" value="0"></el-option>
            <el-option label="乐队主页" value="1"></el-option>
            <el-option label="视频页面" value="3"></el-option>
            <el-option label="活动页面" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转对象：" v-if="isJump" prop="targetObj">
          <span v-if="jumpInfo.id" style="padding-right: 20px;">
            {{jumpInfo.name}}
          </span>
          <el-button type="primary" @click="innerVisible=true">关联</el-button>
        </el-form-item>
        <el-form-item label="链接地址：" v-if="isLink" prop="linkUrl">
          <el-input
            style="width: 240px"
            v-model="adForm.linkUrl"
            placeholder="请输入连接地址">
          </el-input>
        </el-form-item>
        <el-form-item label="上架时间：" prop="startTime">
          <el-date-picker
            v-model="adForm.startTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width: 240px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="下架时间：" prop="endTime">
          <el-date-picker
            v-model="adForm.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width: 240px"
            placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="广告图片：" prop="mainImage">
          <el-upload
            class="banner-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :before-upload="beforeAvatarUpload"
            :http-request="uploadAvatar"
            :show-file-list="false">
            <img v-if="adForm.mainImage" :src="adForm.mainImage" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
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
  </div>
</template>

<script>
  import { getAdvertisingList, saveOrUpdateAdvert, removeAdvertising, sortAd } from '../../../server/home';
  import { getRedirTypeText, parseTime } from '../../../filter';
  import { doUpload } from '../../../utils/upload';
  // import { beforeAvatar } from '../../../mixins';
  import { aliOssUrl } from '../../../config/env';
  import UserTable from './components/UserTable';
  import BandTable from './components/BandTable';
  import VideoTable from './components/VideoTable';
  import Sortable from 'sortablejs';

  export default {
    name: 'Advertising',
    data () {
      return {
        adForm: {
          id: '',
          title: '',
          advertisingPosition: '',
          redirType: '',
          linkUrl: '',
          startTime: '',
          endTime: '',
          targetObj: '',
          mainImage: ''
        },
        rules: {
          title: [
            { required: true, message: '请输入广告标题', trigger: 'blur' }
          ],
          advertisingPosition: [
            { required: true, message: '请选择广告分类', trigger: 'blur' }
          ],
          redirType: [
            { required: true, message: '请选择跳转方式', trigger: 'blur' }
          ],
          targetObj: [
            { required: true, message: '请选择跳转对象', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '请输入连接地址', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择上架时间', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请选择下架时间', trigger: 'blur' }
          ],
          mainImage: [
            { required: true, message: '请上传广告图片', trigger: 'blur' }
          ]
        },
        list: [],
        dialogVisible: false,
        innerVisible: false,
        imageUrl: '',
        isJump: false,
        isLink: false,
        componentIndent: '',
        jumpInfo: {}
      };
    },
    created () {
      this.getAdList();
    },
    filters: {
      getRedirTypeText,
      parseTime
    },
    // mixins: [beforeAvatar],
    components: {
      'component0': UserTable,
      'component1': BandTable,
      'component3': VideoTable
    },
    methods: {
      getAdList (params) {
        getAdvertisingList('advertisement/page', params).then(res => {
          if (res.code === 0) {
            this.list = res.data;
            this.$nextTick(() => {
              this.setSort();
            });
          }
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
      handleAdd () {
        this.dialogVisible = true;
        Object.keys(this.adForm).forEach(key => {
          this.adForm[key] = '';
        });
        this.$nextTick(() => {
          this.$refs['adForm'].resetFields();
        });
        this.jumpInfo = {};
        this.isJump = false;
        this.isLink = false;
      },
      uploadAvatar (option) {
        doUpload(option, 'image/avatar').then(res => {
          this.adForm.mainImage = `${aliOssUrl}/${res.name}`;
        });
      },
      handleSubmit () {
        this.$refs['adForm'].validate((valid) => {
          if (valid) {
            this.adForm.targetObj = this.jumpInfo.id;
            saveOrUpdateAdvert('advertisement/saveOrUpdate', {
              ...this.adForm
            }).then(res => {
              if (res.code === 0) {
                if (this.adForm.id) {
                  this.$message.success('编辑成功！');
                } else {
                  this.$message.success('新建成功！');
                }
                this.dialogVisible = false;
                this.getAdList();
              }
            });
          }
        });
      },
      handleEditAdvert (row) {
        this.$refs['adForm'].resetFields();
        this.dialogVisible = true;
        Object.keys(this.adForm).forEach(key => {
          if (row.hasOwnProperty(key)) {
            this.adForm[key] = row[key];
          }
        });
        this.componentIndent = `component${this.adForm.redirType}`;
        this.adForm.endTime = parseTime(row.endTime);
        this.adForm.redirType = row.redirType.toString();
        this.adForm.advertisingPosition = row.advertisingPosition.toString();
        this.adForm.startTime = parseTime(row.startTime);
        this.jumpInfo = {
          id: row.targetObj,
          name: row.targetName
        };
        if (this.adForm.redirType === '4') {
          this.isLink = true;
          this.isJump = false;
        } else {
          this.isLink = false;
          this.isJump = true;
        }
      },
      handleRemoveAdvert (id) {
        removeAdvertising('advertisement/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getAdList();
          }
        });
      },
      setSort () {
        const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0];
        this.sortable = Sortable.create(el, {
          ghostClass: 'sortable-ghost',
          setData: function(dataTransfer) {
            dataTransfer.setData('Text', '');
          },
          onEnd: evt => {
            const targetRow = this.list.splice(evt.oldIndex, 1)[0];
            this.list.splice(evt.newIndex, 0, targetRow);
          }
        });
      },
      handleSort () {
        let orderIds = this.list.map(item => item.id);
        sortAd('advertisement/advertisementOrder', {
          orderIds: orderIds.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('完成排序！');
            this.getAdList();
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
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

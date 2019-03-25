<template>
  <div class="wrapper">
    <div class="search fr" style="margin-bottom: 20px">
      <el-button type="primary" @click="handleSort">完成排序</el-button>
      <el-button
        type="primary"
        @click="handleAdd"
      >新建广告</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="广告标题">
          <template slot-scope="scope">
            <span>{{scope.row.advertisementTitle}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="连接地址">
          <template slot-scope="scope">
            <span>{{scope.row.linkUrl}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上架时间">
          <template slot-scope="scope">
            <span>{{scope.row.upTime|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="下架时间">
          <template slot-scope="scope">
            <span>{{scope.row.downTime|parseTime()}}</span>
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
            <el-button size="mini" type="primary" @click="handleDetail(scope.row.id)">查看</el-button>
            <el-button size="mini" type="primary" @click="handleRemove(scope.row.id)">删除</el-button>
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
      title="新建广告"
      :visible.sync="dialogVisible"
      width="420px">
      <div class="banner-cont">
        <el-form
          ref="bannerForm"
          :model="bannerForm"
          :rules="rules"
          label-width="100px">
          <el-form-item label="广告标题：" prop="advertisementTitle">
            <el-input
              v-model="bannerForm.advertisementTitle"
              placeholder="请输入广告标题"
              style="width: 260px">
            </el-input>
          </el-form-item>
          <el-form-item label="链接地址：" prop="linkUrl">
            <el-input
              v-model="bannerForm.linkUrl"
              placeholder="请输入链接地址"
              style="width: 260px">
            </el-input>
          </el-form-item>
          <el-form-item label="上架时间：" prop="upTime">
            <el-date-picker
              v-model="bannerForm.upTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="width: 260px"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="下架时间：" prop="downTime">
            <el-date-picker
              v-model="bannerForm.downTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width: 260px"
              placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="广告图片：" prop="adPicture">
            <el-upload
              class="banner-uploader"
              action=""
              :before-upload="beforeAvatarUpload"
              :http-request="uploadAvatar"
              :show-file-list="false">
              <img v-if="bannerForm.adPicture" :src="bannerForm.adPicture" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addAdvert">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="广告详情"
      :visible.sync="dialogDetailVisible"
      width="420px">
      <el-form label-width="100px">
        <el-form-item label="广告标题：">
          <span>{{advertDetail.advertisementTitle}}</span>
        </el-form-item>
        <el-form-item label="链接地址：">
          <span>{{advertDetail.linkUrl}}</span>
        </el-form-item>
        <el-form-item label="上架时间：">
          <span>{{advertDetail.upTime|parseTime()}}</span>
        </el-form-item>
        <el-form-item label="下架时间：">
          <span>{{advertDetail.downTime|parseTime()}}</span>
        </el-form-item>
        <el-form-item label="广告图片：">
          <span>
            <img class="ver-top" :src="advertDetail.adPicture" alt="" width="200">
          </span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
  import { getSoundTooAdList, deleteSoundTooAd, addSoundTooAd, getSoundTooAdDetails, updateSoundTooAd } from '../../../server/content';
  import { sortAd } from '../../../server/home';
  // import { beforeAvatar } from '../../../mixins';
  import { aliOssUrl } from '../../../config/env';
  import { doUpload } from '../../../utils/upload';
  import { parseTime } from '../../../filter';
  import Sortable from 'sortablejs';

  export default {
    name: 'AcousticAdvert',
    data () {
      return {
        list: [],
        dialogVisible: false,
        dialogDetailVisible: false,
        isEdit: false,
        advertId: '',
        advertDetail: {},
        bannerForm: {
          advertisementTitle: '',
          linkUrl: '',
          upTime: '',
          downTime: '',
          adPicture: ''
        },
        rules: {
          advertisementTitle: [
            { required: true, message: '请输入广告标题', trigger: 'blur' }
          ],
          linkUrl: [
            { required: true, message: '请输入链接地址', trigger: 'blur' }
          ],
          upTime: [
            { required: true, message: '请选择上架时间', trigger: 'blur' }
          ],
          downTime: [
            { required: true, message: '请选择下架时间', trigger: 'blur' }
          ],
          adPicture: [
            { required: true, message: '请上传广告图片', trigger: 'blur' }
          ]
        }
      };
    },
    created () {
      this.getSoundTooAdData();
    },
    // mixins: [beforeAvatar],
    filters: {
      parseTime
    },
    methods: {
      getSoundTooAdData (params) {
        getSoundTooAdList('soundtooAdvertisement/soundTooAdList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data;
            this.$nextTick(() => {
              this.setSort();
            });
          }
        });
      },
      handleDetail (id) {
        this.dialogDetailVisible = true;
        getSoundTooAdDetails('soundtooAdvertisement/soundTooAdDetails', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.advertDetail = res.data;
          }
        });
      },
      handleAdd () {
        this.isEdit = false;
        this.dialogVisible = true;
        Object.keys(this.bannerForm).forEach(key => {
          this.bannerForm[key] = '';
        });
        this.$nextTick(() => {
          this.$refs['bannerForm'].resetFields();
        });
      },
      handleEdit (id) {
        this.$nextTick(() => {
          this.$refs['bannerForm'].resetFields();
        });
        this.isEdit = true;
        this.dialogVisible = true;
        this.advertId = id;
        getSoundTooAdDetails('soundtooAdvertisement/soundTooAdDetails', {
          id
        }).then(res => {
          if (res.code === 0) {
            Object.keys(this.bannerForm).forEach(key => {
              if (res.data.hasOwnProperty(key)) {
                this.bannerForm[key] = res.data[key];
              }
            });
            this.bannerForm.upTime = parseTime(res.data.upTime);
            this.bannerForm.downTime = parseTime(res.data.downTime);
          }
        });
      },
      handleRemove (id) {
        deleteSoundTooAd('soundtooAdvertisement/deleteSoundTooAd', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功');
            this.getSoundTooAdData();
          }
        });
      },
      uploadAvatar (option) {
        doUpload(option, 'image/avatar').then(res => {
          this.bannerForm.adPicture = `${aliOssUrl}/${res.name}`;
        });
      },
      addAdvert () {
        this.$refs['bannerForm'].validate((valid) => {
          if (valid) {
            if (this.isEdit) {
              updateSoundTooAd('soundtooAdvertisement/updateSoundTooAd', {
                id: this.advertId,
                ...this.bannerForm
              }).then(res => {
                if (res.code === 0) {
                  this.dialogVisible = false;
                  this.$message.success('编辑广告成功');
                  this.getSoundTooAdData();
                }
              });
            } else {
              addSoundTooAd('soundtooAdvertisement/addSoundTooAd', {
                ...this.bannerForm
              }).then(res => {
                if (res.code === 0) {
                  this.dialogVisible = false;
                  this.$message.success('添加广告成功');
                  this.getSoundTooAdData();
                }
              });
            }
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
        sortAd('soundtooAdvertisement/soundtooAdvertisementOrder', {
          orderIds: orderIds.join(',')
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('完成排序！');
            this.getSoundTooAdData();
          }
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .advert-wrapper {
    padding-left: 40px;
  }
  .ver-top {
    vertical-align: top;
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

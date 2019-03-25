<template>
  <div class="wrapper">
    <el-form ref="perForm" :model="perForm" label-width="120px" :rules="rules">
      <el-form-item label="演出图片：" prop="mainImage">
        <el-upload
          class="banner-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadAvatar"
          :show-file-list="false">
          <img v-if="perForm.mainImage" :src="perForm.mainImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="演出标题：" prop="name">
        <el-input
          style="width: 260px;"
          v-model="perForm.name"
          placeholder="请输入演出标题">
        </el-input>
      </el-form-item>
      <el-form-item label="演出标签：" prop="tagIds">
        <div>
          <span
            v-for="(item, index) in checkedName"
            :key="index"
            style="padding: 0 10px">
            {{item}}
          </span>
        </div>
        <el-button type="primary" @click="dialogVisible = true">添加标签</el-button>
      </el-form-item>
      <el-form-item label="开始时间：" prop="startTime">
        <el-date-picker
          v-model="perForm.startTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 260px"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间：" prop="endTime">
        <el-date-picker
          v-model="perForm.endTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          style="width: 260px"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="演出城市：" prop="cityId">
        <el-cascader
          style="width: 260px"
          :options="cascaderOptions"
          v-model="selectProvinceAndCity">
        </el-cascader>
      </el-form-item>
      <el-form-item label="演出场馆：" prop="address">
        <el-input
          style="width: 260px"
          v-model="perForm.address"
          placeholder="请输入演出场馆">
        </el-input>
      </el-form-item>
      <el-form-item label="演出详情图片：" prop="detailStr">
        <el-upload
          action=""
          :file-list="fileDetailList"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadPerform"
          :on-preview="handlePictureCardPreview"
          :on-remove="handlePerformRemove"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="演出场馆详情：" prop="venueStr">
        <el-upload
          action=""
          :file-list="fileVenuesList"
          :before-upload="beforeAvatarUpload"
          :http-request="uploadPerformVenues"
          :on-preview="handlePictureCardPreview"
          :on-remove="handlePerformVenuesRemove"
          list-type="picture-card">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAddPerform">保存</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="添加标签"
      :visible.sync="dialogVisible"
      width="30%">
      <el-tabs type="border-card">
        <el-tab-pane
          v-for="(item) in tagList"
          :label="item.tagType.tagName"
          :key="item.id">
          <el-checkbox-group v-model="checkedList" @change="handleChangeTag">
            <el-checkbox
              v-for="(subItem) in item.tagClassify"
              :key="subItem.id"
              :label="subItem.id">
              {{subItem.tagName}}
            </el-checkbox>
          </el-checkbox-group>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddTag">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imageDialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  // import { beforeAvatar } from '../../mixins';
  import { provinceAndCityData, CodeToText } from 'element-china-area-data';
  import { getTagList, saveOrUpdatePerformanceInfo, getPerformanceInfo } from '../../server/content';
  import { doUpload } from '../../utils/upload';
  import { aliOssUrl } from '../../config/env';
  import {parseTime} from '../../filter';

  export default {
    name: 'PerformEntry',
    data () {
      return {
        perForm: {
          id: '',
          mainImage: '',
          detailStr: '',
          venueStr: '',
          name: '',
          startTime: '',
          endTime: '',
          provinceName: '',
          cityName: '',
          provinceId: '',
          cityId: '',
          address: '',
          tagIds: ''
        },
        rules: {
          mainImage: [
            { required: true, message: '请上传演出图片', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入演出标题', trigger: 'blur' }
          ],
          tagIds: [
            { required: true, message: '请选择演出标签', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '请选择开始时间', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '请选择结束时间', trigger: 'blur' }
          ],
          cityId: [
            { required: true, message: '请选择演出城市', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入演出场馆', trigger: 'blur' }
          ],
          detailStr: [
            { required: true, message: '请上传演出详情图片', trigger: 'blur' }
          ],
          venueStr: [
            { required: true, message: '请上传演出场馆图片', trigger: 'blur' }
          ]
        },
        detailImages: [],
        venueImages: [],
        cascaderOptions: provinceAndCityData,
        selectProvinceAndCity: [],
        dialogVisible: false,
        bandDialogVisible: false,
        imageDialogVisible: false,
        dialogImageUrl: '',
        tagList: [],
        checkedList: [],
        checkedName: [],
        fileDetailList: [],
        fileVenuesList: []
      };
    },
    created () {
      getTagList('tagInfo/tagList', {
        tagType: 2
      }).then(res => {
        if (res.code === 0) {
          this.tagList = res.data;
        }
      });
      if (this.$route.query.id) {
        getPerformanceInfo('performanceInfo/info', {
          id: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            this.fileDetailList = [];
            this.fileVenuesList = [];
            Object.keys(this.perForm).forEach(key => {
              if (res.data.performanceInfo.hasOwnProperty(key)) {
                this.perForm[key] = res.data.performanceInfo[key];
              }
            });
            this.perForm.tagIds = res.data.tagIds;
            this.checkedList = res.data.tagIds.split(',').map(item => parseInt(item));
            this.checkedName = res.data.tags.split(',');
            this.perForm.startTime = parseTime(res.data.performanceInfo.startTime);
            this.perForm.endTime = parseTime(res.data.performanceInfo.endTime);
            this.selectProvinceAndCity = [this.perForm.provinceId, this.perForm.cityId];
            this.detailImages = res.data.performanceInfo.detailPicture.split(',');
            this.venueImages = res.data.performanceInfo.informationPicture.split(',');
            res.data.performanceInfo.detailPicture.split(',').forEach((item, index) => {
              this.fileDetailList.push({
                name: index,
                url: item
              });
            });
            res.data.performanceInfo.informationPicture.split(',').forEach((item, index) => {
              this.fileVenuesList.push({
                name: index,
                url: item
              });
            });
          }
        });
      }
    },
    // mixins: [beforeAvatar],
    methods: {
      uploadAvatar (option) {
        doUpload(option, 'image/avatar').then(res => {
          this.perForm.mainImage = `${aliOssUrl}/${res.name}`;
        });
      },
      uploadPerform (option) {
        doUpload(option, 'image/avatar', true).then(res => {
          this.detailImages.push(`${aliOssUrl}/${res.name}`);
        });
      },
      uploadPerformVenues (option) {
        doUpload(option, 'image/avatar', true).then(res => {
          this.venueImages.push(`${aliOssUrl}/${res.name}`);
        });
      },
      handlePerformRemove () {
        this.detailImages.pop();
      },
      handlePerformVenuesRemove () {
        this.venueImages.pop();
      },
      handlePictureCardPreview (file) {
        this.dialogImageUrl = file.url;
        this.imageDialogVisible = true;
      },
      handleChangeTag (val) {
        this.checkedList = val;
      },
      handleAddTag () {
        this.dialogVisible = false;
        this.checkedName = [];
        this.checkedList.forEach(item => {
          this.tagList.forEach(tagItem => {
            tagItem.tagClassify.forEach(classItem => {
              if (item === classItem.id) {
                this.checkedName.push(classItem.tagName);
              }
            });
          });
        });
      },
      handleAddPerform () {
        this.$refs['perForm'].validate((valid) => {
          if (valid) {
            this.perForm.tagIds = this.checkedList.join(',');
            this.perForm.provinceId = this.selectProvinceAndCity[0];
            this.perForm.cityId = this.selectProvinceAndCity[1];
            this.perForm.provinceName = CodeToText[this.selectProvinceAndCity[0]];
            this.perForm.cityName = CodeToText[this.selectProvinceAndCity[1]];
            this.perForm.detailStr = this.detailImages.join(',');
            this.perForm.venueStr = this.venueImages.join(',');
            saveOrUpdatePerformanceInfo('performanceInfo/save', {
              ...this.perForm
            }).then(res => {
              if (res.code === 0) {
                if (this.perForm.id) {
                  this.$message.success('编辑成功！');
                  this.$router.back();
                } else {
                  this.$message.success('添加成功！');
                  this.$router.back();
                }
              }
            });
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
    .band-item {
      margin-bottom: 20px;
      .text {
        padding-right: 20px;
      }
    }
  }
</style>

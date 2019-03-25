<template>
 <div class="add-album">
  <el-row :gutter="20">
    <el-col :span="4">
      <span>第一步，创建专辑封面</span>
    </el-col>
    <el-col :span="16"> </el-col>
  </el-row>
  <el-row  :gutter="20">
    <el-col :span="6">
      <el-upload
        class="avatar-uploader"
        accept="image/*"
        :show-file-list="false"
        action=""
        :http-request="fnUploadRequests"
        :before-upload="beforeAvatarUpload"
        >
        <img v-if="apiData.mainImage" :src="apiData.mainImage" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-col>
    <el-col :span="4">
      <span>专辑名称：</span>
      <el-input v-model="apiData.title" maxlength="20"></el-input>
      <span>字数限制：{{apiData.title.length}}/20</span>
    </el-col>
  </el-row>
  <hr />
  <p>第二步，选择乐队</p>
  <el-row :gutter="20">
    <el-col :span="6">
      <span>归属：</span>
      <el-select v-model="value" placeholder="请选择归属">
        <el-option v-for="(item, index) in belong" :key="index" :value="item.label">
          {{item.label}}
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="4">
      <el-button v-if="value === '乐队'" @click="tableBand = true" size="medium" type="primary">选择乐队</el-button>
        <el-dialog title="选择乐队" :visible.sync="tableBand">
          <span>搜索功能：</span>
          <el-input style="width: 40%;margin-bottom: 20px; margin-right: 20px;" placeholder="乐队标题" v-model="searchBand"></el-input>
          <el-button @click="searchBandTo" size="medium" type="primary">搜索乐队</el-button>
          <el-table :data="gridData">
            <el-table-column property="id" label="乐队ID" width="100"></el-table-column>
            <el-table-column property="bandName" label="乐队名称" width="150"></el-table-column>
            <el-table-column property="musicCount" label="单曲数量" width="200"></el-table-column>
            <el-table-column property="videoCount" label="视频数量"></el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="100">
              <template slot-scope="scope">
                <el-button @click="handleBandClick(scope.row)" type="text" size="small">选择</el-button>
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
    </el-col>
    <el-col :span="6" v-if="value === '乐队'">
      <span>选择乐队: {{bandTitle}}</span>
    </el-col>
  </el-row>
  <hr />
  <el-row>
    <p>第三步，发布专辑</p>
    <el-col :span="4">
      <el-button type="primary" @click="commitAlbum">发布</el-button>
    </el-col>
  </el-row>
 </div>
</template>

<script>
  import { addAlbum } from 'server/status.js';
  import { getBandList } from 'server/content.js';
  import {doUpload} from 'utils/upload.js';
  export default {
    name: 'AddAlbum',
    data () {
      return {
        imageUrl: '',
        dataList: [],
        value: '乐队',
        belong: [{value: '0', label: '好乐'}, {value: '1', label: '乐队'}],
        apiData: {
          title: '',
          ascription: '',
          ascriptionType: '',
          mainImage: '',
          musicIds: ''
        },
        gridData: [],
        bandTitle: '',
        tableBand: false,
        searchBand: '',
        currentPage: 1,
        totalPage: ''
      };
    },
    methods: {
      handleAvatarSuccess(res, file) {
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      beforeAvatarUpload(file) {
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
          this.$message.error('上传头像图片大小不能超过 10MB!');
        }
        return isLt10M;
      },
      fnUploadRequests (option) {
        doUpload(option, 'image/band').then((res) => {
          this.apiData.mainImage = res.res.requestUrls[0].indexOf('?') > 0 ? `${res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'))}` : `${res.res.requestUrls[0]}`;
        });
      },
      handleBandClick (row) {
        this.apiData.ascription = row.id;
        this.bandTitle = row.bandName;
        this.tableBand = false;
      },
      commitAlbum () {
        if (this.value === '乐队') {
          this.apiData.ascriptionType = 1;
        } else if (this.value === '好乐') {
          this.apiData.ascriptionType = 0;
          this.apiData.ascription = '';
        }
        console.log(this.apiData);
        addAlbum('/album/albumRelease', this.apiData).then(res => {
          if (res.code === 0) {
            this.$router.push({
              path: '/content/album'
            });
            this.$message.success('添加成功');
          }
        });
      },
      _getBandList (params) {
        getBandList('/bandInfo/bandList', params).then((res) => {
          if (res.code === 0) {
            this.gridData = res.data.records;
            this.totalPage = res.data.total;
            this.searchBand = '';
          }
        });
      },
      searchBandTo () {
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
    created () {
      this._getBandList(
        {
          current: 1,
          size: 10,
          keyWord: this.searchBand
        }
      );
    }
  };
</script>

<style scoped lang="scss">
.add-album {
  padding: 0 20px;
  box-sizing: border-box;
}
.el-col {
  margin-bottom: 20px;
  box-sizing: border-box;
  line-height: 50px;
}
.res-img {
  width: 200px;
  height: 200px;
  background-color: #aaaaaa;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 200px;
    height: 200px;
    line-height: 200px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
</style>

<style lang="scss">
  .avatar-uploader .el-upload {
    width: 200px;
    height: 200px;
  }
</style>

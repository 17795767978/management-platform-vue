<template>
  <div class="wrapper">
    <div class="search">
      <el-form
        class="fl"
        :inline="true"
        :model="form">
        <el-form-item>
          <el-input
            v-model="form.cont"
            placeholder="广告名称">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button
        class="fr"
        type="primary"
        @click="handleCreate"
      >新建版权</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="版权对应资源">
          <template slot-scope="scope">
            <span>{{scope.row.mediaName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="版权文本">
          <template slot-scope="scope">
            <span v-html="scope.row.copyrightContent"></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleDetail(scope.row.id)">查看</el-button>
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
      title="新建版权"
      :visible.sync="dialogVisible"
      width="1000px">
      <el-form
        :model="copyrightForm"
        :rules="rules"
        ref="copyrightForm"
        label-width="120px">
        <el-form-item label="版权对应资源：" prop="mediaName">
          <span style="padding-right: 20px;">{{copyrightForm.mediaName}}</span>
          <el-button type="primary" @click="handleSelectResource">
            选择资源
          </el-button>
        </el-form-item>
        <el-form-item label="版权文本：" prop="copyrightContent">
          <div class="quill-editor-wrapper">
            <quill-editor
              v-model="copyrightForm.copyrightContent"
              ref="text"
              :options="editorOption"
            >
            </quill-editor>
          </div>
        </el-form-item>
      </el-form>
      <!--<el-row :gutter="30">
        <el-col :span="6">
          <span class="text">版权对应资源：{{copyrightForm.mediaName}}</span>
        </el-col>
        <el-col :span="6">
          <el-button
            type="primary"
            @click="handleSelectResource">选择资源</el-button>
        </el-col>
      </el-row>
      <div>
        <h4 class="text">版权文本：</h4>
        <div class="quill-editor-wrapper">
          <quill-editor
            v-model="copyrightForm.copyrightContent"
            ref="text"
            :options="editorOption"
          >
          </quill-editor>
        </div>
      </div>-->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddCopyright">确 定</el-button>
      </span>
      <el-dialog
        width="70%"
        title="选择资源"
        :visible.sync="dialogResourceVisible"
        append-to-body>
        <div class="search">
          <el-form
            class="fl"
            :inline="true"
            :model="resourceForm">
            <el-form-item>
              <el-input
                style="width: 300px"
                v-model="resourceForm.cont"
                placeholder="视频标题、视频归属、视频标签">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleResourceSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table">
          <el-table
            :data="resourceList"
            row-key="id"
            border
            fit
            highlight-current-row
            style="width: 100%">
            <el-table-column align="center" label="资源标题">
              <template slot-scope="scope">
                <span>{{scope.row.title}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="资源类型">
              <template slot-scope="scope">
                <span>{{scope.row.type}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="点播数">
              <template slot-scope="scope">
                <span>{{scope.row.playCount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="收藏数">
              <template slot-scope="scope">
                <span>{{scope.row.likeCount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="评论数">
              <template slot-scope="scope">
                <span>{{scope.row.commentsCount}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="音频归属">
              <template slot-scope="scope">
                <span>{{scope.row.ascriptionName}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="播放时长">
              <template slot-scope="scope">
                <span>{{scope.row.mediaTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="发布时间">
              <template slot-scope="scope">
                <span>{{scope.row.submitTime}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.status}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="selectResource(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            background
            :current-page="resourceCurrent"
            @current-change="handleResourceChange"
            layout="total, prev, pager, next, jumper"
            :total="resourceTotal">
          </el-pagination>
        </div>
      </el-dialog>
    </el-dialog>
    <el-dialog
      title="查看版权"
      :visible.sync="dialogDetailVisible"
      width="50%">
      <el-row :gutter="30">
        <el-col :span="6">
          <span class="text">版权对应资源：{{detailCopyrightData.mediaName}}</span>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleLookResource">查看文件</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="2">版权文本：</el-col>
        <el-col :span="22">
          <span class="normal" v-html="detailCopyrightData.copyrightContent"></span>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css';
  import 'quill/dist/quill.snow.css';
  import 'quill/dist/quill.bubble.css';

  import { quillEditor } from 'vue-quill-editor';
  import { getMediaCopyrightList, getResourceList, createCopyright, getCopyrightDetails, updateCopyright } from '../../../server/content';

  export default {
    name: 'copyright',
    data () {
      return {
        form: {
          cont: '',
          status: ''
        },
        list: [],
        current: 1,
        total: 0,
        dialogVisible: false,
        dialogDetailVisible: false,
        dialogResourceVisible: false,
        isEdit: false,
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean']
            ]
          }
        },
        content: '',
        resourceForm: {
          cont: ''
        },
        resourceList: [],
        resourceCurrent: 1,
        resourceTotal: 0,
        copyrightForm: {
          mediaName: '',
          mediaId: '',
          mediaType: '',
          copyrightContent: ''
        },
        detailCopyrightData: {
          mediaId: '',
          mediaName: '',
          copyrightContent: ''
        },
        rules: {
          mediaName: [
            { required: true, message: '请选择资源', trigger: 'blur' }
          ],
          copyrightContent: [
            { required: true, message: '请输入版权文本', trigger: 'blur' }
          ]
        },
        copyrightId: '',
        resourceObj: {}
      };
    },
    created () {
      this.getMediaCopyrightData({
        current: 1,
        size: 10
      });
    },
    components: {
      quillEditor
    },
    methods: {
      getMediaCopyrightData (params) {
        getMediaCopyrightList('mediaCopyright/mediaCopyrightList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      getResourceData (params) {
        getResourceList('mediaCopyright/resourceList', params).then(res => {
          if (res.code === 0) {
            this.resourceList = res.data.records;
            this.resourceTotal = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getMediaCopyrightData({
          current: 1,
          size: 10,
          keyWord: this.form.cont
        });
      },
      handleResourceSearch () {
        this.getResourceData({
          current: 1,
          size: 10,
          keyWord: this.resourceForm.cont
        });
      },
      handleCurrentChange (val) {
        this.getMediaCopyrightData({
          current: val,
          size: 10,
          keyWord: this.form.cont
        });
      },
      handleResourceChange (val) {
        this.getResourceData({
          current: val,
          size: 10,
          keyWord: this.resourceForm.cont
        });
      },
      selectResource (info) {
        this.dialogResourceVisible = false;
        this.copyrightForm.mediaName = info.title;
        this.copyrightForm.mediaId = info.id;
        this.copyrightForm.mediaType = info.typeCode;
      },
      handleCreate () {
        this.dialogVisible = true;
        this.isEdit = false;
        Object.keys(this.copyrightForm).forEach(key => {
          this.copyrightForm[key] = '';
        });
        this.$nextTick(() => {
          this.$refs['copyrightForm'].resetFields();
        });
      },
      handleAddCopyright () {
        this.$refs['copyrightForm'].validate((valid) => {
          if (valid) {
            if (this.isEdit) {
              updateCopyright('mediaCopyright/updateCopyright', {
                id: this.copyrightId,
                mediaId: this.copyrightForm.mediaId,
                mediaType: this.copyrightForm.mediaType,
                copyrightContent: this.copyrightForm.copyrightContent
              }).then(res => {
                if (res.code === 0) {
                  this.$message.success('编辑成功');
                  this.dialogVisible = false;
                  this.getMediaCopyrightData({
                    current: 1,
                    size: 10
                  });
                }
              });
            } else {
              createCopyright('mediaCopyright/insertCopyright', {
                mediaId: this.copyrightForm.mediaId,
                mediaType: this.copyrightForm.mediaType,
                copyrightContent: this.copyrightForm.copyrightContent
              }).then(res => {
                if (res.code === 0) {
                  this.$message.success('新建成功');
                  this.dialogVisible = false;
                  this.getMediaCopyrightData({
                    current: 1,
                    size: 10
                  });
                }
              });
            }
          }
        });
      },
      handleEdit (id) {
        this.$nextTick(() => {
          this.$refs['copyrightForm'].resetFields();
        });
        this.isEdit = true;
        this.copyrightId = id;
        this.dialogVisible = true;
        getCopyrightDetails('mediaCopyright/copyrightDetails', {
          id
        }).then(res => {
          if (res.code === 0) {
            Object.keys(this.copyrightForm).forEach(key => {
              if (res.data.hasOwnProperty(key)) {
                this.copyrightForm[key] = res.data[key];
              }
            });
          }
        });
      },
      handleDetail (id) {
        this.dialogDetailVisible = true;
        getCopyrightDetails('mediaCopyright/copyrightDetails', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.detailCopyrightData.mediaId = res.data.mediaId;
            this.detailCopyrightData.mediaName = res.data.mediaName;
            this.detailCopyrightData.copyrightContent = res.data.copyrightContent;
            this.detailCopyrightData.mediaType = res.data.mediaType;
          }
        });
      },
      handleSelectResource () {
        this.dialogResourceVisible = true;
        this.getResourceData({
          current: 1,
          size: 10
        });
      },
      handleLookResource () {
        if (this.detailCopyrightData.mediaType === 1) {
          this.$router.push({
            name: 'audioDetail',
            query: {
              id: this.detailCopyrightData.mediaId
            }
          });
        } else {
          this.$router.push({
            name: 'videoDetail',
            query: {
              id: this.detailCopyrightData.mediaId
            }
          });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    .text {
      line-height: 40px;
      font-weight: normal;
    }
    .normal {
      display: block;
      margin-top: -20px;
      line-height: 30px;
    }
  }
</style>

<template>
 <div class="tag-detail">
   <el-row style="padding: 0 20px;">
      <el-col :span="18">
        <el-button style="float: right;" type="primary" @click="dialogTypeVisible = true">新建类型</el-button>
      </el-col>
   </el-row>
   <hr />
   <div v-for="(tags, index) in dataAll" :key="index">
    <el-row :gutter="20">
    <el-col :span="14">
      <span style="font-size: 25px;">类型：{{tags.tagType.tagName}}</span>
    </el-col>
    <el-col :span="4">
      <el-button type="primary" style="float: right;" @click="addTagType(tags)">新建标签</el-button>
    </el-col>
    <el-col :span="3">
      <el-button type="danger" v-if="tags.tagClassify.length === 0" @click="deleteTypeTo(tags)">删除该类型</el-button>
    </el-col>
    </el-row>
    <el-row>
     <el-table
        :data="tags.tagClassify"
        border
        style="width: 45%; margin-left: 10%">
        <el-table-column
        fixed
        align="center"
        prop="tagName"
        label="标签名"
        width="200">
        </el-table-column>
        <el-table-column
        prop="count"
        align="center"
        label="内容数"
        width="200">
        </el-table-column>
        <el-table-column
        prop="playCount"
        align="center"
        label="点播数"
        width="200">
        </el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        align="center"
        width="120">
        <template slot-scope="scope">
          <el-button @click="handleCheckClick(scope.row)" type="text" size="small">编辑</el-button>
          <el-button type="text" @click="handleDeleteClick(scope.row)" size="small">删除</el-button>
        </template>
        </el-table-column>
        </el-table>
      </el-row>
   </div>
   <el-dialog title="新建类型" :visible.sync="dialogTypeVisible">
      <el-form>
        <el-form-item label="类型名称">
          <el-input style="width:40%;" v-model="typeName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTypeVisible = false">取 消</el-button>
        <el-button type="primary" @click="getNewType">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新建标签" :visible.sync="dialogTagVisible">
      <el-form>
        <el-form-item label="标签名称">
          <el-input style="width:40%;" v-model="tagName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTagVisible = false">取 消</el-button>
        <el-button type="primary" @click="getNewTag">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="编辑标签" :visible.sync="dialogCheckVisible">
      <el-form>
        <el-form-item label="标签名称">
          <el-input style="width:40%;" v-model="tagName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCheckVisible = false">取 消</el-button>
        <el-button type="primary" @click="getRecheckTag">确 定</el-button>
      </div>
    </el-dialog>
 </div>
</template>

<script>
  import {addTagType, addTagClassify, deleteType, recheckTag, deleteTag} from 'server/status';
  // import {getTagList} from 'server/content';
  export default {
    props: {
      musicTagDetail: {
        type: Array
      },
      videoTagDetail: {
        type: Array
      },
      perTagDetail: {
        type: Array
      }
    },
    data () {
      return {
        dataList: [],
        dialogTypeVisible: false,
        dialogTagVisible: false,
        dialogCheckVisible: false,
        typeName: '',
        tagName: '',
        parentId: '',
        recheckId: ''
      };
    },
    methods: {
      getNewType () {
        let type = '';
        if (this.musicTagDetail) {
          type = 0;
        } else if (this.videoTagDetail) {
          type = 1;
        } else if (this.perTagDetail) {
          type = 2;
        }
        addTagType('/tagInfo/addTagType', {
          typeName: this.typeName,
          type: type
        }).then(res => {
          if (res.code === 0) {
            this.$emit('changeParent', this.changeParent);
            this.dialogTypeVisible = false;
            this.typeName = '';
            this.$message.success('操作成功');
          }
        });
      },
      addTagType (tags) {
        this.parentId = tags.tagType.id;
        this.dialogTagVisible = true;
      },
      getNewTag () {
        let type = '';
        if (this.musicTagDetail) {
          type = 0;
        } else if (this.videoTagDetail) {
          type = 1;
        } else if (this.perTagDetail) {
          type = 2;
        }
        addTagClassify('/tagInfo/addTagClassify', {
          pid: this.parentId,
          type: type,
          classifyName: this.tagName
        }).then(res => {
          if (res.code === 0) {
            this.$emit('changeParent', this.changeParent);
            this.dialogTagVisible = false;
            this.tagName = '';
            this.$message.success('操作成功');
          }
        });
      },
      deleteTypeTo (tags) {
        deleteType('/tagInfo/deleteTag', {
          id: tags.tagType.id
        }).then(res => {
          if (res.code === 0) {
            this.$emit('changeParent', this.changeParent);
            this.$message.success('操作成功');
          }
        });
      },
      handleCheckClick (row) {
        this.recheckId = row.id;
        this.dialogCheckVisible = true;
      },
      getRecheckTag () {
        recheckTag('/tagInfo/editTag', {
          id: this.recheckId,
          tagName: this.tagName
        }).then(res => {
          if (res.code === 0) {
            this.$emit('changeParent', this.changeParent);
            this.tagName = '';
            this.dialogCheckVisible = false;
            this.$message.success('操作成功');
          }
        });
      },
      handleDeleteClick (row) {
        deleteTag('/tagInfo/deleteTag', {
          id: row.id
        }).then(res => {
          if (res.code === 0) {
            this.$emit('changeParent', this.changeParent);
            this.$message.success('操作成功');
          }
        });
      }
    },
    computed: {
      dataAll () {
        let arr = [];
        if (this.musicTagDetail) {
          arr = this.musicTagDetail;
        } else if (this.videoTagDetail) {
          arr = this.videoTagDetail;
        } else if (this.perTagDetail) {
          arr = this.perTagDetail;
        }
        return arr;
      }
    }
  };
</script>

<style scoped lang="scss">
</style>

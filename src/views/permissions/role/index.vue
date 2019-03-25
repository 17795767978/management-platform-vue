<template>
  <div class="wrapper">
    <div class="search clearfix">
      <el-button class="fr" type="primary" @click="handleAddRole">添加角色</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="角色名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色描述">
          <template slot-scope="scope">
            <span>{{scope.row.descs}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建人">
          <template slot-scope="scope">
            <span>{{scope.row.createName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime|parseTime()}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.id === 1">
              ----
            </div>
            <div v-else>
              <el-button
                size="mini"
                type="primary"
                @click="handleAllot(scope.row.id)"
              >分配权限</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleDeleteRole(scope.row.id)"
              >删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="330px">
      <div>
        <span>角色名称：</span>
        <el-input
          style="width: 200px"
          v-model="name"
          placeholder="请输入角色名称">
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onRoleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="dialogRoleVisible"
      width="300px">
      <div>
        <el-tree
          :data="treeData"
          ref="tree"
          show-checkbox
          node-key="id"
          :default-checked-keys="defaultTreeData"
          :props="defaultProps">
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onAllotubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getRoleList, addSysRole, deleteSysRole, queryPermission, updateSysRole } from '../../../server/sys';
  import { parseTime } from '../../../filter';

  export default {
    name: 'Role',
    data () {
      return {
        list: [],
        dialogVisible: false,
        dialogRoleVisible: false,
        name: '',
        allotId: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        treeData: [],
        defaultTreeData: []
      };
    },
    created () {
      this.getSysRoleList();
    },
    filters: {
      parseTime
    },
    methods: {
      getSysRoleList () {
        getRoleList('sys/role/list').then(res => {
          if (res.code === 0) {
            this.list = res.data;
          }
        });
      },
      onRoleSubmit () {
        addSysRole('sys/role/add', {
          name: this.name
        }).then(res => {
          if (res.code === 0) {
            this.getSysRoleList();
            this.$message.success('添加成功!');
            this.dialogVisible = false;
          }
        });
      },
      handleDeleteRole (id) {
        deleteSysRole('sys/role/delete', {
          id: id
        }).then(res => {
          if (res.code === 0) {
            this.getSysRoleList();
            this.$message.success('删除成功！');
          }
        });
      },
      handleAllot (id) {
        this.dialogRoleVisible = true;
        this.allotId = id;
        queryPermission('sys/function/function/query', {
          roleId: id
        }).then(res => {
          if (res.code === 0) {
            this.treeData = res.data.allTreeMapList;
            this.defaultTreeData = res.data.checkNodeIds;
          }
        });
      },
      onAllotubmit () {
        const checkedKeys = this.$refs.tree.getCheckedKeys();
        updateSysRole('sys/role/function/update', {
          checkedKeys: checkedKeys.join(','),
          sysRoleId: this.allotId
        }).then(res => {
          if (res.code === 0) {
            this.dialogRoleVisible = false;
            this.$message.success('分配成功！');
          }
        });
      },
      handleAddRole () {
        this.name = '';
        this.dialogVisible = true;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .wrapper {
    .search {
      margin-bottom: 30px;
    }
  }
</style>

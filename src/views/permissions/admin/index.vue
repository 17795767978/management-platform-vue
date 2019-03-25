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
            v-model="form.name"
            placeholder="管理员姓名、角色">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSearch">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button class="fr" type="primary" @click="addAdmin">添加管理员</el-button>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        border
        fit
        highlight-current-row
        style="width: 100%">
        <el-table-column align="center" label="账号">
          <template slot-scope="scope">
            <span>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="管理员姓名">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="角色">
          <template slot-scope="scope">
            <span>{{scope.row.roleName}}</span>
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
              -----
            </div>
            <div v-else>
              <el-button
                size="mini"
                type="primary"
                @click="handleEditAdmin(scope.row.id)"
              >编辑</el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleRemoveAdmin(scope.row.id)"
              >删除</el-button>
            </div>
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
      title="提示"
      :visible.sync="dialogVisible"
      width="420px">
      <el-form label-width="100px" :model="adminForm" ref="adminForm" :rules="rules">
        <el-form-item label="账号：" prop="account">
          <el-input
            style="width: 240px"
            :disabled="isDisable"
            placeholder="请输入账号"
            v-model="adminForm.account"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input
            type="password"
            style="width: 240px"
            placeholder="请输入密码"
            v-model="adminForm.password"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input
            style="width: 240px"
            placeholder="请输入姓名"
            v-model="adminForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色：" prop="roleId">
          <el-select
            style="width: 240px"
            v-model="adminForm.roleId"
            placeholder="请选择">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getSysAdminList, addSysAdmin, deleteSysAdmin, getAdminInfoById, getRoleList, editSysAdmin } from '../../../server/sys';
  import { parseTime } from '../../../filter';

  export default {
    name: 'Admin',
    data () {
      return {
        form: {
          name: ''
        },
        list: [],
        current: 1,
        total: 0,
        dialogVisible: false,
        adminForm: {
          account: '',
          password: '',
          name: '',
          roleId: ''
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          roleId: [
            { required: true, message: '请选择', trigger: 'blur' }
          ]
        },
        roleOptions: [],
        adminId: '',
        isAdd: true,
        isDisable: false
      };
    },
    filters: {
      parseTime
    },
    created () {
      this.getAdminList('sys/user/page', {
        current: 1,
        size: 10
      });
      getRoleList('sys/role/list').then(res => {
        if (res.code === 0) {
          this.roleOptions = res.data.map(item => {
            return {
              label: item.name,
              value: item.id
            };
          });
        }
      });
    },
    methods: {
      getAdminList(url, params) {
        getSysAdminList(url, params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.current = res.data.current;
            this.total = res.data.total;
          }
        });
      },
      onSearch () {
        this.getAdminList('sys/user/page', {
          name: this.form.name,
          current: 1,
          size: 10
        });
      },
      handleCurrentChange (val) {
        this.current = val;
        this.getAdminList('sys/user/page', {
          name: this.form.name,
          current: this.current,
          size: 10
        });
      },
      addAdmin () {
        this.dialogVisible = true;
        this.isAdd = true;
        this.isDisable = false;
        Object.keys(this.adminForm).forEach(key => {
          this.adminForm[key] = '';
        });
        this.$nextTick(() => {
          this.$refs['adminForm'].resetFields();
        });
      },
      onSubmit () {
        this.$refs['adminForm'].validate((valid) => {
          if (valid) {
            if (this.isAdd) {
              addSysAdmin('sys/user/add', this.adminForm).then(res => {
                if (res.code === 0) {
                  this.dialogVisible = false;
                  this.$message.success('添加成功！');
                  this.getAdminList('sys/user/page', {
                    current: 1,
                    size: 10
                  });
                }
              });
            } else {
              editSysAdmin('sys/user/update', {
                id: this.adminId,
                name: this.adminForm.name,
                password: this.adminForm.password,
                roleId: this.adminForm.roleId
              }).then(res => {
                if (res.code === 0) {
                  this.dialogVisible = false;
                  this.$message.success('编辑成功！');
                  this.getAdminList('sys/user/page', {
                    current: 1,
                    size: 10
                  });
                }
              });
            }
          }
        });
      },
      handleRemoveAdmin (id) {
        deleteSysAdmin('sys/user/delete', {
          id
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('删除成功！');
            this.getAdminList('sys/user/page', {
              current: 1,
              size: 10
            });
          }
        });
      },
      handleEditAdmin (id) {
        this.$refs['adminForm'].resetFields();
        this.dialogVisible = true;
        this.isAdd = false;
        this.adminId = id;
        this.isDisable = true;
        getAdminInfoById('sys/user/info/id', {
          id
        }).then(res => {
          if (res.code === 0) {
            Object.keys(this.adminForm).forEach(key => {
              if (res.data.sysUser.hasOwnProperty(key)) {
                this.adminForm[key] = res.data.sysUser[key];
              }
            });
            this.adminForm.roleId = res.data.sysRoleId;
            this.adminForm.password = '';
          }
        });
      }
    }
  };
</script>

<style scoped>
</style>

<template>
  <div class="wrapper">
    <div class="search">
      <el-form
        class="fl"
        :inline="true"
        :model="form">
        <el-form-item>
          <el-input
            style="width: 300px"
            v-model="form.cont"
            placeholder="用户ID、昵称、账号、姓名">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.type">
            <el-option
              v-for="item in form.typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.status">
            <el-option
              v-for="item in form.statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="list"
        row-key="id"
        size="small"
        border
        stripe
        fit
        style="width: 100%">
        <el-table-column align="center" label="认证/认领">
          <template slot-scope="scope">
            <span>{{scope.row.type | getTypeText}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="LOGO" width="80">
          <template slot-scope="scope">
            <span><img width="50" v-if="scope.row.logo" :src="scope.row.logo" alt=""></span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="乐队">
          <template slot-scope="scope">
            <span>{{scope.row.bandName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="城市">
          <template slot-scope="scope">
            <span>{{scope.row.provinceName}} {{scope.row.cityName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="申请人姓名">
          <template slot-scope="scope">
            <span>{{scope.row.createName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="注册账号">
          <template slot-scope="scope">
            <span>{{scope.row.account}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="联系电话">
          <template slot-scope="scope">
            <span>{{scope.row.contactPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="认证状态">
          <template slot-scope="scope">
            <span>{{scope.row.status | getStatusText}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="$router.push({
              path: '/band/band-auditing-detail',
              query: {
                id: scope.row.id
              }
            })">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import {
    getBandAuditList
  } from '../../server/content';
  export default {
    name: 'bandAuditing',
    data() {
      return {
        form: {
          cont: '',
          status: 0,
          type: '',
          typeOptions: [{
            value: '',
            label: '全部状态'
          }, {
            value: 1,
            label: '乐队认证'
          }, {
            value: 2,
            label: '乐队认领'
          }],
          statusOptions: [{
            value: 0,
            label: '待审核'
          }, {
            value: 2,
            label: '驳回'
          }, {
            value: 3,
            label: '认证失败'
          }]
        },
        list: [],
        current: 1,
        total: 0,
        rules: {
          logo: [
            {required: true, message: '请上传乐队LOGO', trigger: 'blur'}
          ],
          mainImage: [
            {required: true, message: '请上传主题图片', trigger: 'blur'}
          ],
          bandName: [
            {required: true, message: '请输入乐队名称', trigger: 'blur'}
          ],
          cityId: [
            {required: true, message: '请选择城市', trigger: 'blur'}
          ],
          introduction: [
            {required: true, message: '请输入乐队简介', trigger: 'blur'}
          ],
          captainId: [
            {required: true, message: '请选择乐队队长', trigger: 'blur'}
          ]
        }
      };
    },
    created() {
      this.getBandData({
        current: 1,
        size: 10,
        status: this.form.status,
        type: this.form.type
      });
    },
    // mixins: [beforeAvatar],
    methods: {
      getBandData (params) {
        getBandAuditList('bandApprove/bandAuditList', params).then(res => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.total = res.data.total;
          }
        });
      },
      handleSearch () {
        this.getBandData({
          current: 1,
          size: 10,
          keyWord: this.form.cont,
          status: this.form.status,
          type: this.form.type
        });
      }
    },
    filters: {
      getStatusText (text) {
        const statusType = {
          '0': '待审核',
          '1': '审核通过',
          '2': '驳回',
          '3': '认证失败'
        };
        return statusType[text];
      },
      getTypeText (text) {
        const statusType = {
          '1': '认证',
          '2': '认领'
        };
        return statusType[text];
      }
    }
  };
</script>

<style scoped>

</style>

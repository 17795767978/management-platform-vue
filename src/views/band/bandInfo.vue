<template>
  <div>
    <el-row :gutter="100">
        <el-col :span="4">
        <div class="logo">
          <img :src="bandInfo.logo" width="100%" height="100%">
        </div>
        </el-col>
        <el-col :span="12">
        <p>乐队名称：{{bandInfo.bandName}}</p>
        <p>城市：{{bandInfo.provinceName}} {{bandInfo.cityName}}</p>
        <p>简介：{{bandInfo.introduction}}</p>
        <p>粉丝数：{{bandInfo.realCount}}</p>
        <p>
          <span>粉丝数修改结果：{{bandInfo.fansCount}}</span>
          <span>
            <el-input style="width: 30%;margin-left: 20px;" v-model="fansCount"></el-input>
          </span>
          <el-button type="primary" @click="goToSigup">保存</el-button>
        </p>
        </el-col>
        <el-col :span="5">
        <div class="banner">
          <img :src="bandInfo.mainImage" width="100%" height="100%">
        </div>
        </el-col>
    </el-row>
    <el-row :gutter="100" v-if="bandCaptain.id && bandMemberDetailsList.length > 0">
        <h3 style="padding-left: 50px;">队长信息</h3>
        <el-col :span="4">
        <div class="logo">
          <img :src="bandCaptain.head_image" height="100%">
        </div>
        </el-col>
        <el-col :span="6">
        <p>用户名称：{{bandCaptain.nickname}}</p>
        <p>手机号：{{bandCaptain.telphone}}</p>
        </el-col>
        <el-col :span="6">
        <p>用户类型：乐队队长</p>
        <p>对内身份：{{bandCaptain.certified_instrument}}</p>
        </el-col>
        <el-col :span="2">
        <el-button type="primary" @click="$router.push({
          path: '/user/detail',
          query: {
            id: bandCaptain.id,
            bandId: bandInfo.id
          }
        })">查看队长</el-button>
        </el-col>
    </el-row>
    <el-row :gutter="100" v-if="bandMembers.length > 0">
        <div v-for="(member, index) in bandMembers" :key="index">
        <h3 style="padding-left: 50px;">队员信息</h3>
          <el-row style="padding-left: 50px;">
            <el-col :span="4">
            <div class="logo">
              <img :src="member.head_image" height="100%">
            </div>
            </el-col>
            <el-col :span="6">
            <p>用户名称：{{member.nickname}}</p>
            <p>手机号：{{member.telphone}}</p>
            </el-col>
            <el-col :span="6">
            <p>用户类型：乐队队员</p>
            <p>对内身份：{{member.certified_instrument}}</p>
            </el-col>
            <el-col :span="2">
            <el-button type="primary" @click="$router.push({
              path: '/user/detail',
              query: {
                id: member.id,
                bandId: bandInfo.id
              }
            })">查看队员</el-button>
            </el-col>
            </el-row>
        </div>
    </el-row>
    <el-row v-if="bandMemberDetailsList.length === 0">
      <p>此乐队没有乐队队长和成员</p>
    </el-row>
    <!-- <el-col style="position: absolute; right: 0; top: 12px;" :span="2">
        <el-button type="primary" v-show="checkBand" @click="checkBand = !checkBand">保存</el-button>
        <el-button type="primary" v-show="!checkBand" @click="checkBand = !checkBand">编辑</el-button>
    </el-col> -->
    <!-- <el-dialog title="更改乐队队长" :visible.sync="dialogTableVisible" style="width: 60%; margin-left: 20%">
    <el-table :data="bandMembers" style="width: 100%;">
        <el-table-column property="nickname" label="乐队成员" width="150"></el-table-column>
        <el-table-column property="certified_instrument" label="认证乐器" width="200"></el-table-column>
        <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
            <el-button
            @click.native.prevent="changeCaptain(scope.row.id)"
            type="text"
            size="small">
            选择
            </el-button>
        </template>
        </el-table-column>
    </el-table>
    </el-dialog> -->
  </div>
</template>

<script>
import {recheckLikeNum} from 'server/status';
  export default {
    props: {
      bandInfo: {
        type: Object
      },
      bandMemberDetailsList: {
        type: Array
      }
    },
    data () {
      return {
        checkBand: false,
        dialogTableVisible: false,
        fansCount: ''
      };
    },
    methods: {
    //   changeCaptain (id) {
    //     editBandMember('/bandInfo/addOrUpdateBand', {
    //       bandName: this.bandInfo.bandName,
    //       bandId: this.bandInfo.id,
    //       captainId: this.bandCaptain.id,
    //       memberIds: id
    //     }).then(res => {
    //       if (res.code === 0) {
    //         console.log(123);
    //       }
    //     });
    //   }
      goToSigup () {
        recheckLikeNum('/bandInfo/updateFansCount', {
          id: this.bandInfo.id,
          num: this.fansCount
        }).then(res => {
          if (res.code === 0) {
            this.fansCount = '';
            this.$message.success(res.msg);
            this.$emit('change');
          }
        });
      }
    },
    computed: {
      bandCaptain () {
        let arr = {};
        this.bandMemberDetailsList.forEach((item) => {
          if (item.identity_flag === 1) {
            arr = item;
          }
        });
        return arr;
      },
      bandMembers () {
        let arr = [];
        this.bandMemberDetailsList.forEach((item) => {
          if (item.identity_flag === 2) {
            arr.push(item);
          }
        });
        console.log(arr);
        return arr;
      }
    },
    mounted () {
      console.log(this.bandInfo);
    }
  };
</script>

<style scoped lang="scss">
.el-row {
  padding: 0 20px;
  box-sizing: border-box;
}
.logo {
  width: 200px;
  height: 200px;
  background-color: #fff;
}
.banner {
  width: 267px;
  height: 200px;
  background-color: #fff;
}
.el-tabs__nav-scroll {
  height: 60px;
}
</style>

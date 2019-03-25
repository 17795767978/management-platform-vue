<template>
  <div class="wrapper">
    <el-row
      type="flex"
      justify="space-between"
      align="middle">
      <el-col :span="4">
        <span>ID：{{memberInfo.id}}</span>
      </el-col>
      <el-col :span="4">
        <span v-if="$route.query.hasOwnProperty('virtu')">认证状态：{{parseInt($route.query.virtu) === 0 ? '已认证' : '未认证，未关联用户'}}</span>
      </el-col>
      <el-col :span="4">
        <span>当前状态：{{memberInfo.status === 0 ? '正常' : '封禁'}}</span>
      </el-col>
      <el-col :span="4">
        <el-button
          type="primary"
          v-if="memberInfo.realFlag === 0"
          @click="isOrdinary = true">
          音乐人认证
        </el-button>
        <!--<el-button
          type="primary"
          v-if="memberInfo.realFlag === 1"
          @click="isOrdinary = true">
          音乐人认证
        </el-button>-->
        <el-button
          type="danger"
          v-if="memberInfo.status === 0"
          @click="handleBanned">
          封禁
        </el-button>
        <el-button
          type="primary"
          v-if="memberInfo.status === 1"
          @click="handleUnsealing">
          解除封禁
        </el-button>
        <el-button
          type="primary"
          v-if="parseInt($route.query.virtu) === 1"
          @click="handleUserBand">
          关联用户
        </el-button>
      </el-col>
    </el-row>
    <el-dialog
      title="音乐人认证"
      width="400px"
      :visible.sync="isOrdinary">
      <el-row type="flex" justify="space-between">
        <el-col :span="24">
          <el-form
            :model="musiciansForm"
            :rules="rules"
            ref="musiciansForm"
            label-width="100px">
            <el-form-item label="您的姓名：" prop="realName">
              <el-input
                v-model="musiciansForm.realName"
                style="width: 240px"
                placeholder="请输入真实姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="性别：" prop="sex">
              <el-select style="width: 240px" v-model="musiciansForm.sex" placeholder="请选择">
                <el-option
                  :key="1"
                  label="男"
                  value="1">
                </el-option>
                <el-option
                  :key="2"
                  label="女"
                  value="2">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="认证乐器：" prop="certifiedInstrument">
              <el-input
                v-model="musiciansForm.certifiedInstrument"
                style="width: 240px"
                placeholder="请输出认证乐器"
                maxlength="10">
              </el-input>
            </el-form-item>
            <el-form-item label="用户照片：" prop="picture">
              <el-upload
                class="banner-uploader"
                action=""
                :before-upload="beforeAvatarUpload"
                :http-request="uploadAvatar"
                :show-file-list="false">
                <img v-if="musiciansForm.picture" :src="musiciansForm.picture" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <!--<el-form-item>
              <el-button type="primary" @click="handleApprove">认证为乐手</el-button>
              <el-button type="primary" @click="isOrdinary=false">取消乐手认证</el-button>
            </el-form-item>-->
          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
    <el-button @click="isOrdinary = false">取 消</el-button>
    <el-button type="primary" @click="handleApprove">确认</el-button>
  </span>
    </el-dialog>
    <!--<div v-if="isOrdinary">
      <h3>乐手认证</h3>
      <el-row type="flex" justify="space-between">
        <el-col :span="24">
          <el-form
            :model="musiciansForm"
            :rules="rules"
            ref="musiciansForm"
            label-width="100px">
            <el-form-item label="认证乐器：" prop="authenticationIdentity">
              <el-input
                v-model="musiciansForm.authenticationIdentity"
                style="width: 240px"
                placeholder="请输出认证乐器"
                maxlength="10">
              </el-input>
            </el-form-item>
            <el-form-item label="真实姓名：" prop="name">
              <el-input
                v-model="musiciansForm.name"
                style="width: 240px"
                placeholder="请输入真实姓名">
              </el-input>
            </el-form-item>
            <el-form-item label="用户照片：" prop="photoUrl">
              <el-upload
                class="banner-uploader"
                action=""
                :before-upload="beforeAvatarUpload"
                :http-request="uploadAvatar"
                :show-file-list="false">
                <img v-if="musiciansForm.photoUrl" :src="musiciansForm.photoUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleApprove">认证为乐手</el-button>
              <el-button type="primary" @click="isOrdinary=false">取消乐手认证</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>-->
    <el-row class="user-info">
      <el-col :span="24">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane name="userInfo" :disabled="isMusician" label="用户信息" >
            <h3>基本信息</h3>
            <el-row>
              <el-col :span="8">
                <el-form label-width="100px">
                  <el-form-item label="昵称：">
                    <span>{{memberInfo.nickname}}</span>
                  </el-form-item>
                  <el-form-item label="粉丝数：">
                    <span>{{memberInfo.realCount}}</span>
                  </el-form-item>
                  <el-form-item v-if="memberInfo.realFlag === 1" label="粉丝数修改：">
                    <span>{{memberInfo.fansCount}}</span>
                    <el-input v-model="fansNumber" style="width: 100px; margin: 0 10px;" placeholder="粉丝数"></el-input>
                    <el-button type="primary" @click="handleEditFans">粉丝数修改</el-button>
                  </el-form-item>
                  <el-form-item label="账号关联：">
                    <span>{{memberInfo.openid}}</span>
                  </el-form-item>
                  <el-form-item label="个性签名：">
                    <span>{{memberInfo.introduction}}</span>
                  </el-form-item>
                  <!--<el-form-item label="用户性别：">
                    <span>{{memberInfo.sex|getGeneralText()}}</span>
                  </el-form-item>-->
                </el-form>
              </el-col>
              <el-col :span="8">
                <el-form label-width="100px">
                  <el-form-item label="用户头像：">
                    <img class="headimg" :src="memberInfo.headImage" alt="" width="200">
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="8" :md="8" :sm="24" :xs="24">
                <el-form label-width="100px">
                  <el-form-item label="背景图：">
                    <img class="ver-top" :src="memberInfo.mainImage" alt="" width="300">
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <hr>
            <h3>个人信息</h3>
            <el-row>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="用户生日：">
                    <span>{{memberInfo.birthday|parseTime('{y}-{m}-{d}')}}</span>
                  </el-form-item>
                  <el-form-item label="用户学历：">
                    <span>{{memberInfo.education}}</span>
                  </el-form-item>
                  <el-form-item label="用户职业：">
                    <span>{{memberInfo.profession}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>
            <!--<el-row>
              <el-col :span="12">
                <el-form label-width="100px">
                  <el-form-item label="用户ID：">
                    <span>{{memberInfo.id}}</span>
                  </el-form-item>
                  <el-form-item label="用户类型：">
                    <span>{{memberInfo.identity}}</span>
                  </el-form-item>
                  <el-form-item label="认证乐手：">
                    <span>{{memberInfo.certifiedInstrument}}</span>
                  </el-form-item>
                  <el-form-item label="手机号：">
                    <span>{{memberInfo.telphone}}</span>
                  </el-form-item>
                  <el-form-item label="粉丝数：">
                    <span>{{memberInfo.realCount}}</span>
                  </el-form-item>
                  <el-form-item v-if="memberInfo.realFlag === 1" label="粉丝数修改：">
                    <span>{{memberInfo.fansCount}}</span>
                    <el-input v-model="fansNumber" style="width: 100px; margin: 0 10px;" placeholder="粉丝数"></el-input>
                    <el-button type="primary" @click="handleEditFans">粉丝数修改</el-button>
                  </el-form-item>
                  <el-form-item label="第三方账号：">
                    <span>{{memberInfo.openid}}</span>
                  </el-form-item>
                </el-form>
              </el-col>
              <el-col :span="12">
                <el-form label-width="140px">
                  <el-form-item label="注册时间：">
                    <span>{{memberInfo.createTime|parseTime()}}</span>
                  </el-form-item>
                  <el-form-item label="最近一次登录时间：">
                    {{memberInfo.lastLoginTime|parseTime()}}
                  </el-form-item>
                  <el-form-item v-if="memberInfo.realFlag === 1" label="真实姓名：">
                    <span>{{memberInfo.realName}}</span>
                  </el-form-item>
                  <el-form-item v-if="memberInfo.realFlag === 1" label="用户照片：">
                    <img :src="memberInfo.picture" alt="" width="300">
                  </el-form-item>
                </el-form>
              </el-col>
            </el-row>-->
            <!--<div v-if="$route.query.bandId">
              <h3>归属乐队</h3>
              <el-form label-width="100px">
                <el-form-item label="所属乐队：">
                  <span>{{bandInfo.bandName}}</span>
                </el-form-item>
                <el-form-item label="乐队成员：">
                  <span
                    class="member-txt"
                    @click="handleMemberItem(item.memberId, $route.query.bandId)"
                    v-for="item in bandInfo.memberName"
                    :key="item.memberId">
                      {{item.memberName}}
                    </span>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="$router.push({
                      name: 'BandDetail',
                      query: {
                        id: $route.query.bandId
                      }
                    })">
                    查看乐队
                  </el-button>
                </el-form-item>
              </el-form>
            </div>-->
          </el-tab-pane>
          <el-tab-pane v-if="parseInt($route.query.virtu) === 1" name="authenticationInformation" :label="'认证信息-'+virtualMemberAuthInfo.identity">
            <el-row :gutter="24">
              <el-col :span="12">
                <div style="float: left; line-height: 36px;">
                  <span>个人信息</span>
                </div>
              </el-col>
             <!-- <el-col :span="12">
                <div style="float: right">
                  <el-button style="float: right; margin-left: 50px;" type="danger" @click="cacelInfo = true">取消认证</el-button>
                </div>
                <div style="float: right;">
                  <el-button style="float: right" type="primary" @click="checkInfoStatus = true">修改认证信息</el-button>
                </div>
              </el-col> -->
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="2">姓名：</el-col>
                <el-col :span="3">{{virtualMemberAuthInfo.realName}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">性别：</el-col>
                <el-col :span="3" v-if="virtualMemberAuthInfo.sex === 0">保密</el-col>
                <el-col :span="3" v-else-if="virtualMemberAuthInfo.sex === 1">男</el-col>
                <el-col :span="3" v-else-if="virtualMemberAuthInfo.sex === 2">女</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">联系电话：</el-col>
                <el-col :span="3">{{virtualMemberAuthInfo.contactPhone}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">身份证：</el-col>
                <el-col :span="3">{{virtualMemberAuthInfo.idCode}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">个人照片：</el-col>
                <el-col :span="5">
                  <img :src="virtualMemberAuthInfo.picture" width="200" height="200" alt="">
                </el-col>
              </el-row>
            </el-row>
            <hr />
            <el-row>
              <el-row>
                <h3>身份信息</h3>
              </el-row>
              <el-row>
                <el-col :span="1.5">认证身份：</el-col>
                <el-col :span="2">{{virtualMemberAuthInfo.identity}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="1.5">擅长技能：</el-col>
                <el-col :span="10">{{virtualMemberAuthInfo.certifiedInstrument}}</el-col>
              </el-row>
            </el-row>
          </el-tab-pane>
          <el-tab-pane v-else name="authenticationInformation" :disabled="memberInfoMusician.identityCode === 1" :label="'认证信息-'+memberInfoMusician.identity">
            <el-row :gutter="24">
              <el-col :span="12">
                <div style="float: left; line-height: 36px;">
                  <span>个人信息</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div style="float: right">
                  <el-button v-if="memberInfoMusician.identityCode === 0" style="float: right; margin-left: 50px;" type="danger" @click="cacelInfo = true">取消认证</el-button>
                </div>
                <div style="float: right;">
                  <el-button style="float: right" type="primary" @click="checkInfoStatus = true">修改认证信息</el-button>
                </div>
              </el-col>
            </el-row>
            <el-row>
              <el-row>
                <el-col :span="2">姓名：</el-col>
                <el-col :span="3">{{memberInfoMusician.realName}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">性别：</el-col>
                <el-col :span="3" v-if="memberInfoMusician.sex === 0">保密</el-col>
                <el-col :span="3" v-else-if="memberInfoMusician.sex === 1">男</el-col>
                <el-col :span="3" v-else-if="memberInfoMusician.sex === 2">女</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">联系电话：</el-col>
                <el-col :span="3">{{memberInfoMusician.telphone}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">身份证：</el-col>
                <el-col :span="3">{{memberInfoMusician.idCode}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="2">个人照片：</el-col>
                <el-col :span="5">
                  <img :src="memberInfoMusician.picture" width="200" height="200" alt="">
                </el-col>
              </el-row>
            </el-row>
            <hr />
            <el-row>
              <el-row>
                <h3>身份信息</h3>
              </el-row>
              <el-row>
                <el-col :span="1.5">认证身份：</el-col>
                <el-col :span="2">{{memberInfoMusician.identity}}</el-col>
              </el-row>
              <el-row>
                <el-col :span="1.5">擅长技能：</el-col>
                <el-col :span="10">{{memberInfoMusician.certifiedInstrument}}</el-col>
              </el-row>
              <el-row v-if="$route.query.bandId">
                <el-col :span="1.5">归属乐队：</el-col>
                <el-col :span="10">
                  {{bandInfo.bandName}}
                  <el-button type="text" size="mini"  @click="$router.push({
                    path: '/band/band-detail',
                    query: {
                      id: $route.query.bandId
                    }})">查看乐队</el-button>
                </el-col>
              </el-row>
              <el-row v-if="$route.query.bandId">
                <el-col :span="1.5">乐队成员：</el-col>
                <el-col :span="10">
                  <el-table
                    :data="bandMember"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="memberName"
                      align="center"
                      label="昵称">
                    </el-table-column>
                    <el-table-column
                      prop="realName"
                      align="center"
                      label="姓名">
                    </el-table-column>
                    <el-table-column
                      prop="account"
                      align="center"
                      label="注册账号">
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </el-row>
            <hr />
            <el-row>
              <el-row>
                <h3>认证记录</h3>
              </el-row>
              <el-row :gutter="24">
                <el-table
                  :data="authenticationRecords"
                  border
                  style="width: 100%">
                  <el-table-column
                    prop="authenticateRecord"
                    align="center"
                    width="150"
                    label="认证记录">
                  </el-table-column>
                  <el-table-column
                    prop="description"
                    align="center"
                    label="详情">
                  </el-table-column>
                  <el-table-column
                    prop="creator"
                    align="center"
                    width="150"
                    label="操作人">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    align="center"
                    width="300"
                    label="时间">
                  </el-table-column>
                </el-table>
              </el-row>
            </el-row>
          </el-tab-pane>
          <el-tab-pane name="songList" :disabled="isMusician" label="歌单列表">
            <div style="padding: 30px">
              <el-row v-if="songSheetInfo">
                <el-col :span="8" v-if="songSheetInfo.mainImage">
                  <span class="ver-top">歌单封面：</span>
                  <img class="ver-top" :src="songSheetInfo.mainImage" alt="" width="300px">
                </el-col>
                <el-col :span="8" v-if="songSheetInfo.name">
                  歌单名称：{{songSheetInfo.name}}
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <el-table
                    :data="musicList"
                    row-key="id"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%">
                    <el-table-column align="center" label="音频标题">
                      <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
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
                    <el-table-column align="center" label="音频标签">
                      <template slot-scope="scope">
                        <span>{{scope.row.tag}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="音频归属">
                      <template slot-scope="scope">
                        <span>{{scope.row.ascriptionName}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="归属专辑">
                      <template slot-scope="scope">
                        <span>{{scope.row.albumTitle}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" label="播放时长">
                      <template slot-scope="scope">
                        <span>{{scope.row.media_time}}</span>
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
                        <el-button
                          size="mini"
                          type="primary"
                          @click="$router.push({
                            path: '/content/audio-detail',
                            query: {
                              id: scope.row.id
                            }
                          })"
                        >查看</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-dialog title="修改认证信息" width="30%" :visible.sync="checkInfoStatus">
      <el-row>
        <el-row>
          您的姓名：
          <el-input type="text" style="width: 300px;" v-model="memberInfoMusicianForm.realName"></el-input>
        </el-row>
        <el-row>
          您的性别：
          <el-select v-model="memberInfoMusicianForm.sex" placeholder="请选择性别">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </el-row>
        <el-row>
          擅长技能：
          <el-input type="text" style="width: 300px;" v-model="memberInfoMusicianForm.certifiedInstrument"></el-input>
          {{memberInfoMusicianForm.certifiedInstrument && memberInfoMusicianForm.certifiedInstrument !== null ? memberInfoMusicianForm.certifiedInstrument.length : 0}}/10
        </el-row>
        <el-row>
          <p>个人照片:</p>
          <p style="color: red">请上传200*200大小的图片</p>
          <el-upload
            class="avatar-uploader"
            accept="image/*"
            :show-file-list="false"
            action=""
            :http-request="fnUploadRequests"
            :before-upload="beforeAvatarUpload"
            >
            <img v-if="memberInfoMusicianForm.picture" width="200" height="200" :src="memberInfoMusicianForm.picture" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-row>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="checkInfoStatus = false">取 消</el-button> -->
        <el-button @click="cacelcheckInfo">取 消</el-button>
        <!-- <el-button type="primary" @click="checkInfoStatus = false">确 定</el-button> -->
        <el-button type="primary" @click="checkMemberInfo">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="取消认证"
      :visible.sync="cacelInfo"
      width="30%">
      <span>取消认证后，该用户将变更为普通用户，不在有认证音乐人权限，是否确认？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cacelInfo = false">取 消</el-button>
        <el-button type="primary" @click="confirmCacelInfo">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="关联用户"
      :visible.sync="userBandDialog"
      width="60%">
      <el-row :gutter="24">
        <el-col :span="6">
          <el-input v-model="keyWord" placeholder="昵称、注册账号"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="getUncertifiedMemberList">搜索</el-button>
        </el-col>
        <el-col style="line-height:36px" :span="10">
          <span>仅能查看未封禁，未认证的用户</span>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-table
          ref="multipleTable"
          :data="connectUser"
          border
          tooltip-effect="dark"
          style="width: 90%">
          <el-table-column
            align="center"
            prop="headImage"
            label="照片">
            <template slot-scope="scope">
              <img width="60" height='60' :src="scope.row.headImage" alt="">
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="sex"
            label="性别">
          </el-table-column>
          <el-table-column
            align="center"
            prop="account"
            label="归属乐队"
            width="120">
          </el-table-column>
          <el-table-column
            align="center"
            prop="fansCount"
            label="擅长技能">
          </el-table-column>
          <el-table-column
            align="center"
            label="认证身份"
            prop="identity">
          </el-table-column>
          <el-table-column
            align="center"
            prop="signUpTime"
            label="注册时间">
          </el-table-column>
          <el-table-column
            align="center"
            label="关联"
            prop="connect"
            >
            <template slot-scope="scope">
              <!--<el-button v-if="scope.row.id == memberId" size="mini" type="success">已关联</el-button>-->
              <el-button size="mini" native-type="button" @click="getConnectId(scope.row)">关联</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userBandDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { getMemberDetails, prohibition, unsealing, memberAuthentication, updateFansCount, getAscriptionBand, virtualMemberAuthInfo } from '../../server/content';
  import { memberAuthenticationInfo, updateAuthenticationInfo, cancelAuthentication, uncertifiedMemberList, virtualMusicianAssociate } from 'server/musician';
  import { getGeneralText, parseTime } from '../../filter';
  import { doUpload } from '../../utils/upload';
  import { aliOssUrl, ERR_OK } from '../../config/env';
  // import { beforeAvatar } from '../../mixins';

  export default {
    name: 'UserDetail',
    data() {
      return {
        keyWord: '',
        memberInfo: {},
        songSheetInfo: {},
        musicList: [],
        bandMember: [],
        recordsList: [],
        virtualMemberAuthInfo: {},
        connectUser: [],
        memberId: '',
        musiciansForm: {
          certifiedInstrument: '',
          realName: '',
          sex: '1',
          picture: ''
        },
        isApprove: true,
        isOrdinary: false,
        activeName: 'userInfo',
        bandInfo: {},
        fansNumber: '',
        rules: {
          certifiedInstrument: [
            {required: true, message: '请输入乐器', trigger: 'blur'}
          ],
          realName: [
            {required: true, message: '请输入姓名', trigger: 'blur'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'blur'}
          ],
          picture: [
            {required: true, message: '请上传用户照片', trigger: 'blur'}
          ]
        },
        checkInfoStatus: false,
        cacelInfo: false,
        checkInfo: {
          realName: '',
          sex: '',
          certifiedInstrument: '',
          picture: '',
          id: ''
        },
        inFoStatus: '认证信息',
        memberInfoMusician: {},
        memberInfoMusicianForm: {
          certifiedInstrument: '',
          realName: '',
          sex: '1',
          picture: '',
          id: ''
        },
        authenticationRecords: [],
        options2: [
          {
            value: 0,
            label: '保密',
            disabled: false
          },
          {
            value: 1,
            label: '男',
            disabled: false
          },
          {
            value: 2,
            label: '女',
            disabled: false
          }
        ],
        userBandDialog: false
      };
    },
    created () {
      console.log(this.$route.query.status);
    },
    mounted () {
      this.getMemberData();
    },
    filters: {
      getGeneralText,
      parseTime
    },
    // mixins: [beforeAvatar],
    computed: {
      isMusician () {
        if (this.virtualMemberAuthInfo.id) {
          return true;
        } else {
          return false;
        }
      }
    },
    methods: {
      handleUserBand () {
        // this.getUncertifiedMemberList();
        this.userBandDialog = true;
      },
      confirmUserBand () {
        virtualMusicianAssociate('/musician/virtualMusicianAssociate', {
          Id: this.$route.query.id,
          memberId: this.memberId
        }).then(res => {
          if (res.code === 0) {
           this.$message.success(res.msg);
          }
          this.userBandDialog = false;
        });
      },
      _virtualMemberAuthInfo () {
        this.activeName = 'authenticationInformation';
        virtualMemberAuthInfo('/musician/virtualMemberAuthInfo', {
          Id: this.$route.query.id
        }).then((res) => {
          if (res.code === 0) {
            if (res.data) {
              this.virtualMemberAuthInfo = res.data;
            }
            console.log(res.data);
          }
        });
      },
      getMemberData () {
        getMemberDetails('member/memberDetails', {
          id: this.$route.query.id,
          bandId: this.$route.query.bandId
        }).then(res => {
          if (res.code === 0) {
            this.memberInfo = res.data.memberInfo;
            this.songSheetInfo = res.data.songSheetInfo;
            this.musicList = res.data.musicList;
          }
        });

        if (parseInt(this.$route.query.virtu) === 1) {
          this._virtualMemberAuthInfo();
        }
        this._memberAuthenticationInfo({
          memberId: this.$route.query.id
        });
        if (this.$route.query.bandId) {
          getAscriptionBand('member/ascriptionBand', {
            id: this.$route.query.id,
            bandId: this.$route.query.bandId
          }).then(res => {
            if (res.code === 0) {
              this.bandInfo = res.data;
              this.bandMember = res.data.memberName;
            }
          });
        }
      },
      _memberAuthenticationInfo (params) {
        memberAuthenticationInfo('/musician/memberAuthenticationInfo', params).then(res => {
          if (res.code === ERR_OK) {
            console.log(res.data);
            this.memberInfoMusician = res.data.memberInfo;
            Object.keys(res.data.memberInfo).forEach(key => {
                this.memberInfoMusicianForm[key] = res.data.memberInfo[key];
            });
            this.authenticationRecords = res.data.authenticationRecords;
            if (this.$route.query.status) {
              // this.inFoStatus = '认证信息-音乐人';
            }
          }
        });
      },
      handleBanned () {
        this.$confirm('确认封禁该用户，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          prohibition('member/prohibition', {
            id: this.$route.query.id
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('封禁成功');
              this.getMemberData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      handleUnsealing () {
        this.$confirm('确认解禁该用户，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          unsealing('member/unsealing', {
            id: this.$route.query.id
          }).then(res => {
            if (res.code === 0) {
              this.$message.success('解禁成功');
              this.getMemberData();
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      uploadAvatar (option) {
        doUpload(option, 'image/avatar').then(res => {
          this.musiciansForm.picture = `${aliOssUrl}/${res.name}`;
        });
      },
      fnUploadRequests (option) {
        doUpload(option, 'image/band').then((res) => {
          this.memberInfoMusicianForm.picture = res.res.requestUrls[0].indexOf('?') > 0 ? `${res.res.requestUrls[0].substring(0, res.res.requestUrls[0].indexOf('?'))}` : `${res.res.requestUrls[0]}`;
        });
      },
      checkMemberInfo () {
        if (!this.memberInfoMusicianForm.realName) {
          this.$message.error('请添加你的姓名');
          return;
        } else if (!this.memberInfoMusicianForm.sex) {
          this.$message.error('请添加你的性别');
          return;
        } else if (!this.memberInfoMusicianForm.certifiedInstrument || this.memberInfoMusicianForm.certifiedInstrument.length > 10) {
          this.$message.error('擅长技能填写有误');
          return;
        } else if (!this.memberInfoMusicianForm.picture) {
          this.$message.error('请添加你的个人照片');
          return;
        }
        updateAuthenticationInfo('/musician/updateAuthenticationInfo', {
          realName: this.memberInfoMusicianForm.realName,
          sex: this.memberInfoMusicianForm.sex,
          certifiedInstrument: this.memberInfoMusicianForm.certifiedInstrument,
          picture: this.memberInfoMusicianForm.picture,
          Id: this.$route.query.id
        }).then((res) => {
          if (res.code === ERR_OK) {
            this.$message.success('修改成功');
            this.cacelcheckInfo();
            this.checkInfoStatus = false;
          }
        });
      },
      cacelcheckInfo () {
        this._memberAuthenticationInfo({
          memberId: this.$route.query.id
        });
        this.checkInfoStatus = false;
      },
      confirmCacelInfo () {
        cancelAuthentication('/musician/cancelAuthentication', {
          Id: this.$route.query.id
        }).then(res => {
          if (res.code === ERR_OK) {
            this.$message.success(res.msg);
            this.cacelInfo = false;
            this.$router.push({
              path: '/musicians/list'
            });
          }
        });
      },
      handleApprove () {
        this.$refs['musiciansForm'].validate((valid) => {
          if (valid) {
            memberAuthentication('musician/saveMusician', {
              memberId: this.$route.query.id,
              ...this.musiciansForm
            }).then(res => {
              if (res.code === 0) {
                this.$message.success('认证成功');
                this.getMemberData();
                this.isOrdinary = false;
              }
            });
          }
        });
      },
      handleMemberItem (id, bandId) {
        this.$router.push({
          name: 'UserDetail',
          query: {
            id: id,
            bandId: bandId
          }
        });
      },
      handleEditFans () {
        updateFansCount('member/updateFansCount', {
          id: this.$route.query.id,
          num: this.fansNumber
        }).then(res => {
          if (res.code === 0) {
            this.$message.success('修改成功！');
            this.getMemberData();
          }
        });
      },
      getUncertifiedMemberList () {
        uncertifiedMemberList('/musician/uncertifiedMemberList', {keyWord: this.keyWord, authenticatedState: 0}).then((res) => {
          if (res.code === ERR_OK) {
            this.connectUser = res.data;
          }
        });
      },
      getConnectId (row) {
        this.memberId = row.id;
        this.$confirm('用户昵称 和 音乐人姓名关联后，此关联关系不可修改，是否确认？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.confirmUserBand();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .headimg{
    border-radius: 100px;
  }
  .member-txt {
    padding-right: 20px;
    cursor: pointer;
    color: #409EFF;
  }
  .user-info {
    h3 {
      font-weight: 400;
      color: #1f2f3d;
    }
  }
  .avatar {
    width:200px;
    height: 200px;
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
      width: 200px;
      height: 200px;
      display: block;
    }
    .el-upload {
      width: 200px;
      height: 200px;
    }
  }
</style>

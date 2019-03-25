<template>
  <div class="comment-detail">
    <el-row class="title" v-if="commentsDetail.ascriptionType === 'music'">
      <el-col :span="24">音频名称：{{commentsDetail.ascriptionInfo.title}}</el-col>
    </el-row>
    <el-row class="title" v-if="commentsDetail.ascriptionType === 'video'">
      <el-col :span="24">视频名称：{{commentsDetail.ascriptionInfo.title}}</el-col>
    </el-row>
    <el-row class="title" v-if="commentsDetail.ascriptionType === 'performance'">
      <el-col :span="24">演出名称：{{commentsDetail.ascriptionInfo.title}}</el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col v-if="type === 'music'" :span="20">
        <audio :src="commentsDetail.ascriptionInfo.media_url" controls></audio>
        <p>文件路径：{{commentsDetail.ascriptionInfo.media_url}}</p>
        <p>播放时长：{{commentsDetail.ascriptionInfo.media_time}}</p>
        <p>文件数据：{{commentsDetail.ascriptionInfo.media_size}}</p>
      </el-col>
      <el-col v-if="type === 'video'" :span="20">
        <video width="500" height="300" style="background-color: #111111" :src="commentsDetail.ascriptionInfo.media_url" controls></video>
      </el-col>
      <el-col :span="14" v-if="commentsDetail.ascriptionInfo">
        <p >归属乐队： {{commentsDetail.ascriptionInfo.ascriptionName}}</p>
        <p v-if="type === 'music'">归属专辑： {{commentsDetail.ascriptionInfo.albumTitle}}</p>
        <p>点播: {{commentsDetail.ascriptionInfo.playCount}}</p>
        <p>点赞: {{commentsDetail.ascriptionInfo.likeCount}}</p>
        <p>
        <p>发布时间： {{commentsDetail.ascriptionInfo.submitTime}}</p>
        <p v-if="type === 'video'">文件路径：{{commentsDetail.ascriptionInfo.media_url}}</p>
        <p v-if="type === 'video'">播放时长：{{commentsDetail.ascriptionInfo.mediaTime}}</p>
        <p v-if="type === 'video'">文件数据：{{commentsDetail.ascriptionInfo.media_size}}</p>
      </el-col>
    </el-row>
    <hr />
    <el-row :gutter="20">
      <el-col :span="8">评论人：{{commentsDetail.commentatorName}}</el-col>
      <el-col :span="6">被收藏数：{{commentsDetail.commentatorLikeCount}}</el-col>
      <el-col :span="6">发布时间：{{commentsDetail.commentatorTime}}</el-col>
      <el-col :span="2">
        <el-button v-if="commentsDetail.commentatorState === 0" @click="shieldCommentInfo" type="danger">屏蔽该评论</el-button>
        <el-button v-if="commentsDetail.commentatorState === 1" @click="upshieldCommentInfo" type="danger">解除屏蔽</el-button>
      </el-col>
    </el-row>
    <div class="comments">
      <p>{{commentsDetail.commentatorContent}}</p>
    </div>
    <hr />
    <el-row :gutter="20" v-if="commentsDetail.replyId">
      <el-col :span="8">回复人：{{commentsDetail.replyName}}</el-col>
      <el-col :span="6">被收藏数：{{commentsDetail.replyLikeCount}}</el-col>
      <el-col :span="6">发布时间：{{rePlaytime}}</el-col>
      <el-col :span="2">
        <el-button v-if="commentsDetail.replyState === 0" @click="shieldReplyInfo" type="danger">屏蔽该回复</el-button>
        <el-button v-if="commentsDetail.replyState === 1" @click="upshieldReplyInfo" type="danger">解除屏蔽</el-button>
      </el-col>
    </el-row>
    <div class="comments" v-if="commentsDetail.replyId">
      <p>
        {{commentsDetail.replyContent}}
      </p>
    </div>
    <hr />
  </div>
</template>

<script>
  import {getCommentsDetail, shieldCommentInfo} from 'server/status';
  import moment from 'moment';
  export default {
    name: 'CommentDetail',
    data () {
      return {
        type: '',
        shieldComment: false,
        shieldReply: false,
        rePlaytime: '',
        commentsDetail: {}
      };
    },
    methods: {
      _getCommentsDetail () {
        getCommentsDetail('/commentInfo/commentInfoDetails', {
          id: this.$route.query.id
        }).then(res => {
          if (res.code === 0) {
            this.commentsDetail = res.data;
            this.rePlaytime = moment(this.commentsDetail.replyTime).format('YYYY-MM-DD HH:mm:ss');
            // moment(Date.now(this.commentsDetail.replyTime)).valueOf();
            this.type = this.commentsDetail.ascriptionType;
            console.log(this.commentsDetail);
          } else {
            this.$router.push({
              path: '/content/comments'
            });
          }
        });
      },
      _shieldCommentInfo (params = {}) {
        shieldCommentInfo('/commentInfo/shieldCommentInfo', params).then(res => {
          if (res.code === 0) {
            if (params.state === 0) {
              this.$message.success('解除成功');
            } else if (params.state === 1) {
              this.$message.error('封禁成功');
            }
            this._getCommentsDetail();
          }
        });
      },
      shieldCommentInfo () {
        this._shieldCommentInfo({
          id: this.commentsDetail.commentatorId,
          state: 1
        });
      },
      upshieldCommentInfo () {
        this._shieldCommentInfo({
          id: this.commentsDetail.commentatorId,
          state: 0
        });
      },
      shieldReplyInfo () {
        this._shieldCommentInfo({
          id: this.commentsDetail.replyId,
          state: 1
        });
      },
      upshieldReplyInfo () {
        this._shieldCommentInfo({
          id: this.commentsDetail.replyId,
          state: 0
        });
      }
    },
    created () {
      this._getCommentsDetail();
    }
  };
</script>

<style scoped>
.el-row {
  padding: 0 20px;
  box-sizing: border-box;
}
.title {
  height: 60px;
  line-height: 60px;
}
.comments {
  width: 100%;
  overflow: hidden;
  padding: 0 20px;
  text-indent: 2em;
}
</style>

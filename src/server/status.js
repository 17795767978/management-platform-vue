import api from './api';

// 视频发布并上架
export function subMitVideo (url, params) {
  return api.post(url, params);
}

// 视频去审核
export function goToCommit (url, params) {
  return api.post(url, params);
}

// 视频审核
export function commitStatus (url, params) {
  return api.post(url, params);
}

// 音频上下架
export function subMitAudio (url, params) {
  return api.post(url, params);
}

// 音频去审核
export function goToAudioCommit (url, params) {
  return api.post(url, params);
}

// 音频审核
export function getAudioCommit (url, params) {
  return api.post(url, params);
}

// 添加专辑
export function addAlbum (url, params) {
  return api.post(url, params);
}

// 操作记录
export function getlog (url, params) {
  return api.post(url, params);
}

// 获取专辑详情
export function getAlbumDetail (url, params) {
  return api.post(url, params);
}

// 音频移动专辑
export function moveAlbum (url, params) {
  return api.post(url, params);
}

// 编辑专辑-保存
export function signUpAblum (url, params) {
  return api.post(url, params);
}

// 编辑专辑点播
export function changePlayNum (url, params) {
  return api.post(url, params);
}

// 获取评论详情
export function getCommentsDetail (url, params) {
  return api.post(url, params);
}

// 屏蔽/解封评论
export function shieldCommentInfo (url, params) {
  return api.post(url, params);
}
// 添加父级标签
export function addTagType (url, params) {
  return api.post(url, params);
}
// 添加子级标签
export function addTagClassify (url, params) {
  return api.post(url, params);
}
// 刪除父类类型
export function deleteType (url, params) {
  return api.post(url, params);
}
// 修改子类标签
export function recheckTag (url, params) {
  return api.post(url, params);
}
// 刪除子类标签
export function deleteTag (url, params) {
  return api.post(url, params);
}
// 编辑乐队成员
export function editBandMember (url, params) {
  return api.post(url, params);
}
// 日程详情列表
export function scheduleDetail (url, params) {
  return api.post(url, params);
}
// 当天日程详情
export function scheduleDayDetail (url, params) {
  return api.post(url, params);
}
// 日程关联演出
export function relatedPerformances (url, params) {
  return api.post(url, params);
}
// 取消关联演出
export function delScheduleInfo (url, params) {
  return api.post(url, params);
}
// 通过乐队ID查询乐队专辑
export function bandAlbumList (url, params) {
  return api.post(url, params);
}
// 判断视频是否在首页展示
export function videoToHome (url, params) {
  return api.post(url, params);
}
// 判断音频是否在首页展示
export function audioToHome (url, params) {
  return api.post(url, params);
}
// 获取好乐专辑
export function getHoyoAlbum (url, params) {
  return api.post(url, params);
}
//  修改乐队粉丝数
export function recheckLikeNum (url, params) {
  return api.post(url, params);
}
// 好乐专辑音乐查询列表
export function HoyoAudio (url, params) {
  return api.post(url, params);
}

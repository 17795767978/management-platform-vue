import api from './api';

// 获取视频列表
export function getVideoList (url, params) {
  return api.post(url, params);
}

// 获取视频详情
export function getVideoDetail (url, params) {
  return api.post(url, params);
}

// 修改视频标签
export function changeVideoTag (url, params) {
  return api.post(url, params);
}

// 修改视频点播、点赞、 评论数
export function changeVideoNum (url, params) {
  return api.post(url, params);
}

// 获取音频列表
export function getAudioList (url, params) {
  return api.post(url, params);
}

// 添加音频
export function addAudio (url, params) {
  return api.post(url, params);
}

// 音频详情
export function getAudioDetail (url, params) {
  return api.post(url, params);
}

// 修改音频点播、点赞、评论
export function changeAudioNum (url, params) {
  return api.post(url, params);
}

// 获取专辑列表
export function getAlbumList (url, params) {
  return api.post(url, params);
}

// 获取视频标签
export function getBandTag (url, params) {
  return api.post(url, params);
}

// 获取评论列表
export function getCommentList (url, params) {
  return api.post(url, params);
}

// 获取乐队列表
export function getBandList (url, params) {
  return api.post(url, params);
}

// 获取乐手列表
export function getBandsmenList (url, params) {
  return api.post(url, params);
}

// 获取声联广告列表
export function getSoundTooAdList (url, params) {
  return api.post(url, params);
}

// 获取版权管理列表
export function getMediaCopyrightList (url, params) {
  return api.post(url, params);
}

// 获取用户、乐手详情
export function getMemberDetails (url, params) {
  return api.post(url, params);
}

// 用户/乐手停封
export function prohibition (url, params) {
  return api.post(url, params);
}

// 用户/乐手解封
export function unsealing (url, params) {
  return api.post(url, params);
}

// 用户认证为乐手
export function memberAuthentication (url, params) {
  return api.post(url, params);
}

// 删除声联广告
export function deleteSoundTooAd (url, params) {
  return api.post(url, params);
}

// 新建声联广告
export function addSoundTooAd (url, params) {
  return api.post(url, params);
}

// 声联广告详情
export function getSoundTooAdDetails (url, params) {
  return api.post(url, params);
}

// 编辑声联广告
export function updateSoundTooAd (url, params) {
  return api.post(url, params);
}

// 获取资源列表
export function getResourceList (url, params) {
  return api.post(url, params);
}

// 新建版权
export function createCopyright (url, params) {
  return api.post(url, params);
}

// 版权详情
export function getCopyrightDetails (url, params) {
  return api.post(url, params);
}

// 编辑版权
export function updateCopyright (url, params) {
  return api.post(url, params);
}

// 乐手-归属乐队
export function getAscriptionBand (url, params) {
  return api.post(url, params);
}

// 添加乐队
export function createBand (url, params) {
  return api.post(url, params);
}

// 查询演出信息分页
export function getPerformanceList (url, params) {
  return api.post(url, params);
}

// 获取标签列表
export function getTagList (url, params) {
  return api.post(url, params);
}

// 添加或更新演出信息
export function saveOrUpdatePerformanceInfo (url, params) {
  return api.post(url, params);
}

// 查询演出详情
export function getPerformanceInfo (url, params) {
  return api.post(url, params);
}

// 乐队详情
export function getBandDetails (url, params) {
  return api.post(url, params);
}

// 变更演出状态-上下架
export function changePerformState (url, params) {
  return api.post(url, params);
}

// 乐队成员列表
export function getBandMemberList (url, params) {
  return api.post(url, params);
}

// 编辑乐队队长
export function editCaptain (url, params) {
  return api.post(url, params);
}

// 编辑乐队队员
export function editMember (url, params) {
  return api.post(url, params);
}

// 设置乐队队长
export function setBandCaptain (url, params) {
  return api.post(url, params);
}

// 踢出乐队成员
export function removeMember (url, params) {
  return api.post(url, params);
}

// 修改粉丝数
export function updateFansCount (url, params) {
  return api.post(url, params);
}

// 乐队审核列表
export function getBandAuditList (url, params) {
  return api.post(url, params);
}

// 乐队审核列表
export function auditBandInfo (url, params) {
  return api.post(url, params);
}

// 乐队审核 申请人信息
export function applicantInfo (url, params) {
  return api.post(url, params);
}

// 乐队审核 审核记录
export function auditLogger (url, params) {
  return api.post(url, params);
}

// 乐队审核 乐队附属信息
export function subsidiaryInfo (url, params) {
  return api.post(url, params);
}

// 乐队审核 乐队附属信息
export function bandAudit (url, params) {
  return api.post(url, params);
}

// 查询虚拟音乐人认证信息
export function virtualMemberAuthInfo (url, params) {
  return api.post(url, params);
}

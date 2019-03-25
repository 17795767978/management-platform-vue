import api from './api';

// 查询音乐人详细信息(音乐人详情的基础信息及歌单信息)
export function memberDetails (url, params) {
  return api.post(url, params);
}

// 查询虚拟音乐人列表
export function virtualMusicianList (url, params) {
  return api.post(url, params);
}

// 取消音乐人认证
export function cancelAuthentication (url, params) {
  return api.post(url, params);
}

// 查询音乐人审核详情
export function auditMusicianInfo (url, params) {
  return api.post(url, params);
}

// 查询音乐人审核列表
export function auditMusicianList (url, params) {
  return api.post(url, params);
}

// 修改认证信息
export function updateAuthenticationInfo (url, params) {
  return api.post(url, params);
}

// 乐队信息查询（认证信息为队长时的乐队信息查询）
export function ascriptionBand (url, params) {
  return api.post(url, params);
}

// 查询音乐人认证信息(音乐人详情的认证信息)
export function memberAuthenticationInfo (url, params) {
  return api.post(url, params);
}

// 保存新音乐人
export function saveMusician (url, params) {
  return api.post(url, params);
}

// 未认证用户列表查询
export function uncertifiedMemberList (url, params) {
  return api.post(url, params);
}

// 音乐人列表查询
export function musicianList (url, params) {
  return api.post(url, params);
}

// 音乐人审核 （通过/驳回）
export function musicianAudit (url, params) {
  return api.post(url, params);
}

// 虚拟音乐人关联用户
export function virtualMusicianAssociate (url, params) {
  return api.post(url, params);
}

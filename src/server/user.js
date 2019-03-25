import api from './api';

export function loginByUsername (url, params) {
  return api.post(url, params);
}

export function getUserInfo (url, params) {
  return api.post(url, params);
}

export function getUploadId (url, params) {
  return api.post(url, params);
}

// 获取用户列表
export function getUserList (url, params) {
  return api.post(url, params);
}

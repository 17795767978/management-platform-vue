import api from './api';

// 查询广告列表
export function getAdvertisingList (url, params) {
  return api.post(url, params);
}

// 删除广告
export function removeAdvertising (url, params) {
  return api.post(url, params);
}

// 查询赛事分页
export function getCompetitionList (url, params) {
  return api.post(url, params);
}

// 删除赛事信息
export function removeCompetition (url, params) {
  return api.post(url, params);
}

// 添加或修改赛事信息
export function saveOrUpdateCompetition (url, params) {
  return api.post(url, params);
}

// 添加或修改广告信息
export function saveOrUpdateAdvert (url, params) {
  return api.post(url, params);
}

// 查询推荐赛事详情
export function getCompetitionDetail (url, params) {
  return api.post(url, params);
}

// 查询首页推荐音频列表
export function getHomeAudioList (url, params) {
  return api.post(url, params);
}

// 删除首页音视频推荐
export function removeHomeAudio (url, params) {
  return api.post(url, params);
}

// 音频排序
export function sortAudio (url, params) {
  return api.post(url, params);
}

// 添加首页音频推荐
export function addHomeAudio (url, params) {
  return api.post(url, params);
}

// 添加更多推荐音频组
export function addGroup (url, params) {
  return api.post(url, params);
}

// 查询更多推荐音频带分组
export function getMoreAudioList (url, params) {
  return api.post(url, params);
}

// 删除推荐组或推荐资源
export function removeGroup (url, params) {
  return api.post(url, params);
}

// 添加推荐音频
export function addRecommendAudio (url, params) {
  return api.post(url, params);
}

// 修改更多推荐音频排序
export function sortGroupAudio (url, params) {
  return api.post(url, params);
}

// 查询首页推荐视频列表
export function getHomeVideoList (url, params) {
  return api.post(url, params);
}

// 删除首页音视频推荐
export function removeHomeVideo (url, params) {
  return api.post(url, params);
}

// 添加推荐视频
export function addRecommendVideo (url, params) {
  return api.post(url, params);
}

// 修改首页推荐音视频排序
export function sortVideo (url, params) {
  return api.post(url, params);
}

// 查询首页推荐乐队列表
export function getHomeBandList (url, params) {
  return api.post(url, params);
}

// 添加首页推荐乐队
export function addHomeBand (url, params) {
  return api.post(url, params);
}

// 删除首页推荐乐队
export function removeHomeBand (url, params) {
  return api.post(url, params);
}

// 修改推荐乐队排序
export function sortBand (url, params) {
  return api.post(url, params);
}

// 变更广告状态
export function changeAdStatus (url, params) {
  return api.post(url, params);
}

// 广告排序
export function sortAd (url, params) {
  return api.post(url, params);
}

// 查询首页推荐专辑分页
export function getHomeAlubmList (url, params) {
  return api.post(url, params);
}

// 删除首页专辑推荐
export function removeHomeAlbum (url, params) {
  return api.post(url, params);
}

// 修改首页推荐专辑排序
export function sortAlbum (url, params) {
  return api.post(url, params);
}

// 查询好乐所属专辑分页
export function getAlbumForHoyo (url, params) {
  return api.post(url, params);
}

// 添加首页专辑推荐
export function addHomeAlbum (url, params) {
  return api.post(url, params);
}

import api from './api';

// 查询树结构数据-用于设置权限时初始化角色拥有权限树
export function queryPermission (url, params) {
  return api.post(url, params);
}

// 查询树结构数据-左侧菜单
export function getTreeMenuList (url, params) {
  return api.post(url, params);
}

// 查询系统日志分页
export function getLogList (url, params) {
  return api.post(url, params);
}

// 添加系统消息
export function addSysMsg (url, params) {
  return api.post(url, params);
}

// 查询系统消息详情
export function getSysMsgDetail (url, params) {
  return api.post(url, params);
}

// 查询系统消息分页
export function getSysMsgPage (url, params) {
  return api.post(url, params);
}

// 添加系统角色
export function addSysRole (url, params) {
  return api.post(url, params);
}

// 删除系统角色
export function deleteSysRole (url, params) {
  return api.post(url, params);
}

// 变更角色权限
export function updateSysRole (url, params) {
  return api.post(url, params);
}

// 查询系统角色列表
export function getRoleList (url, params) {
  return api.post(url, params);
}

// 添加系统管理员
export function addSysAdmin (url, params) {
  return api.post(url, params);
}

// 删除系统管理员
export function deleteSysAdmin (url, params) {
  return api.post(url, params);
}

// 查询系统管理员分页
export function getSysAdminList (url, params) {
  return api.post(url, params);
}

// 根据id获取系统管理员信息
export function getAdminInfoById (url, params) {
  return api.post(url, params);
}

// 变更管理员角色
export function updateSysAdminRole (url, params) {
  return api.post(url, params);
}

// 编辑系统管理员
export function editSysAdmin (url, params) {
  return api.post(url, params);
}

// 获取审批消息列表
export function auditMessage (url, params) {
  return api.post(url, params);
}

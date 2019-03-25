export function parseTime(time, cFormat) {
  if (!time) {
    return null;
  }
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return timeStr;
}

export function getOperationText(type) {
  const operationType = {
    '1': '添加',
    '2': '编辑',
    '3': '删除',
    '4': '审核',
    '5': '添加或修改'
  };
  return operationType[type.toString()];
}

export function getMsgTypeText(type) {
  const msgType = {
    '0': '系统消息'
  };
  return msgType[type];
}

export function getGeneralText(text) {
  const generalMap = {
    '0': '保密',
    '1': '男',
    '2': '女'
  };
  return generalMap[text];
}

export function getRedirTypeText(text) {
  const redirType = {
    '0': '个人主页',
    '1': '乐队主页',
    '2': '歌单页面',
    '3': '视频页面',
    '4': '活动页面'
  };
  return redirType[text];
}

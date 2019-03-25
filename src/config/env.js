let baseUrl = '/';
let aliOssUrl = 'http://hoyo.oss-cn-beijing.aliyuncs.com';
const ERR_OK = 0;

if (process.env.NODE_ENV === 'development') {
  baseUrl = '/';
  aliOssUrl = 'http://hoyo.oss-cn-beijing.aliyuncs.com';
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://sysapi.hoyo123.com/';
  aliOssUrl = 'http://hoyo.oss-cn-beijing.aliyuncs.com';
}

export {
  baseUrl,
  aliOssUrl,
  ERR_OK
};

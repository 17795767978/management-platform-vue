import OSS from 'ali-oss';
import {getUploadId} from 'server/user.js';
import { baseUrl } from '../config/env';

// 上传
export function doUpload (option, url, isMultipart = false) {
  let file = option.file;
  return new Promise((resolve, reject) => {
    getUploadId(`${baseUrl}oss/getToken`).then((res) => {
      const client = new OSS({
        region: 'oss-cn-beijing',
        endpoint: 'http://oss-cn-beijing.aliyuncs.com',
        accessKeyId: res.data.AccessKeyId,
        accessKeySecret: res.data.AccessKeySecret,
        stsToken: res.data.SecurityToken,
        bucket: res.data.bucketName
      });
      resolve(clientOk(file, client, option, url, isMultipart));
      reject();
    });
  });
}

async function clientOk (file, client, option, url, isMultipart) {
  let config = {};
  config['success_action_status'] = '200';
  if (!isMultipart) {
    config['progress'] = function (p, checkpoint) {
      if (option) {
        let e = {};
        e.percent = p * 100;
        option.onProgress(e);
      }
    };
  }
  let fileName = file.uid + file.name.substr(file.name.length - 4);
  let result = await client.multipartUpload(`test/${url}/${fileName}`, file, config);
  return result;
}

export function doUploadTwo (option, url, isMultipart = true) {
  let file = option;
  return new Promise((resolve, reject) => {
    getUploadId(`${baseUrl}oss/getToken`).then((res) => {
      const client = new OSS({
        region: 'oss-cn-beijing',
        endpoint: 'http://oss-cn-beijing.aliyuncs.com',
        accessKeyId: res.data.AccessKeyId,
        accessKeySecret: res.data.AccessKeySecret,
        stsToken: res.data.SecurityToken,
        bucket: res.data.bucketName
      });
      resolve(clientOkTwo(file, client, option, url, isMultipart));
      reject();
    });
  });
}

async function clientOkTwo (file, client, option, url, isMultipart) {
  let config = {};
  config['success_action_status'] = '200';
  if (isMultipart) {
    config['progress'] = function (p, checkpoint) {
      if (option) {
        console.log(option);
        let e = {};
        e.percent = p * 100;
        option.onProgress(e);
        console.log(e.percent);
      }
    };
  }
  let fileName = file.uid + file.name.substr(file.name.length - 4);
  let result = await client.multipartUpload(`test/${url}/${fileName}`, file, config);
  return result;
}

import axios from 'axios';
import store from '../store';
import { Message } from 'element-ui';
import { getToken } from '../utils/auth';
import { baseUrl } from '../config/env';
import qs from 'querystring';

axios.defaults.baseURL = baseUrl;
axios.defaults.headers = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
};
axios.defaults.timeout = 5000;

axios.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['access-token'] = getToken();
  }
  return config;
}, error => {
  Promise.reject(error);
});

axios.interceptors.response.use(response => {
  return response;
}, error => {
  Promise.resolve(error.response);
});

function checkStatus (response) {
  if (response.status === 200 || response.status === 304) {
    return response.data;
  }
  Message.error('服务器错误,错误状态码为:' + response.status);
  return {
    code: response.status,
    message: response.statusText,
    data: response.statusText
  };
}

function checkCode (response) {
  if (response.code !== 0) {
    Message.error(response.msg);
  }
  return response;
}

export default {
  get (url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params
      }).then(res => {
        resolve(res);
      });
    }).then(checkStatus).then(checkCode);
  },
  post (url, params) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: qs.stringify(params)
      }).then(res => {
        resolve(res);
      });
    }).then(checkStatus).then(checkCode);
  }
};

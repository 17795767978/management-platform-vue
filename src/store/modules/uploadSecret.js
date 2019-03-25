import {getUploadId} from 'server/user.js';
const uploadFile = {
  state: {
    uploadData: {}
  },
  mutations: {
    UPLOAD_DATA: (state, arr) => {
      state.uploadData = arr;
    }
  },
  actions: {
    async getUploadFile ({commit}) {
    //   return new Promise((resolve, reject) => {
    //     getUploadId ('http://192.168.0.133:8080/oss/getToken').then((res) => {
    //       commit('UPLOAD_DATA', res.data);
    //       resolve(res.data);
    //     })
    //   })
      const result = await getUploadId('http://192.168.0.126:8080/oss/getToken');
      commit('UPLOAD_DATA', result.data);
      return result.data;
    }
  }
};

export default uploadFile;

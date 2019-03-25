
import { auditMessage } from '../../server/sys';

const message = {
  state: {
    auditMessage: []
  },
  mutations: {
    SET_AUDIT_MESSAGE: (state, auditMessage) => {
      state.auditMessage = auditMessage;
    }

  },
  actions: {
    // 获取用户信息
    GetAuditMessage({commit, state}) {
      return new Promise((resolve, reject) => {
        auditMessage('message/auditMessage').then(res => {
          const data = res.data;
          commit('SET_AUDIT_MESSAGE', data);
          resolve(res);
        }).catch(error => {
          reject(error);
        });
      });
    }
  }
};

export default message;

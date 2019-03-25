import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import permission from './modules/permission';
import tagsView from './modules/tagsView';
import user from './modules/user';
import message from './modules/message';
import uploadFile from './modules/uploadSecret';
import getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user,
    uploadFile,
    message
  },
  getters
});

export default store;

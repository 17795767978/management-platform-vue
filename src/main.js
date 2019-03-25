// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import './permission';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'normalize.css/normalize.css';
import 'font-awesome/css/font-awesome.css';
import './assets/sass/index.scss';
import 'vue-event-calendar/dist/style.css';
import vueEventCalendar from 'vue-event-calendar';
import moment from 'moment';
import * as filters from './filter';

import ImgPlugin from './mixins/index.js';
Vue.use(new ImgPlugin(['AcousticAdvert', 'Advertising', 'Competition', 'PerformEntry', 'UserDetail', 'Band', '']));
Vue.use(Element, {
  size: 'medium'
});

Vue.use(vueEventCalendar, {
  locale: 'zh',
  weekStartOn: 1
});

moment.locale('zh-cn');

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  // components: { App },
  // template: '<App/>'
  render: h => h(App)
});

import router from './router';
import store from './store';
import {Message} from 'element-ui';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {getToken} from './utils/auth';

NProgress.configure({showSpinner: false});

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (getToken()) {
    store.dispatch('GetAuditMessage');
    if (store.getters.roles.length === 0) {
      store.dispatch('GetUserInfo').then(res => {
        const roles = res.data.perms;
        store.dispatch('GenerateRoutes', {roles}).then(() => {
          router.addRoutes(store.getters.addRouters);
          next({...to, replace: true});
        });
      }).catch((err) => {
        store.dispatch('FedLogOut').then(() => {
          Message.error(err || '验证失败，请重新登录');
          next({path: '/'});
        });
      });
    } else {
      next();
    }
  } else {
    if (to.path === '/login') {
      next();
    } else {
      next('/login');
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

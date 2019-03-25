import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const login = r => require.ensure([], () => r(require('../views/login/Login')), 'login');
const page401 = r => require.ensure([], () => r(require('../views/errorPage/401')), 'page401');
const page404 = r => require.ensure([], () => r(require('../views/errorPage/404')), 'page404');
const layout = r => require.ensure([], () => r(require('../views/layout/Layout')), 'layout');
const dashboard = r => require.ensure([], () => r(require('../views/dashboard/Dashboard')), 'dashboard');
const contentVideo = r => require.ensure([], () => r(require('../views/content/video/')), 'contentVideo');
const addVideo = r => require.ensure([], () => r(require('../views/content/video/AddVideo')), 'addVideo');
const videoDetail = r => require.ensure([], () => r(require('../views/content/video/VideoDetail')), 'videoDetail');
const contentAudio = r => require.ensure([], () => r(require('../views/content/audio/')), 'contentAudio');
const addAudio = r => require.ensure([], () => r(require('../views/content/audio/AddAudio')), 'addAudio');
const audioDetail = r => require.ensure([], () => r(require('../views/content/audio/audioDetail')), 'audioDetail');
const contentAlbum = r => require.ensure([], () => r(require('../views/content/album/')), 'contentAlbum');
const addAlbum = r => require.ensure([], () => r(require('../views/content/album/addAlbum')), 'addAlbum');
const albumDetail = r => require.ensure([], () => r(require('../views/content/album/albumDetail')), 'albumDetail');
const contentComments = r => require.ensure([], () => r(require('../views/content/comments/')), 'contentComments');
const commentsDetail = r => require.ensure([], () => r(require('../views/content/comments/commentsDetail')), 'commentsDetail');
const contentTag = r => require.ensure([], () => r(require('../views/content/tag/')), 'contentTag');
const userList = r => require.ensure([], () => r(require('../views/user/')), 'userList');
const userDetail = r => require.ensure([], () => r(require('../views/user/Detail')), 'userDetail');
const bandList = r => require.ensure([], () => r(require('../views/band/')), 'bandList');
const bandDetail = r => require.ensure([], () => r(require('../views/band/bandDetail')), 'bandDetail');
const bandAuditing = r => require.ensure([], () => r(require('../views/band/bandAuditing')), 'bandAuditing');
const bandAuditingDetail = r => require.ensure([], () => r(require('../views/band/bandAuditingDetail')), 'bandAuditingDetail');
const musicicansList = r => require.ensure([], () => r(require('../views/musicians/')), 'musicicansList');
const musiciansExamine = r => require.ensure([], () => r(require('../views/musicians/musiciansExamine')), 'musiciansExamine');
const musicianDetail = r => require.ensure([], () => r(require('../views/musicians/musicianDetail')), 'musicianDetail');
const acousticAdvert = r => require.ensure([], () => r(require('../views/acoustic/advert/')), 'acousticAdvert');
const acousticCopyright = r => require.ensure([], () => r(require('../views/acoustic/copyright/')), 'acousticCopyright');
const homeAdvertising = r => require.ensure([], () => r(require('../views/home/advertising/')), 'homeAdvertising');
const homeCompetition = r => require.ensure([], () => r(require('../views/home/competition/')), 'homeCompetition');
const homeAudio = r => require.ensure([], () => r(require('../views/home/audio/')), 'homeAudio');
const homeVideo = r => require.ensure([], () => r(require('../views/home/video/')), 'homeVideo');
const homeBand = r => require.ensure([], () => r(require('../views/home/band/')), 'homeBand');
const homeAlbum = r => require.ensure([], () => r(require('../views/home/album/')), 'homeAlbum');
const operateRecord = r => require.ensure([], () => r(require('../views/operate/record/')), 'operateRecord');
const operateReport = r => require.ensure([], () => r(require('../views/operate/report/')), 'operateReport');
const operatePush = r => require.ensure([], () => r(require('../views/operate/push/')), 'operatePush');
const performList = r => require.ensure([], () => r(require('../views/perform/')), 'performList');
const performEntry = r => require.ensure([], () => r(require('../views/perform/Entry')), 'performEntry');
const performDetail = r => require.ensure([], () => r(require('../views/perform/Detail')), 'performDetail');
const adminList = r => require.ensure([], () => r(require('../views/permissions/admin/')), 'adminList');
const role = r => require.ensure([], () => r(require('../views/permissions/role/')), 'role');

export const constantRouterMap = [
  {
    path: '/login',
    component: login,
    hidden: true
  },
  {
    path: '/401',
    component: page401,
    hidden: true
  },
  {
    path: '/404',
    component: page404,
    hidden: true
  },
  {
    path: '',
    component: layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: dashboard,
        name: 'dashboard',
        meta: {
          title: '好乐首页',
          icon: 'fa fa-home',
          noCache: true
        }
      }
    ]
  }
];

export default new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
});

export const asyncRouterMap = [
  {
    path: '/content',
    component: layout,
    redirect: 'noredirect',
    name: 'content',
    meta: {
      title: '内容管理',
      icon: 'fa fa-clone',
      roles: ['/content/video', '/content/music', '/content/album', '/comment', '/tag']
    },
    children: [
      {
        path: 'video',
        component: contentVideo,
        name: 'contentVideo',
        meta: {
          title: '视频管理',
          roles: ['/content/video']
        }
      },
      {
        path: 'add-video',
        component: addVideo,
        name: 'addVideo',
        hidden: true,
        meta: {
          title: '添加视频',
          roles: ['/content/video']
        }
      },
      {
        path: 'video-detail',
        component: videoDetail,
        name: 'videoDetail',
        hidden: true,
        meta: {
          title: '视频详情',
          roles: ['/content/video']
        }
      },
      {
        path: 'audio',
        component: contentAudio,
        name: 'contentAudio',
        meta: {
          title: '音频管理',
          roles: ['/content/music']
        }
      },
      {
        path: 'add-audio',
        component: addAudio,
        name: 'addAudio',
        hidden: true,
        meta: {
          title: '添加音频',
          roles: ['/content/music']
        }
      },
      {
        path: 'audio-detail',
        component: audioDetail,
        name: 'audioDetail',
        hidden: true,
        meta: {
          title: '音频详情',
          roles: ['/content/music']
        }
      },
      {
        path: 'album',
        component: contentAlbum,
        name: 'contentAlbum',
        meta: {
          title: '专辑管理',
          roles: ['/content/album']
        }
      },
      {
        path: 'add-album',
        component: addAlbum,
        name: 'addAlbum',
        hidden: true,
        meta: {
          title: '添加专辑',
          roles: ['/content/album']
        }
      },
      {
        path: 'album-detail',
        component: albumDetail,
        name: 'albumDetail',
        hidden: true,
        meta: {
          title: '专辑详情',
          roles: ['/content/album']
        }
      },
      {
        path: 'comments',
        component: contentComments,
        name: 'contentComments',
        meta: {
          title: '评论管理',
          roles: ['/comment']
        }
      },
      {
        path: 'comments-detail',
        component: commentsDetail,
        name: 'CommentsDetail',
        hidden: true,
        meta: {
          title: '评论详情',
          roles: ['/comment']
        }
      },
      {
        path: 'tag',
        component: contentTag,
        name: 'contentTag',
        meta: {
          title: '标签管理',
          roles: ['/tag']
        }
      }
    ]
  },
  {
    path: '/user',
    component: layout,
    redirect: 'noredirect',
    name: 'user',
    alwaysShow: true,
    meta: {
      title: '用户管理',
      icon: 'fa fa-user-o',
      roles: ['/member/list']
    },
    children: [
      {
        path: 'list',
        component: userList,
        name: 'userList',
        meta: {
          title: '用户列表',
          roles: ['/member/list']
        }
      },
      {
        path: 'detail',
        component: userDetail,
        name: 'UserDetail',
        hidden: true,
        meta: {
          title: '用户详情',
          roles: ['/member/list']
        }
      }
    ]
  },
  {
    path: '/band',
    component: layout,
    redirect: 'noredirect',
    name: 'band',
    alwaysShow: true,
    meta: {
      title: '乐队管理',
      icon: 'fa fa-shield',
      roles: ['/band/list']
    },
    children: [
      {
        path: 'list',
        component: bandList,
        name: 'bandList',
        meta: {
          title: '乐队列表',
          roles: ['/band/list']
        }
      },
      {
        path: 'band-detail',
        component: bandDetail,
        name: 'BandDetail',
        hidden: true,
        meta: {
          title: '乐队详情',
          roles: ['/band/list']
        }
      },
      {
        path: 'band-auditing',
        component: bandAuditing,
        name: 'bandAuditing',
        meta: {
          title: '乐队审核',
          roles: ['/band/list']
        }
      },
      {
        path: 'band-auditing-detail',
        component: bandAuditingDetail,
        name: 'bandAuditingDetail',
        hidden: true,
        meta: {
          title: '审核详情',
          roles: ['/band/list']
        }
      }
    ]
  },
  {
    path: '/musicians',
    component: layout,
    redirect: 'noredirect',
    name: 'musicians',
    alwaysShow: true,
    meta: {
      title: '音乐人管理',
      icon: 'fa fa-music',
      roles: ['/bandsman/list']
    },
    children: [
      {
        path: 'examine',
        component: musiciansExamine,
        name: 'musiciansExamine',
        meta: {
          title: '音乐人审核',
          roles: ['/bandsman/list']
        }
      },
      {
        path: 'list',
        component: musicicansList,
        name: 'musicicansList',
        meta: {
          title: '音乐人列表',
          roles: ['/bandsman/list']
        }
      },
      {
        path: 'detail',
        component: musicianDetail,
        name: 'musicianDetail',
        hidden: true,
        meta: {
          title: '音乐人详情',
          roles: ['/bandsman/list']
        }
      }
    ]
  },
  {
    path: '/acoustic',
    component: layout,
    redirect: 'noredirect',
    name: 'acoustic',
    meta: {
      title: '声联管理',
      icon: 'fa fa-joomla',
      roles: ['/soundtoo/advertisement', '/soundtoo/copyright']
    },
    children: [
      {
        path: 'advert',
        component: acousticAdvert,
        name: 'acousticAdvert',
        meta: {
          title: '声联广告',
          roles: ['/soundtoo/advertisement']
        }
      },
      {
        path: 'copyright',
        component: acousticCopyright,
        name: 'acousticCopyright',
        meta: {
          title: '版权管理',
          roles: ['/soundtoo/copyright']
        }
      }
    ]
  },
  {
    path: '/perform',
    component: layout,
    redirect: 'noredirect',
    name: 'perform',
    alwaysShow: true,
    meta: {
      title: '演出管理',
      icon: 'fa fa-superpowers',
      roles: ['/performance/list']
    },
    children: [
      {
        path: 'list',
        component: performList,
        name: 'performList',
        meta: {
          title: '演出列表',
          roles: ['/performance/list']
        }
      },
      {
        path: 'entry',
        component: performEntry,
        name: 'performEntry',
        hidden: true,
        meta: {
          title: '新建/编辑演出',
          roles: ['/performance/list']
        }
      },
      {
        path: 'detail',
        component: performDetail,
        name: 'performDetail',
        hidden: true,
        meta: {
          title: '演出详情',
          roles: ['/performance/list']
        }
      }
    ]
  },
  {
    path: '/home',
    component: layout,
    redirect: 'noredirect',
    name: 'home',
    meta: {
      title: '首页管理',
      icon: 'fa fa-window-maximize',
      roles: ['/home/advertisement', '/home/match', '/home/music', '/home/video', '/home/band']
    },
    children: [
      {
        path: 'adverting',
        component: homeAdvertising,
        name: 'homeAdvertising',
        meta: {
          title: '广告管理',
          roles: ['/home/advertisement']
        }
      },
      {
        path: 'competition',
        component: homeCompetition,
        name: 'homeCompetition',
        meta: {
          title: '赛事入口',
          roles: ['/home/match']
        }
      },
      {
        path: 'audio',
        component: homeAudio,
        name: 'homeAudio',
        meta: {
          title: '推荐音频',
          roles: ['/home/music']
        }
      },
      {
        path: 'video',
        component: homeVideo,
        name: 'homeVideo',
        meta: {
          title: '推荐视频',
          roles: ['/home/video']
        }
      },
      {
        path: 'band',
        component: homeBand,
        name: 'homeBand',
        meta: {
          title: '推荐乐队',
          roles: ['/home/band']
        }
      },
      {
        path: 'album',
        component: homeAlbum,
        name: 'homeAlbum',
        meta: {
          title: '推荐专辑',
          roles: ['/home/band']
        }
      }
    ]
  },
  {
    path: '/operate',
    component: layout,
    redirect: 'noredirect',
    name: 'operate',
    meta: {
      title: '运营管理',
      icon: 'fa fa-archive',
      roles: ['/operations/logs', '/operations/report', '/operations/push']
    },
    children: [
      {
        path: 'record',
        component: operateRecord,
        name: 'operateRecord',
        meta: {
          title: '操作记录',
          roles: ['/operations/logs']
        }
      },
      {
        path: 'report',
        component: operateReport,
        name: 'operateReport',
        meta: {
          title: '举报管理',
          roles: ['/operations/report']
        }
      },
      {
        path: 'push',
        component: operatePush,
        name: 'operatePush',
        meta: {
          title: '系统推送',
          roles: ['/operations/push']
        }
      }
    ]
  },
  {
    path: '/permissions',
    component: layout,
    redirect: 'noredirect',
    name: 'permissions',
    meta: {
      title: '权限管理',
      icon: 'fa fa-certificate',
      roles: ['/sys/admin', '/sys/role']
    },
    children: [
      {
        path: 'admin',
        component: adminList,
        name: 'admin',
        meta: {
          title: '管理员列表',
          roles: ['/sys/admin']
        }
      },
      {
        path: 'role',
        component: role,
        name: 'role',
        meta: {
          title: '角色管理',
          roles: ['/sys/role']
        }
      }
    ]
  }
];

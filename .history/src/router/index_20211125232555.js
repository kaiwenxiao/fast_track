import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home/Index';
import SignUp from '@/views/SignUp/Index';
import ResetPwd from '@/views/ResetPwd/Index';
import Account from '@/views/Account/Index/Index';
import metas from '@/utils/metas';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    meta: { key: 'home' },
    component: Home,
  },
  {
    path: '/airportt',
    name: 'child',
    component: () => {
      return import(/* webpackChunkName: 'child' */ '@/views/Home/child');
    },
  },
  {
    path: '/airport',
    name: 'Airport',
    component: () => {
      return import(/* webpackChunkName: 'airport' */ '@/views/Airport/Index');
    },
  },
  {
    path: '/bookingdetails',
    name: 'BookingDetails',
    meta: {
      requireAuth: true,
      requireProgramAuth: true,
    },
    component: () => {
      return import(/* webpackChunkName: 'bookingdetails' */ '@/views/Booking/BookingDetails');
    },
  },
  {
    path: '/personaldetails',
    name: 'PersonalDetails',
    meta: {
      requireAuth: true,
      requireProgramAuth: true,
    },
    component: () => {
      return import(/* webpackChunkName: 'personaldetails' */ '@/views/Booking/PersonalDetails');
    },
  },
  {
    path: '/reviewbooking',
    name: 'ReviewBooking',
    meta: {
      requireAuth: true,
      requireProgramAuth: true,
    },
    component: () => {
      return import(/* webpackChunkName: 'reviewbooking' */ '@/views/Booking/ReviewBooking');
    },
  },
  {
    path: '/paymentdetails',
    name: 'PaymentDetails',
    meta: {
      requireAuth: true,
      requireProgramAuth: true,
    },
    component: () => {
      return import(/* webpackChunkName: 'paymentdetails' */ '@/views/Booking/PaymentDetails');
    },
  },
  {
    path: '/bookingsuccess',
    name: 'BookingSuccess',
    component: () => {
      return import(/* webpackChunkName: 'booking-succ' */ '@/views/Booking/BookingSuccess');
    },
  },
  {
    path: '/bookingloading',
    name: 'BookingLoading',
    component: () => {
      return import(/* webpackChunkName: 'booking-succ' */ '@/views/Booking/BookingLoading');
    },
  },
  {
    path: '/payFailed',
    name: 'PayFailed',
    component: () => {
      return import(/* webpackChunkName: 'pay-fail' */ '@/views/Booking/PayFailed');
    },
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp,
    redirect: '/sign-up/step-1',
    children: [
      {
        path: 'step-1',
        name: 'sign-up-step-1',
        meta: { key: 'signup' },
        component: () => {
          return import(/* webpackChunkName: 'sign-up-step-1' */ '@/views/SignUp/Step-1');
        },
      },
      {
        path: 'step-2',
        name: 'sign-up-step-2',
        meta: { key: 'signup' },
        component: () => {
          return import(/* webpackChunkName: 'sign-up-step-2' */ '@/views/SignUp/Step-2');
        },
      },
      {
        path: 'succ',
        name: 'sign-up-succ',
        meta: { key: 'signup' },
        component: () => {
          return import(/* webpackChunkName: 'sign-up-succ' */ '@/views/SignUp/Succ');
        },
      },
      {
        path: 'fail',
        name: 'sign-up-fail',
        meta: { key: 'signup' },
        component: () => {
          return import(/* webpackChunkName: 'sign-up-fail' */ '@/views/SignUp/Fail');
        },
      },
    ],
  },
  {
    path: '/reset-pwd',
    name: 'ResetPwd',
    component: ResetPwd,
    redirect: '/reset-pwd/step-1',
    children: [
      {
        path: 'step-1',
        name: 'reset-pwd-step-1',
        component: () => {
          return import(/* webpackChunkName: 'reset-pwd-step-1' */ '@/views/ResetPwd/Step-1');
        },
      },
      {
        path: 'step-2',
        name: 'reset-pwd-step-2',
        component: () => {
          return import(/* webpackChunkName: 'reset-pwd-step-2' */ '@/views/ResetPwd/Step-2');
        },
      },
      {
        path: 'step-3',
        name: 'reset-pwd-step-3',
        component: () => {
          return import(/* webpackChunkName: 'reset-pwd-step-3' */ '@/views/ResetPwd/Step-3');
        },
      },
      {
        path: 'error',
        name: 'error',
        component: () => {
          return import(/* webpackChunkName: 'reset-pwd-code-error' */ '@/views/ResetPwd/Error');
        },
      },
      {
        path: 'succ',
        name: 'reset-pwd-succ',
        component: () => {
          return import(/* webpackChunkName: 'reset-pwd-succ' */ '@/views/ResetPwd/Succ');
        },
      },
      {
        path: 'timeOut',
        name: 'reset-pwd-time-out',
        component: () => {
          return import(/* webpackChunkName: 'reset-pwd-time-out' */ '@/views/ResetPwd/Timeout');
        },
      },
    ],
  },
  {
    path: '/page-timeout',
    name: 'PageTimeOut',
    component: () => {
      return import(/* webpackChunkName: 'page-timeout' */ '@/views/PageTimeOut/Index');
    },
  },
  {
    path: '/account',
    name: 'Account',
    component: Account,
    redirect: '/account/overview',
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => {
          return import(
              /* webpackChunkName: 'account-overview' */ '@/views/Account/Overview/Index'
          );
        },
      },
      {
        path: 'update-card',
        name: 'updateCard',
        component: () => {
          return import(
              /* webpackChunkName: 'account-updateCard' */ '@/views/Account/UpdateCard/Index'
          );
        },
      },
      {
        path: 'all-card',
        name: 'allCard',
        component: () => {
          return import(
              /* webpackChunkName: 'account-allCard' */ '@/views/Account/AllCard/Index'
          );
        },
      },
      {
        path: 'add-card',
        name: 'addCard',
        component: () => {
          return import(
              /* webpackChunkName: 'account-addCard' */ '@/views/Account/AddCard/Index'
          );
        },
      },
      {
        path: 'entitlement',
        name: 'entitlement',
        component: () => {
          return import(
              /* webpackChunkName: 'account-entitlement' */ '@/views/Account/Entitlement/Index'
          );
        },
      },
      {
        path: 'bookings',
        name: 'bookings',
        component: () => {
          return import(
              /* webpackChunkName: 'account-bookings' */ '@/views/Account/Bookings/Index'
          );
        },
      },
      {
        path: 'bookingDetails',
        name: 'bookingDetails',
        component: () => {
          return import(
              /* webpackChunkName: 'account-bookings' */ '@/views/Account/BookingDetails/Index'
          );
        },
      },
      {
        path: 'changePassword',
        name: 'changePassword',
        component: () => {
          return import(
              /* webpackChunkName: 'account-changePassword' */ '@/views/Account/ChangePassword/Index'
          );
        },
      },
    ],
  },
  {
    path: '/termsconditions',
    name: 'TermsConditions',
    meta: { key: 'term-and-condition' },
    component: () => {
      return import(
          /* webpackChunkName: 'terms-and-conditions' */ '@/views/More/TermsConditions'
      );
    },
  },
  {
    path: '/termsuse',
    name: 'TermsUse',
    meta: { key: 'terms-of-use' },
    component: () => {
      return import(/* webpackChunkName: 'terms-and-use' */ '@/views/More/TermsUse');
    },
  },
  {
    path: '/privacypolicy',
    name: 'PrivacyPolicy',
    meta: { key: 'privacy-policy' },
    component: () => {
      return import(/* webpackChunkName: 'privacy-policy' */ '@/views/More/PrivacyPolicy');
    },
  },
  {
    path: '/helptopics',
    name: 'HelpTopics',
    component: {
      render: c => c('router-view'), // eslint-disable-line
    },
    redirect: '/helptopics/index',
    children: [
      {
        path: 'index',
        name: 'help-topics-index',
        meta: { key: 'help-topics' },
        component: () => {
          return import(
              /* webpackChunkName: 'help-topics-index' */ '@/views/More/HelpTopics/Index'
          );
        },
      },
      {
        path: 'second',
        name: 'help-topics-second',
        meta: { key: 'help-topics' },
        component: () => {
          return import(
              /* webpackChunkName: 'help-topics-second' */ '@/views/More/HelpTopics/Second'
          );
        },
      },
      {
        path: 'third',
        name: 'help-topics-third',
        meta: { key: 'help-topics' },
        component: () => {
          return import(
              /* webpackChunkName: 'help-topics-third' */ '@/views/More/HelpTopics/Third'
          );
        },
      },
      {
        path: 'getInTouch',
        name: 'help-topics-get-in-touch',
        meta: { key: 'help-topics' },
        component: () => {
          return import(
              /* webpackChunkName: 'help-topics-get-in-touch' */ '@/views/More/HelpTopics/GetInTouch'
          );
        },
      },
    ],
  },
  {
    path: '/server-error',
    name: 'ServerError',
    component: () => {
      return import(/* webpackChunkName: 'server-error' */ '@/views/ServerError/Index');
    },
  },
],
  router = new VueRouter({
    mode: 'history',
    // base: process.env.BASE_URL,
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      return {
        x: 0,
        y: 0,
      };
    },
  });


const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => {
    return err;
  });
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => {
    return err;
  });
};

// 解决Loading chunk (\d)+ failed问题
router.onError(error => {
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed = error.message.match(pattern);
  const targetPath = router.history.pending.fullPath;
  if (isChunkLoadFailed) {
    // location.reload();
    router.replace(targetPath);
  }
});

router.beforeEach((to, from, next) => {
  const lang = localStorage.getItem('lang') || 'en-US';
  document.title =
    (to.meta.key && metas[lang][to.meta.key].title) || 'Mastercard Travel Experiences';
  document
    .querySelector('meta[name="keywords"]')
    .setAttribute(
      'content',
      (to.meta.key && metas[lang][to.meta.key].keywords) ||
      'Mastercard Travel Experiences, security, lane, airport, fast track, service, checkpoint, terminal, dragonpass'
    );
  document
    .querySelector('meta[name="description"]')
    .setAttribute(
      'content',
      (to.meta.key && metas[lang][to.meta.key].description) ||
      'Mastercard Travel Experiences allows travellers to book airport Fast Track Security Lanes in app or through our website. Maximise your time at the airport.'
    );
  next();
});

export default router;

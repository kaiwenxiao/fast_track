// import i18n from '../i18n';
/* eslint-disable */
const accountTab = [
    {
      // label: i18n.t('account.tab-overview'),
      key: 'account.tab-overview',
      path: 'overview',
      showInMobile: true,
      icon: require('../assets/images/icon-overview@2x.png'),
      iconActived: require('../assets/images/icon-overview-white@2x.png'),
    },
    {
      // label: i18n.t('account.tab-entitlement'),
      key: 'account.tab-entitlement',
      path: 'entitlement',
      showInMobile: true,
      icon: require('../assets/images/icon-entitlement@2x.png'),
      iconActived: require('../assets/images/icon-entitlement-white@2x.png'),
    },
    {
      // label: i18n.t('account.tab-bookings'),
      key: 'account.tab-bookings',
      path: 'bookings',
      showInMobile: true,
      icon: require('../assets/images/icon-bookings@2x.png'),
      iconActived: require('../assets/images/icon-bookings-white@2x.png'),
    },
    {
      // label: i18n.t('account.tab-changePassword'),
      key: 'account.tab-changePassword',
      path: 'changePassword',
      showInMobile: false,
      icon: require('../assets/images/icon-password@2x.png'),
      iconActived: require('../assets/images/icon-password-white@2x.png'),
    },
    {
      // label: i18n.t('account.tab-logout'),
      key: 'account.tab-logout',
      path: 'logout',
      showInMobile: false,
      icon: require('../assets/images/icon-logout@2x.png'),
    },
  ],
  pwdRules = [
    {
      matched: false,
      regExp: /^.{8,}/,
      key: 'signup.pwd-rules-1',
      // desc: i18n.t('signup.pwd-rules-1'),
    },
    {
      matched: false,
      regExp: /[a-z]/,
      key: 'signup.pwd-rules-2',
      // desc: i18n.t('signup.pwd-rules-2'),
    },
    {
      matched: false,
      regExp: /[A-Z]/,
      key: 'signup.pwd-rules-3',
      // desc: i18n.t('signup.pwd-rules-3'),
    },
    {
      matched: false,
      regExp: /\d/,
      key: 'signup.pwd-rules-4',
      // desc: i18n.t('signup.pwd-rules-4'),
    },
    {
      matched: false,
      regExp: /\W/,
      key: 'signup.pwd-rules-5',
      // desc: i18n.t('signup.pwd-rules-5'),
    },
  ],
  bookingsTab = [
    {
      // label: i18n.t('account.upcoming-trips'),
      value: 'upcoming',
      key: 'account.upcoming-trips',
    },
    {
      // label: i18n.t('account.past-trips'),
      value: 'past',
      key: 'account.past-trips',
    },
    {
      // label: i18n.t('account.cancelled-trips'),
      value: 'cancelled',
      key: 'account.cancelled-trips',
    },
  ],
  emailReg =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  cardStatusConfig = {
    inuse: 'account.in-use',
    not_inuse: 'account.not-in-use',
    cancelled: 'account.cancelled',
  };

export { accountTab, pwdRules, bookingsTab, emailReg, cardStatusConfig };

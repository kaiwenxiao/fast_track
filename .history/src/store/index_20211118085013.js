import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: JSON.parse(sessionStorage.getItem('isLogin')) || false,
    loginDefaultAccount: '',
    userInfo: JSON.parse(sessionStorage.getItem('userInfo')) || null,
    selectAirport: JSON.parse(sessionStorage.getItem('selectAirport')) || null,
    longitude: sessionStorage.getItem('longitude') || null,
    latitude: sessionStorage.getItem('latitude') || null,
    backRouteAfterLogin: '/',
    userToken: sessionStorage.getItem('token') || null,
    showPolanEquityChangePopup: false,
    polanEquityChangeType: 0,
    languageOpts: [],
    localeInit: false,
    lang: localStorage.getItem('lang') || null
  },
  mutations: {
    setState(state, payload) {
      state[payload.state] = payload.values;
    },

    setSelectAirport(state, payload) {
      state.selectAirport = payload;
    },

    setLongitude(state, payload) {
      state.longitude = payload;
    },

    setLatitude(state, payload) {
      state.latitude = payload;
    },

    changeIsLogin(state, payload) {
      state.isLogin = payload;
    },
  },
  actions: {},
  modules: {},
});

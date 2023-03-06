<template>
    <div id="app">
        <div class="wrapper">
            <div class="page_main">
                <div class="app-banner-wrapper" v-if="showPromotingApp && !closePromotingApp">
                    <div class="app-banner">
                        <div class="app-banner-close" @click="handleClosePromotingApp"></div>
                        <img class="app-icon" src="~img/app-icon@2x.png" alt="" />
                        <div class="app-name">{{ $t('components.open-app-name') }}</div>
                        <div class="btn-open-app" @click="handleOpenApp">{{ $t('components.btn-open') }}</div>
                    </div>
                </div>
                <PageHeader :scrollFlag="scrollFlag" v-if="type === 'web'" />
                <div :style="{ paddingTop: scrollFlag ? '80px' : 0 }">
                    <router-view :style="{ minHeight: minHeight, boxSizing: 'border-box' }" />
                </div>
                <PageFooter v-if="type === 'web'" />
                <SessionTimeOut v-if="showSessionTimeOut && showTimeOut" @close="handleCloseSessionPopup" />
                <van-popup round v-model="showPopup">
                    <div class="app-popup can-not-enter-booking">
                        <div class="desc">{{ $t('error.card-no-eligible') }}</div>
                        <div class="app-popup-btn btn-close" @click="showPopup = false">
                            {{ $t('basic.btn-close') }}
                        </div>
                    </div>
                </van-popup>

                <!-- Polan大客户权益等级更新popup -->
                <van-popup round v-model="showPolanEquityChangePopup">
                    <div class="app-popup poland-equity-change">
                        <div class="desc">{{ polanEquityChangeMsg }}</div>
                        <div class="app-popup-btn btn-go-page-account" @click="polandView">
                            {{ $t('basic.btn-view-now') }}
                        </div>
                    </div>
                </van-popup>
            </div>
        </div>
    </div>
</template>
<script>
/* eslint-disable */
import PageHeader from '@/components/PageHeader/Index';
import PageFooter from '@/components/PageFooter/Index';
import SessionTimeOut from '@/components/SessionTimeOut/Index';
import { Popup } from 'vant';
import { getQueryString, openApp } from '@/utils';
import { mapState, mapMutations } from 'vuex';

export default {
    data() {
        return {
            minHeight: 0,
            type: null,
            timer: null,
            scrollFlag: false,
            closePromotingApp: false,
            showSessionTimeOut: false,
            sessionTimer: null,
            showTimeOut: false,
            showPopup: false,
        };
    },

    beforeCreate() {
        // 后台告诉APP现在是url?type=APP，Web根据这个type=APP去做APP端的Web页面
        const type = getQueryString('type') || 'web';
        // APP告诉Web现在是什么语种，因为选语种是APP端选的
        const lang = getQueryString('lang');
        sessionStorage.setItem('appType', type);
        if (lang) {
            localStorage.setItem('lang', lang);
            this.$i18n.locale = lang;
        }
        if (type === 'app') {
            require('@/utils/bridge.js');
            window.appNative.init();
            this.showTimeOut = false;
        } else if (type === 'web') {
            this.showTimeOut = true;
        }
    },

    mounted() {
        const env = process.env.NODE_ENV;
        /*       if (env === 'development' || env === 'local') {
          const vConsole = new VConsole();
        } */

        if (document.documentElement.clientWidth > 1024) {
            this.minHeight = `${document.documentElement.clientHeight - 80 - 232}px`;
            window.onresize = () => {
                this.minHeight = `${document.documentElement.clientHeight - 80 - 232}px`;
            };
        }
        window.addEventListener('scroll', this.handleScroll);

        setTimeout(() => {
            const type = getQueryString('type') || 'web';
            this.type = type;
            if (type === 'app') {
                this.minHeight = '100vh';
                this.timer = setInterval(() => {
                    this.callApp();
                }, 500);
            }
        }, 500);
    },

    methods: {
        callApp() {
            window.appNative.setSendData({
                type: 'hideHead',
                hideHead: 1,
                callbackFn: res => {
                    if (res) {
                        const data = JSON.parse(res);
                        data.airport && this.setSelectAirport(data.airport);
                        data.longitude && this.setLongitude(data.longitude);
                        data.latitude && this.setLatitude(data.latitude);
                        data.Authorization && sessionStorage.setItem('token', data.Authorization);
                        data.longitude && sessionStorage.setItem('longitude', data.longitude);
                        data.latitude && sessionStorage.setItem('latitude', data.latitude);
                        data.airport && sessionStorage.setItem('selectAirport', JSON.stringify(data.airport));
                        data.Authorization && sessionStorage.setItem('isLogin', true);
                        data.Authorization &&
                            this.setState({
                                state: 'isLogin',
                                values: true,
                            });
                        data.Authorization &&
                            this.setState({
                                state: 'userToken',
                                values: data.Authorization,
                            });
                    }
                    clearInterval(this.timer);
                    this.timer = null;
                },
            });
            window.appNative.handleSend();
        },

        handleScroll() {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTop) {
                this.scrollFlag = true;
            } else {
                this.scrollFlag = false;
            }
        },

        handleOpenApp() {
            const data = {
                iOS: {
                    schemeURL: 'mceur://',
                    downloadLink:
                        'https://apps.apple.com/us/app/mastercard-travel-experiences/id1577894266',
                },
                android: {
                    schemeURL: 'mceur://splash',
                    downloadLink: 'https://play.google.com/store/apps/details?id=com.dragonpass.en.mceur',
                },
            };
            openApp(data);
        },

        handleClosePromotingApp() {
            this.closePromotingApp = true;
        },

        handleTimeSession() {
            const currentTime = new Date().getTime();
            const expiresIn = sessionStorage.getItem('expiresIn');

            if (this.isLogin && expiresIn) {
                if (currentTime >= expiresIn - 60 * 1000) {
                    this.showSessionTimeOut = true;
                }
            } else {
                clearInterval(this.sessionTimer);
            }
        },

        handleCloseSessionPopup() {
            this.showSessionTimeOut = false;
        },

        fetchProgramStatus() {
            this.$http.account.programStatus().then(res => {
                if (!res.data.programEnable) {
                    return false;
                }
            });
            return true;
        },

        polandView() {
            this.setState({
                state: 'showPolanEquityChangePopup',
                values: false,
            });
            this.$router.push('/account');
        },

        ...mapMutations(['setSelectAirport', 'setLongitude', 'setLatitude', 'setState']),
    },

    components: {
        PageHeader,
        PageFooter,
        SessionTimeOut,
        [Popup.name]: Popup,
    },

    computed: {
        showPromotingApp() {
            return (
                this.$route.name === 'Home' &&
                this.type === 'web' &&
                document.documentElement.clientWidth <= 1024
            );
        },

        startSessionCountDown() {
            return this.type === 'web' && this.isLogin;
        },

        polanEquityChangeMsg() {
            let msg = '';
            if (this.polanEquityChangeType === -1) {
                msg = this.$t('account.poland-agent-equity-downgrade');
            } else if (this.polanEquityChangeType === 1) {
                msg = this.$t('account.poland-agent-equity-upgrade');
            }
            return msg;
        },

        ...mapState([
            'selectAirport',
            'isLogin',
            'showPolanEquityChangePopup',
            'polanEquityChangeType',
        ]),
    },
    beforeRouteUpdate(to,from,next) {
      console.log('beforeRouteUpdate')
    },
    watch: {
        selectAirport: {
            handler(newVal) {
                if (newVal) {
                    clearInterval(this.timer);
                }
            },
            deep: true,
        },
        $route: {
            handler(to, from) {
                const type = getQueryString('type') || 'web';
                if (type === 'app') return;
                if (to.meta.requireAuth && !this.isLogin) {
                    this.setState({
                        state: 'backRouteAfterLogin',
                        values: to.fullPath,
                    });
                    this.$router.replace(from.fullPath);
                    this.$loginModal.show();
                    return;
                }
                if (to.meta.requireProgramAuth && sessionStorage.getItem('isLogin')) {
                    this.$http.account.programStatus().then(res => {
                        if (!res.data.programEnable) {
                            this.showPopup = true;
                            this.$router.replace(from.fullPath);
                            return;
                        }
                    });
                }

                if (to.name === 'PageTimeOut') {
                    this.setState({
                        state: 'backRouteAfterLogin',
                        values: from.fullPath,
                    });
                }
            },
            // deep: true,
        },

        startSessionCountDown(newVal) {
            if (!!newVal) {
                this.sessionTimer = setInterval(() => {
                    this.handleTimeSession();
                }, 5 * 1000);
            }
        },
    },

    beforeDestroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        clearInterval(this.sessionTimer);
        window.removeEventListener('scroll', this.handleScroll);
    },
};
  /* eslint-disable */
</script>

<style lang="scss">
#app {
  @extend .ff-reg;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100%;
  width: 100%;
  text-align: center;
  color: #2c3e50;
}
.app-banner-wrapper {
  width: 100%;
  background-color: #fff;
  .app-banner {
    width: 88%;
    display: flex;
    padding: 12px 0;
    margin: 0 auto;
    align-items: center;
    .app-banner-close {
      width: 32px;
      height: 32px;
      margin-right: 4px;
      background: url('~img/Icon-close@2x.png') no-repeat;
      background-size: 16px 16px;
      background-position: left center;
    }
    .app-icon {
      width: 42px;
      height: 42px;
      margin-right: 10px;
    }
    .app-name {
      width: 120px;
      line-height: 18px;
      font-size: 12px;
      text-align: left;
    }
    .btn-open-app {
      @include confirmBtn(102px, 30px, 16px, 4px);
      margin-left: auto;
    }
  }
}

.app-popup {
  width: 400px;
  padding-top: 26px;
  .desc {
    line-height: 20px;
    font-size: 16px;
    @extend .ff-book;
    padding: 20px 64px;
    text-align: center;
  }
  .app-popup-btn {
    @include confirmBtn(100%, 52px, 16px, 8px);
    margin: 32px auto 0;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
  }
}

@media screen and (max-width: 1024px) {
  .app-popup {
    width: 300px;
    padding-top: 26px;
    .desc {
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
    .app-popup-btn {
      width: 100%;
    }
  }
}
</style>

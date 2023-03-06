<template>
  <van-popup
    class='login-wrapper'
    v-model='isShowLoginModal'
    :close-on-click-overlay='false'
    @closed='resetForm'
  >
    <div class='login' v-show='showLogin'>
      <div class='icon-close' @click="handleClickClose('login')"></div>
      <div class='login-title'>{{ i18n.t('components.header-login') }}</div>
      <div class='form'>
        <div class='form-item'>
          <input
            class='form-input'
            :class="{ 'default-bg': !email, 'form-input-error': emailErr }"
            type='text'
            :placeholder="i18n.t('login.email-address')"
            v-model='email'
            @input='emailInput'
          />
          <div class='error-msg' v-show='emailErr'>{{ emailErrMsg }}</div>
        </div>
        <div class='form-item'>
          <div class='form-input-pwd-wrapper'>
            <input
              class='form-input'
              :class="{ 'default-bg': !password, 'form-input-error': passwordErr }"
              :type='passwordType'
              :placeholder="i18n.t('login.psw')"
              v-model='password'
              @keyup.enter='handleLoginVerify'
            />
            <div class='toggle-show-pwd' @click='handleToggleShowPwd'>
              {{ showPwd ? i18n.t('login.hide') : i18n.t('login.show') }}
            </div>
          </div>
          <div class='error-msg' v-show='passwordErr'>{{ passwordErrMsg }}</div>
        </div>
        <div class='btn-login'>
          <div @click='handleLoginVerify' v-if='!showLoading'>
            {{ i18n.t('components.header-login') }}
          </div>
          <img v-else class='btn-loading' src='~img/loading.gif' alt='' />
        </div>
      </div>
      <a class='forgot-pwd' href='/reset-pwd'>{{ i18n.t('login.forgot-psw') }}</a>
      <div class='no-account'>
        {{ i18n.t('login.no-account') }}
        <a class='sign-up-link' href='/sign-up'>{{ i18n.t('login.sign-up-now') }}</a>
      </div>
    </div>

    <!-- Forgot Password? -->
    <div class='if-forgot-pwd' v-show='showForgotPwd'>
      <div class='title'>{{ i18n.t('login.forgot-psw') }}</div>
      <div class='desc'>
        {{ i18n.t('login.if-forgot-desc') }}
      </div>
      <div class='btn-reset-pwd' @click='resetPwdConfirm'>{{ i18n.t('login.reset-password') }}</div>
      <div class='btn-cancel' @click="handleClickClose('forgotPwd')">
        {{ i18n.t('login.cancel') }}
      </div>
    </div>

    <!-- Session Locked -->
    <div class='session-locked-wrapper' v-show='showSessionLocked'>
      <div class='title'>{{ i18n.t('login.session-lock') }}</div>
      <div class='icon-close' @click="handleClickClose('sessionLocked')"></div>
      <div class='lock-desc'>
        {{ i18n.t('login.lock-desc') }}
      </div>
      <div class='session-count-down'>{{ minute }} : {{ second }}</div>
    </div>
  </van-popup>
</template>

<script>
  import { Popup } from 'vant';
  import context from '../../main';
  import store from '../../store';
  import i18n from '@/i18n';

  export default {
    data() {
      return {
        isShowLoginModal: false,
        passwordType: 'password',
        showPwd: false,
        showLoading: false,
        email: store.state.loginDefaultAccount,
        emailErr: false,
        emailErrMsg: '',
        password: '',
        passwordErr: false,
        passwordErrMsg: '',
        showLogin: true,
        showForgotPwd: false,
        showSessionLocked: false,
        minutes: 4,
        seconds: 59,
        timer: null,
        i18n,
      };
    },

    methods: {
      showModal() {
        this.isShowLoginModal = true;
      },

      handleToggleShowPwd() {
        this.showPwd = !this.showPwd;
        if (this.showPwd) {
          this.passwordType = 'text';
        } else {
          this.passwordType = 'password';
        }
      },

      resetDefaultModule() {
        this.showLogin = true;
        this.showSessionLocked = false;
        this.showForgotPwd = false;
      },

      resetForm() {
        this.email = '';
        this.emailErr = false;
        this.emailErrMsg = '';
        this.password = '';
        this.passwordErr = false;
        this.passwordErrMsg = '';
        this.resetDefaultModule();
      },

      resetTimer() {
        this.minutes = 4;
        this.seconds = 59;
        clearInterval(this.timer);
      },

      resetPwdConfirm() {
        this.isShowLoginModal = false;
        this.resetDefaultModule();
        context.$router.push('/reset-pwd');
      },

      formatNum(n) {
        return n < 10 ? `0${n}` : n;
      },

      emailInput(e) {
        this.email = e.target.value;
      },

      handleCountdown() {
        this.timer = setInterval(() => {
          if (this.seconds === 0 && this.minutes !== 0) {
            this.seconds = 59;
            this.minutes -= 1;
          } else if (this.minutes === 0 && this.seconds === 0) {
            this.seconds = 0;
            clearInterval(this.timer);
            this.resetDefaultModule();
          } else {
            this.seconds -= 1;
          }
        }, 1000);
      },

      invalidEmailOrPwd() {
        this.emailErr = true;
        this.passwordErr = true;
        this.passwordErrMsg = i18n.t('error.login-info-err');
      },

      handleClickClose(type) {
        if (type === 'login') {
          this.isShowLoginModal = false;
          store.commit('setState', {
            state: 'loginDefaultAccount',
            values: '',
          });
        } else if (type === 'sessionLocked') {
          this.showLogin = true;
          this.showSessionLocked = false;
        } else if (type === 'forgotPwd') {
          this.showLogin = true;
          this.showForgotPwd = false;
        }
        this.timer && this.resetTimer();
      },

      handleLoginVerify() {
        if (!this.email && !this.password) {
          this.emailErr = true;
          this.emailErrMsg = i18n.t('error.field-empty-msg');
          this.passwordErr = true;
          this.passwordErrMsg = i18n.t('error.field-empty-msg');
          return;
        }
        if (!this.email) {
          this.emailErr = true;
          this.emailErrMsg = i18n.t('error.field-empty-msg');
          return;
        }
        if (!this.password) {
          this.passwordErr = true;
          this.passwordErrMsg = i18n.t('error.field-empty-msg');
          return;
        }
        if (this.showLoading) {
          return;
        }
        this.loginSubmit();
      },

      loginSubmit() {
        this.showLoading = true;
        this.$http.login
          .login({
            name: this.email,
            password: this.password,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              // 接口返回的res都会转化为JS对象，而不是JSON
              const {
                  data: { id, user },
                } = res,
                {
                  state: { backRouteAfterLogin },
                } = store,
                expiresIn = new Date().getTime() + (900 * 1000);
              console.log('res', res)
              console.log('id', typeof id);
              console.log('user', user);
              console.log('expiresIn', typeof expiresIn);
              /* eslint-disable */
              sessionStorage.setItem('expiresIn', expiresIn);
              sessionStorage.setItem('isLogin', true);
              sessionStorage.setItem('token', id);
              // sessionStorage不支持js对象，会转为Object object？应该将js对象转为JSON对象
              sessionStorage.setItem('userInfo', JSON.stringify(user));
              this.isShowLoginModal = false;
              store.commit('setState', {
                state: 'isLogin',
                values: true,
              });
              store.commit('setState', {
                state: 'userInfo',
                values: user,
              });
              store.commit('setState', {
                state: 'userToken',
                values: id,
              });

              context.$router.push(backRouteAfterLogin);
              this.checkCardLevel();
              this.getLanguageOpts();
            } else if (res.state === '00' && res.errorCode === 'err_login_info') {
              // 用户名/密码错误
              this.invalidEmailOrPwd();
            } else if (res.state === '00' && res.errorCode === 'err_login_warn') {
              // 密码在5分钟内连续输入3次错误
              this.showLogin = false;
              this.showForgotPwd = true;
              this.showSessionLocked = false;
            } else if (res.state === '00' && res.errorCode === 'err_login_limit') {
              // 密码在5分钟内连续输入5次错误：返回错误提示语 + 解锁时间
              this.showLogin = false;
              this.showForgotPwd = false;
              this.showSessionLocked = true;
              const {
                data: { unLockLeftSecond },
              } = res;
              /* eslint-disable */
              this.minutes = parseInt(Number(unLockLeftSecond) / 60);
              this.seconds = Number(unLockLeftSecond) - Number(this.minutes) * 60;
              /* eslint-disable */
              this.handleCountdown();
              return;
            } else {
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },

      checkCardLevel() {
        this.$http.account.checkCardLevel().then(res => {
          if (res.state === '11') {
            const {
              data: { equityChangeType },
            } = res;
            if (equityChangeType !== 0) {
              store.commit('setState', {
                state: 'polanEquityChangeType',
                values: equityChangeType,
              });
              store.commit('setState', {
                state: 'showPolanEquityChangePopup',
                values: true,
              });
            }
          }
        });
      },

      getLanguageOpts() {
        this.$http.common.languageList().then(res => {
          if (res?.state === '11') {
            store.commit('setState', {
              state: 'languageOpts',
              values: res.data,
            });
          }
        });
      },
    },

    watch: {
      email(newVal) {
        if (newVal) {
          this.emailErr = false;
          this.emailErrMsg = '';
          if (this.passwordErr) {
            this.passwordErr = false;
            this.passwordErrMsg = '';
          }
        }
      },

      password(newVal) {
        if (newVal) {
          this.passwordErr = false;
          this.passwordErrMsg = '';
          if (this.emailErr) {
            this.emailErr = false;
            this.emailErrMsg = '';
          }
        }
      },

      second: {
        handler(newVal) {
          this.formatNum(newVal);
        },
      },
      minute: {
        handler(newVal) {
          this.formatNum(newVal);
        },
      },
    },

    computed: {
      second() {
        return this.formatNum(this.seconds);
      },
      minute() {
        return this.formatNum(this.minutes);
      },
      loginDefaultAccount() {
        return store.state.loginDefaultAccount;
      },
    },

    components: {
      [Popup.name]: Popup,
    },
  };
</script>

<style lang='scss' scoped>
  @import './Index.scss';
</style>

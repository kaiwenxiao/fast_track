<template>
  <div class="form-wrapper form-wrapper-step-2">
    <div class="decs-required-field">{{ $t('basic.require-field-desc') }}</div>
    <div class="form-item">
      <div class="form-label">{{ $t('signup.first-name') }}</div>
      <input
        type="text"
        class="form-input"
        :class="{ 'form-input-error': firstNameErr }"
        v-model.trim="firstName"
        maxlength="50"
      />
      <div class="form-item-desc" v-show="!lastNameErr">
        {{ $t('signup.desc-2') }}
      </div>
      <div class="error-msg" v-show="firstNameErr">{{ firstNameErrMsg }}</div>
    </div>

    <div class="form-item">
      <div class="form-label">{{ $t('signup.last-name') }}</div>
      <input
        type="text"
        class="form-input"
        :class="{ 'form-input-error': lastNameErr }"
        v-model.trim="lastName"
        maxlength="50"
      />
      <div class="form-item-desc" v-show="!lastNameErr">
        {{ $t('signup.desc-2') }}
      </div>
      <div class="error-msg" v-show="lastNameErr">{{ lastNameErrMsg }}</div>
    </div>

    <div class="form-item">
      <div class="form-label">{{ $t('signup.email') }}</div>
      <input
        type="text"
        class="form-input"
        :class="{ 'form-input-error': emailErr }"
        v-model.trim="email"
        autocomplete="new-email"
      />
      <div class="error-msg" v-show="emailErr" v-html="emailErrMsg" @click="handleLogin"></div>
    </div>

    <div class="form-item">
      <div class="form-label">{{ $t('signup.confirm-email') }}</div>
      <input
        type="text"
        class="form-input"
        :class="{ 'form-input-error': confirmEmailErr }"
        v-model.trim="confirmEmail"
        autocomplete="new-confirmEmail"
      />
      <div class="form-item-desc" v-show="!confirmEmailErr">
        {{ $t('signup.desc-3') }}
      </div>
      <div class="error-msg" v-show="confirmEmailErr">{{ confirmEmailErrMsg }}</div>
    </div>

    <div class="form-item">
      <div class="form-label">{{ $t('signup.password') }}</div>
      <div class="form-input-pwd">
        <input
          :type="passwordType"
          class="form-input"
          :class="{ 'form-input-error': passwordErr }"
          v-model="password"
          autocomplete="new-password"
          maxlength="50"
        />
        <div class="toggle-show-pwd" @click="handleToggleShowPwd">
          {{ showPwd ? $t('login.hide') : $t('login.show') }}
        </div>
      </div>
      <div
        class="form-item-desc form-item-desc-pwd"
        :class="{ strong: pwdStrength === $t('signup.pwd-strength-strong') }"
        v-show="password.length > 0"
      >
        {{ $t('signup.pwd-strength') }}: <span>{{ pwdStrength }} </span>
      </div>
      <div class="error-msg" v-show="passwordErr && passwordErrMsg">{{ passwordErrMsg }}</div>
    </div>
    <div class="password-desc">
      <div class="password-desc-title">{{ $t('signup.pwd-rules-title') }}</div>
      <div class="password-desc-item" v-for="(item, index) in pwdRules" :key="index">
        <div class="password-desc-icon" :class="{ 'password-icon-matched': item.matched }"></div>
        <div :class="{ 'password-desc-matched': item.matched }">{{ $t(item.key) }}</div>
      </div>
    </div>

    <div class="form-item">
      <div class="form-label">{{ $t('signup.confirm-psw') }}</div>
      <div class="form-input-pwd">
        <input
          :type="confirmPasswordType"
          class="form-input"
          :class="{ 'form-input-error': confirmPasswordErr }"
          v-model="confirmPassword"
          autocomplete="new-confirm-password"
          maxlength="50"
        />
        <div class="toggle-show-pwd" @click="handleToggleShowConfirmPwd">
          {{ showConfirmPwd ? $t('login.hide') : $t('login.show') }}
        </div>
      </div>
      <div class="error-msg" v-show="confirmPasswordErr" v-html="confirmPasswordErrMsg"></div>
    </div>

    <div class="ticked-box-wrapper agree-terms-err" v-show="agreeTermsErr">
      <div class="icon-err"></div>
      {{ $t('signup.agree-terms-err') }}
    </div>

    <div class="ticked-box-wrapper agree-terms-wrapper">
      <div
        class="ticked-box"
        :class="{ 'ticked-box-error': agreeTermsErr }"
        @click="handleTick('agreeTerms')"
      >
        <div class="ticked-box-selected" v-show="agreeTerms"></div>
      </div>
      <span v-html="$t('signup.t&c')"></span>
    </div>

    <div class="ticked-box-wrapper">
      <div class="ticked-box" @click="handleTick('receiveUpdates')">
        <div class="ticked-box-selected" v-show="receiveUpdates"></div>
      </div>
      {{ $t('signup.would-like-receive') }}
    </div>

    <div class="btn-verify">
      <div @click="handleVerify" v-if="!showLoading">{{ $t('signup.create-account') }}</div>
      <img v-else class="btn-loading" src="~img/loading.gif" alt="" />
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  import { emailReg, pwdRules } from '@/utils/config';

  export default {
    data() {
      return {
        firstName: '',
        firstNameErr: false,
        firstNameErrMsg: '',
        lastName: '',
        lastNameErr: false,
        lastNameErrMsg: '',
        email: '',
        emailErr: false,
        emailErrMsg: '',
        confirmEmail: '',
        confirmEmailErr: false,
        confirmEmailErrMsg: '',
        password: '',
        passwordErr: false,
        passwordErrMsg: '',
        confirmPassword: '',
        confirmPasswordErr: false,
        confirmPasswordErrMsg: '',
        showPwd: false,
        showConfirmPwd: false,
        showLoading: false,
        passwordType: 'password',
        confirmPasswordType: 'password',
        emailReg,
        agreeTerms: false,
        agreeTermsErr: false,
        receiveUpdates: false,
        pwdRules,
      };
    },

    methods: {
      handleToggleShowPwd() {
        this.showPwd = !this.showPwd;
        if (this.showPwd) {
          this.passwordType = 'text';
        } else {
          this.passwordType = 'password';
        }
      },

      handleToggleShowConfirmPwd() {
        this.showConfirmPwd = !this.showConfirmPwd;
        if (this.showConfirmPwd) {
          this.confirmPasswordType = 'text';
        } else {
          this.confirmPasswordType = 'password';
        }
      },

      handleTick(type) {
        this[type] = !this[type];
      },

      handleLogin(event) {
        this.setState({
          state: 'loginDefaultAccount',
          values: this.email,
        });
        if (event.target.className === 'login') {
          this.$loginModal.show();
        }
      },

      handleVerify() {
        if (
          !this.firstName &&
          !this.lastName &&
          !this.email &&
          !this.confirmEmail &&
          !this.password &&
          !this.confirmPassword
        ) {
          this.firstNameErr = true;
          this.lastNameErr = true;
          this.emailErr = true;
          this.confirmEmailErr = true;
          this.passwordErr = true;
          this.confirmPasswordErr = true;
          this.firstNameErrMsg = this.$t('error.field-empty-msg');
          this.lastNameErrMsg = this.$t('error.field-empty-msg');
          this.emailErrMsg = this.$t('error.field-empty-msg');
          this.confirmEmailErrMsg = this.$t('error.field-empty-msg');
          this.passwordErrMsg = this.$t('error.field-empty-msg');
          this.confirmPasswordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.firstName) {
          this.firstNameErr = true;
          this.firstNameErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.lastName) {
          this.lastNameErr = true;
          this.lastNameErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.email) {
          this.emailErr = true;
          this.emailErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.confirmEmail) {
          this.confirmEmailErr = true;
          this.confirmEmailErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.emailReg.test(this.email)) {
          this.emailErr = true;
          this.emailErrMsg = this.$t('error.email-invalid');
          return;
        }

        if (!this.emailReg.test(this.confirmEmail)) {
          this.confirmEmailErr = true;
          this.confirmEmailErrMsg = this.$t('error.email-invalid');
          return;
        }

        if (this.email.toLowerCase() !== this.confirmEmail.toLowerCase()) {
          this.emailErr = true;
          this.confirmEmailErr = true;
          this.confirmEmailErrMsg = this.$t('error.email-not-match');
          return;
        }

        if (!this.password) {
          this.passwordErr = true;
          this.passwordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (!this.confirmPassword) {
          this.confirmPasswordErr = true;
          this.confirmPasswordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        if (this.pwdStrength !== this.$t('signup.pwd-strength-strong')) {
          this.passwordErr = true;
          return;
        }

        if (this.confirmPassword !== this.password) {
          this.passwordErr = true;
          this.confirmPasswordErr = true;
          this.confirmPasswordErrMsg = this.$t('error.pwd-not-match');
          return;
        }

        if (!this.agreeTerms) {
          this.agreeTermsErr = true;
          return;
        }

        this.emailVerify();
      },

      emailVerify() {
        this.showLoading = true;
        this.$http.login
          .emailVerify({
            email: this.email,
          })
          .then(res => {
            if (res.state === '11') {
              this.submit();
            } else if (res.state === '00' && res.errorCode === 'err_email_is_reg') {
              // 邮箱已被注册
              this.showLoading = false;
              this.emailErr = true;
              this.confirmEmailErr = true;
              this.emailErrMsg = this.$t('error.email-is-reg');
            } else {
              this.showLoading = false;
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },

      submit() {
        this.$http.login
          .register({
            masterToken: sessionStorage.getItem('regMasterToken'),
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            allowReceive: this.receiveUpdates,
          })
          .then(res => {
            this.showLoading = false;
            if (res.state === '11') {
              sessionStorage.setItem('loginE', this.email);
              sessionStorage.setItem('loginP', this.password);
              this.$router.push(`/sign-up/succ?l4=${res.data.last4}&id=${res.data.dpid}`);
            } else if (res.state === '00' && res.errorCode === 'err_invalid_first_name') {
              this.firstNameErr = true;
              this.firstNameErrMsg = this.$t('error.name-invalid');
            } else if (res.state === '00' && res.errorCode === 'err_invalid_last_name') {
              this.lastNameErr = true;
              this.lastNameErrMsg = this.$t('error.name-invalid');
            } else if (res.state === '00' && res.errorCode === 'err_invalid_pwd') {
              this.passwordErr = true;
              this.passwordErrMsg = this.$t('error.pwd-invalid');
            } else if (res.state === '00' && res.errorCode === 'err_card_invalid') {
              this.$router.push('/sign-up/fail');
            } else {
              res.note && this.$toast(res.note);
            }
          })
          .catch(() => {
            this.showLoading = false;
          });
      },

      ...mapMutations(['setState']),
    },

    computed: {
      pwdStrength() {
        const allMatched = this.pwdRules.every(item => {
          return item.matched === true;
        });
        return allMatched
          ? this.$t('signup.pwd-strength-strong')
          : this.$t('signup.pwd-strength-weak');
      },
    },

    watch: {
      firstName(newVal) {
        if (newVal) {
          this.firstNameErr = false;
          this.firstNameErrMsg = '';
        }
      },

      lastName(newVal) {
        if (newVal) {
          this.lastNameErr = false;
          this.lastNameErrMsg = '';
        }
      },

      email(newVal) {
        if (newVal) {
          this.emailErr = false;
          this.emailErrMsg = '';
          if (this.confirmEmailErr) {
            this.confirmEmailErr = false;
          }
        }
      },

      confirmEmail(newVal) {
        if (newVal) {
          this.confirmEmailErr = false;
          this.confirmEmailErrMsg = '';
          if (this.emailErr) {
            this.emailErr = false;
          }
        }
      },

      password(newVal) {
        if (newVal) {
          this.passwordErr = false;
          this.passwordErrMsg = '';

          this.pwdRules.forEach(item => {
            if (item.regExp.test(newVal)) {
              item.matched = true;
            } else {
              item.matched = false;
            }
          });
        } else {
          this.pwdRules.forEach(item => {
            item.matched = false;
          });
        }
      },

      confirmPassword(newVal) {
        if (newVal) {
          this.confirmPasswordErr = false;
          this.confirmPasswordErrMsg = '';
          if (this.passwordErr) {
            this.passwordErr = false;
          }
        }
      },

      agreeTerms(newVal) {
        if (newVal) {
          this.agreeTermsErr = false;
        }
      },
    },

    beforeDestroy() {
      this.pwdRules.forEach(item => {
        item.matched = false;
      });
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
  .sign-up-step-wrapper {
    .form-wrapper {
      padding: 24px 0 88px;
      .decs-required-field {
        font-size: 14px;
        padding-bottom: 24px;
      }
      .form-item-desc-pwd {
        color: #d22a2f;
        @extend .ff-bold;
      }
      .strong {
        color: #8db92e;
      }
      .password-desc {
        font-size: 14px;
        padding-bottom: 20px;
        .password-desc-title {
          padding-bottom: 10px;
        }
        .password-desc-item {
          position: relative;
          padding: 0 0 6px 25px;
          .password-desc-icon {
            position: absolute;
            width: 15px;
            height: 15px;
            top: -1px;
            left: 0;
            background-image: url('~img/icon-gray-check@2x.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
          .password-icon-matched {
            background-image: url('~img/icon-green-check@2x.png');
          }
          .password-desc-matched {
            @extend .ff-bold;
          }
        }
      }
      .ticked-box-wrapper {
        position: relative;
        line-height: 20px;
        font-size: 14px;
        padding-left: 40px;
        padding-bottom: 40px;
        cursor: pointer;
        .ticked-box {
          position: absolute;
          width: 24px;
          height: 24px;
          top: 0;
          left: 0;
          border: 1px solid #c3c0b8;
          border-radius: 4px;
          box-sizing: border-box;
          .ticked-box-selected {
            position: absolute;
            width: 19px;
            height: 14px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-image: url('~img/ticked-box-checked.png');
            background-repeat: no-repeat;
            background-size: contain;
          }
        }
        .ticked-box-error {
          border-color: $red;
        }
        a {
          color: #ff671b;
        }
      }
      .agree-terms-wrapper {
        padding-bottom: 24px;
      }
      .agree-terms-err {
        line-height: 24px;
        padding-bottom: 24px;
        margin-top: -10px;
        color: #d22a2f;
        .icon-err {
          position: absolute;
          width: 24px;
          height: 24px;
          top: 0;
          left: 0;
          background-image: url('~img/icn-error@2x.png');
          background-repeat: no-repeat;
          background-size: contain;
        }
      }
    }
  }
</style>

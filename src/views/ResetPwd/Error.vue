<template>
  <div class="error-wrapper">
    <img class="icon-error" src="~img/icn-error@2x.png" alt="" />
    <div class="error-content" v-if="errorType === 'codeExpired'">
      <div class="title">{{ $t('login.verification-code-expired') }}</div>
      <div class="desc">{{ $t('login.expired-desc') }}</div>
    </div>
    <div class="error-content" v-if="errorType === 'codeFrequently'">
      <div class="title">{{ $t('login.wait') }}</div>
      <div class="desc">
        {{ $t('login.error-desc') }}
      </div>
    </div>
    <div class="btn" @click="handleOK">{{ $t('login.ok') }}</div>
  </div>
</template>

<script>
  import { getQueryString } from '@/utils';

  export default {
    data() {
      return {
        errorType: null,
        email: null,
      };
    },

    mounted() {
      this.errorType = getQueryString('type');
      this.email = decodeURIComponent(getQueryString('e'));
    },

    methods: {
      step2() {
        this.$router.push(`/reset-pwd/step-2?e=${encodeURIComponent(this.email)}`);
      },

      handleOK() {
        if (this.errorType === 'codeExpired') {
          this.$http.login
            .resetPwdEmailVerify({
              email: this.email,
            })
            .then(res => {
              if (res.state === '11') {
                this.step2();
              }
            });
        }

        if (this.errorType === 'codeFrequently') {
          this.step2();
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .error-wrapper {
    padding: 82px 64px 53px;
    .icon-error {
      width: 53px;
    }
    .error-content {
      width: 360px;
      margin: 0 auto;
      .title {
        line-height: 35px;
        font-size: 28px;
        @extend .ff-bold;
        padding: 18px 0 20px;
        color: $red;
      }
      .desc {
        line-height: 20px;
        font-size: 16px;
        @extend .ff-book;
        padding-bottom: 32px;
        color: #060605;
      }
    }
    .btn {
      @include confirmBtn(400px, 52px, 16px, 8px);
    }
  }

  @media screen and (max-width: 1024px) {
    .error-wrapper {
      width: 88%;
      margin: 0 auto;
      padding-left: 0;
      padding-right: 0;
      .btn {
        width: 100%;
      }
    }
  }
</style>

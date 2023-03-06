<template>
  <div class="session-time-out-wrapper">
    <div class="session-time-out">
      <div class="title">{{ $t('components.session-timed-out') }}</div>
      <div class="desc">
        <div>{{ $t('components.STO-desc1') }}</div>
        <div>
          {{ $t('components.STO-desc2') }}&nbsp;<span>{{ countdown }}</span
          >&nbsp;
          {{ $t('components.STO-desc3') }}
        </div>
      </div>
      <div class="btn btn-continue" @click="refreshToken">{{ $t('basic.continue') }}</div>
      <div class="btn btn-logout" @click="logout">{{ $t('components.header-logout') }}</div>
    </div>
  </div>
</template>

<script>
  import { mapMutations } from 'vuex';

  export default {
    data() {
      return {
        countdown: 60,
        timer: null,
      };
    },

    mounted() {
      this.handleTimer();
    },

    methods: {
      logoutHandler() {
        this.setState({
          state: 'isLogin',
          values: false,
        });
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('isLogin');
      },

      logout() {
        this.$emit('close');
        this.logoutHandler();
        clearInterval(this.timer);
        this.$router.push('/');
      },

      refreshToken() {
        this.$http.common.refreshToken().then(res => {
          if (res && res.state === '11') {
            this.$emit('close');
            /* eslint-disable */
            sessionStorage.setItem('expiresIn', new Date().getTime() + 900 * 1000);
            /* eslint-disable */
            clearInterval(this.timer);
          } else {
            clearInterval(this.timer);
            this.$emit('close');
            this.logoutHandler();
            this.$router.push('/page-timeout');
          }
        });
      },

      handleTimer() {
        this.timer = setInterval(() => {
          /* eslint-disable */
          this.countdown--;
          /* eslint-disable */
          if (this.countdown === 0) {
            clearInterval(this.timer);
            this.$emit('close');
            this.logoutHandler();
            this.$router.push('/page-timeout');
            return false;
          }
          if (this.countdown < 10) {
            this.countdown = `0${this.countdown}`;
          }
        }, 1000);
      },

      ...mapMutations(['setState']),
    },

    beforeDestroy() {
      clearInterval(this.timer);
    },
  };
</script>

<style lang="scss" scoped>
  @import './Index.scss';
</style>

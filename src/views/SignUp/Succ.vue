<template>
  <div class="succ-wrapper">
    <img src="~img/icon-successful-green.svg" alt="" class="icon-succ" />
    <div class="succ-title">{{ $t('signup.congratulations') }}</div>
    <div class="succ-desc">{{ $t('signup.sign-up-completed') }}</div>
    <div class="membership-no-titlte">{{ $t('signup.membership-no-titlte') }}</div>
    <div class="membership-no">{{ dpid }}</div>
    <div class="membership-desc">{{ $t('signup.membership-desc', { l4 }) }}</div>
    <div class="btn btn-view" @click="handleBtnClick('/account')">
      {{ $t('signup.view-account') }}
    </div>
    <div class="btn btn-home" @click="handleBtnClick('/')">{{ $t('signup.back-to-home') }}</div>
  </div>
</template>

<script>
  import { getQueryString } from '@/utils';
  import { mapMutations } from 'vuex';

  export default {
    data() {
      return {
        dpid: null,
        l4: null,
      };
    },

    mounted() {
      this.dpid = getQueryString('id')
        .replace(/\s/g, '')
        .replace(/[^\d]/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ');
      this.l4 = getQueryString('l4');
    },

    methods: {
      handleBtnClick(path) {
        this.$http.login
          .login({
            name: sessionStorage.getItem('loginE'),
            password: sessionStorage.getItem('loginP'),
          })
          .then(res => {
            if (res.state === '11') {
              const {
                data: { id, user },
              } = res;
              sessionStorage.setItem('isLogin', true);
              sessionStorage.setItem('token', id);
              sessionStorage.setItem('userInfo', JSON.stringify(user));
              this.setState({
                state: 'isLogin',
                values: true,
              });
              this.setState({
                state: 'userInfo',
                values: user,
              });
              this.setState({
                state: 'userToken',
                values: id,
              });
              this.$router.push(path);
            }
          });
      },

      ...mapMutations(['setState']),
    },
  };
</script>

<style lang="scss" scoped>
  .succ-wrapper {
    width: 424px;
    line-height: 20px;
    font-size: 16px;
    @extend .ff-book;
    padding: 80px 0;
    margin: 0 auto;
    color: #141413;
    .icon-succ {
      width: 52px;
    }
    .succ-title {
      line-height: 40px;
      font-size: 32px;
      @extend .ff-bold;
      padding: 30px 0 40px;
    }
    .succ-desc {
    }
    .membership-no-titlte {
      padding: 30px 0 6px;
    }
    .membership-no {
      line-height: 30px;
      font-size: 24px;
      @extend .ff-bold;
    }
    .membership-desc {
      padding: 14px 0 32px;
    }
    .btn {
      @include confirmBtn(400px, 52px, 16px, 8px);
      margin: 0 auto;
    }
    .btn-home {
      @include borderBtn(400px, 52px, 50px, 16px, 8px);
      margin-top: 16px;
    }
  }

  @media screen and (max-width: 1024px) {
    .succ-wrapper {
      width: 88%;
      .btn {
        width: 100%;
        min-width: auto;
      }
    }
  }
</style>

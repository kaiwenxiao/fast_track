<template>
  <div class="textLeft" v-if="data">
    <Header :navTitle="data.categoryStr" @goBack="goBack" />
    <div class="help-topics-wrapper">
      <div class="bread-crumb" v-if="!inApp">
        <router-link to="/">{{ $t('account.go-page-home') }}</router-link>
        <span>&gt;</span>
        <router-link to="/helptopics?backType=-1">{{ $t('basic.help-module-nav') }}</router-link>
      </div>
      <div class="clearfix">
        <div class="back fl" @click="goBack" v-if="!inApp">
          <img src="~img/Icon ionic-ios-arrow-back@2x.png" alt="" />
          {{ $t('basic.page-back') }}
        </div>
        <div class="content fl">
          <div class="label">{{ data.labelStr }}</div>
          <!-- <div class="value">{{ data.value }}</div> -->
          <div class="value" v-html="data.valueStr"></div>
          <div class="desc">{{ $t('faq.NUH') }}</div>
          <div class="btn" @click="getInTouch">{{ $t('faq.get-in-touch') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue';
  import { Dialog } from 'vant';

  export default {
    data() {
      return {
        data: null,
      };
    },

    mounted() {
      this.data = JSON.parse(sessionStorage.getItem('helpTopic'));
    },

    components: {
      Header,
    },

    methods: {
      goBack() {
        this.$router.push(`/helptopics/second?category=${this.data.categoryStr}`);
      },

      getInTouch() {
        // if (this.inApp) {
        Dialog.confirm({
          message: this.$t('faq.get-in-touch-toast-1'),
          className: 'van-dialog-helptopic',
          confirmButtonText: this.$t('basic.btn-yes'),
          cancelButtonText: this.$t('basic.btn-no'),
        })
          .then(() => {
            this.showQueryConfirm();
          })
          .catch(() => {
            this.$router.push('/helptopics/getInTouch?queryType=general');
          });
        // } else {
        //   this.$router.push('/helptopics/getInTouch');
        // }
      },

      showQueryConfirm() {
        Dialog.confirm({
          message: this.$t('faq.get-in-touch-toast-2'),
          className: 'van-dialog-helptopic',
          confirmButtonText: this.$t('basic.btn-yes'),
          cancelButtonText: this.$t('basic.btn-no'),
        })
          .then(() => {
            this.$router.push('/helptopics/getInTouch?queryType=urgent');
          })
          .catch(() => {
            this.$router.push('/helptopics/getInTouch?queryType=general');
          });
      },
    },

    computed: {
      inApp() {
        return sessionStorage.getItem('appType') === 'app';
      },
    },
  };
</script>
<style lang="scss" scoped>
  .help-topics-wrapper {
    width: 100%;
    max-width: 1180px;
    margin: 0 auto;
    padding: 0 20px 190px;
    box-sizing: border-box;
    .bread-crumb {
      line-height: 20px;
      font-size: 16px;
      @extend .ff-book;
      margin: 32px 0;
      span {
        margin: 0 4px;
      }
    }
    .back {
      display: flex;
      padding-right: 40px;
      align-items: center;
      @extend .ff-bold;
      color: #ff671b;
      cursor: pointer;
      img {
        width: 9px;
        height: 16px;
        margin-right: 8px;
      }
    }
    .content {
      width: 700px;
      margin: -4px auto 0;
    }
    .label {
      line-height: 30px;
      font-size: 24px;
      @extend .ff-bold;
      padding-bottom: 40px;
    }
    .value {
      line-height: 22px;
      font-size: 16px;
    }
    .desc {
      padding: 80px 0 30px;
      line-height: 25px;
      font-size: 20px;
      @extend .ff-bold;
    }
    .btn {
      width: 330px;
      height: 42px;
      line-height: 38px;
      font-size: 18px;
      @extend .ff-bold;
      text-align: center;
      color: #f38b00;
      border: 2px solid #f38b00;
      border-radius: 6px;
      box-sizing: border-box;
      cursor: pointer;
      &:hover {
        @include confirmBtn(330px, 42px, 18px, 6px);
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .help-topics-wrapper {
      width: 90%;
      padding: 0;
      .back {
        height: 18px;
        img {
          width: 7px;
          height: 12px;
        }
      }
      .content {
        width: 100%;
        padding-bottom: 80px;
      }
      .label {
        line-height: 24px;
        font-size: 18px;
        padding: 24px 0 34px;
      }
      .desc {
        line-height: 22px;
        font-size: 16px;
        padding-top: 40px;
      }
      .btn {
        width: 100%;
      }
    }
  }
</style>

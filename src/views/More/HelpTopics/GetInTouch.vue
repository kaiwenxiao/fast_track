<template>
  <div class="textLeft">
    <Header :navTitle="$t('faq.get-in-touch')" @goBack="goBack" />
    <div class="help-topics-wrapper">
      <div class="bread-crumb" v-if="!inApp">
        <router-link to="/">{{ $t('account.go-page-home') }}</router-link>
        <span>&gt;</span>
        <router-link to="/helptopics?backType=-1">{{ $t('basic.help-module-nav') }}</router-link>
      </div>
      <div class="clearfix">
        <div class="back fl" @click="goBack" v-if="!inApp">
          <img src="~img/Icon ionic-ios-arrow-back@2x.png" alt="" />
          {{ $t('account.back') }}
        </div>

        <div class="content fl" v-if="!type">
          <div class="main-title" v-if="!inApp">{{ $t('faq.get-in-touch') }}</div>

          <!-- <a class="btn" href="tel:+44 808 196 6003 ">
            <img src="~img/icon-call.svg" alt="" />
            +44 808 196 6003</a
          > -->
          <div class="fl web-content web-content-general">
            <div class="title">{{ $t('faq.for-genaral-enquiries') }}</div>
            <!-- <div class="sub-title">Please contact your issuing bank</div> -->
            <div class="desc desc-lh20">
              {{ $t('faq.for-genaral-enquiries-content') }}
            </div>
          </div>
          <div class="fl web-content">
            <div class="title">{{ $t('faq.fue') }}</div>
            <div class="desc">{{ $t('faq.for-current') }}</div>
            <div class="desc bold" id="bold">{{ $t('faq.operat-hours') }}</div>
            <div class="desc">{{ $t('faq.workday') }}</div>
            <div class="desc pb16">{{ $t('faq.when') }}</div>
            <div class="call"><img src="~img/icon-call-black.svg" alt="" />+44 808 196 6003</div>
            <!-- <a class="btn" href="tel:+44 808 196 6003">
              <img src="~img/icon-call.svg" alt="" />
              +44 808 196 6003</a
            > -->
          </div>
        </div>

        <div v-else>
          <div class="content fl" v-if="type === 'urgent'">
            <div class="main-title" v-if="!inApp">{{ $t('faq.get-in-touch') }}</div>
            <div class="title">{{ $t('faq.fue') }}</div>
            <div class="desc">{{ $t('faq.for-current') }}</div>
            <div class="desc bold" id="bold">{{ $t('faq.operat-hours') }}</div>
            <div class="desc">{{ $t('faq.workday') }}</div>
            <div class="desc pb16">{{ $t('faq.when') }}</div>
            <div v-if="inApp">
              <div class="desc">
                {{ $t('faq.please-inform') }}
                <span class="bold" id="bold">{{ $t('faq.TEMN') }}</span>
              </div>
              <!-- <div class="desc bold">{{ $t('faq.TEMN') }}</div> -->
              <div class="desc number">{{ dpidFormat }}</div>
            </div>
            <a class="btn" href="tel:+44 808 196 6003">
              <img src="~img/icon-call.svg" alt="" />
              +44 808 196 6003
            </a>
          </div>

          <div class="content fl" v-if="type === 'general'">
            <div class="main-title" v-if="!inApp">{{ $t('faq.get-in-touch') }}</div>
            <div class="title">{{ $t('faq.for-genaral-enquiries') }}</div>
            <!-- <div class="sub-title">Please contact your issuing bank</div> -->
            <div class="desc desc-lh20">
              {{ $t('faq.for-genaral-enquiries-content') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header.vue';
  import { getQueryString, formatCardNo } from '@/utils';

  export default {
    data() {
      return {
        type: null,
        dpidFormat: null,
      };
    },

    mounted() {
      this.type = getQueryString('queryType');
      this.inApp && this.getUserBasicInfo();
    },

    components: {
      Header,
    },

    methods: {
      goBack() {
        // this.$router.go(-1);
        this.$router.push('/helptopics/third');
      },

      getUserBasicInfo() {
        this.$http.account
          .getAccountInfo()
          .then(res => {
            if (res.state === '11') {
              const {
                data: {
                  membership: { dpid },
                },
              } = res;
              this.dpidFormat = formatCardNo(dpid);
            } else {
            }
          })
          .catch(() => {});
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
    padding: 0 20px;
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
      @extend .ff-bold;
      align-items: center;
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
    .web-content {
      width: 308px;
    }
    .web-content-general {
      margin-right: 124px;
    }
    .title {
      line-height: 24px;
      font-size: 18px;
      @extend .ff-bold;
    }
    .desc {
      line-height: 20px;
      font-size: 16px;
      @extend .ff-book;
      padding-bottom: 8px;
    }
    #bold {
      @extend .ff-bold;
    }
    .pb16 {
      padding-bottom: 16px !important;
    }
    .number {
      line-height: 22px;
      font-size: 16px;
    }
    .sub-title {
      line-height: 22px;
      font-size: 16px;
      @extend .ff-bold;
      padding-bottom: 8px;
    }
    .desc-lh20 {
      line-height: 20px;
    }
    .main-title {
      line-height: 30px;
      font-size: 24px;
      @extend .ff-bold;
      padding-bottom: 40px;
    }
    .btn {
      position: relative;
      display: block;
      @include confirmBtn(100%, 46px, 18px, 8px);
      margin-top: 28px;
      img {
        position: absolute;
        width: 20px;
        height: 20px;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .call {
      display: flex;
      align-items: center;
      img {
        width: 20px;
        margin-right: 10px;
      }
    }
    .web-content .sub-title {
      padding-bottom: 16px;
    }
  }

  @media screen and (max-width: 1024px) {
    .help-topics-wrapper {
      width: 90%;
      padding: 32px 0 0;
      .bread-crumb {
        margin-top: 0;
      }
      .title {
        padding: 0 0 6px;
      }
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
      .main-title {
        line-height: 22px;
        font-size: 18px;
        padding: 16px 0 20px;
      }
      .desc {
        line-height: 20px;
        font-size: 14px;
        @extend .ff-book;
        padding-bottom: 8px;
      }
      .desc-lh20 {
        line-height: 20px;
      }
      .web-content {
        width: 100%;
      }
      .web-content-general {
        padding-bottom: 16px;
      }
    }
  }
</style>

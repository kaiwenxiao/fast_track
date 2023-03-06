<template>
  <div class="textLeft">
    <Header :navTitle="$t('basic.terms-and-conditions')" @goBack="closeWB" />
    <div v-if="contentHTML">
      <div v-html="contentHTML"></div>
    </div>
    <br />
  </div>
</template>
<script>
  import Header from '@/components/Header.vue';
  import { getQueryString } from '@/utils';
  import pickLangue from './Langues/tac';

  export default {
    components: {
      Header,
    },

    computed: {
      contentHTML() {
        return pickLangue(this.$i18n.locale);
      },
    },

    methods: {
      closeWB() {
        const type = sessionStorage.getItem('appType'),
          backType = getQueryString('backType'),
          from = getQueryString('from');
        // 1. 返回APP（比如APP中的More模块进入）
        if (type === 'app' && !backType) {
          window.appNative.setSendData({
            returnHTML: 0,
          });
          window.appNative.handleSend();
        } else if (type === 'app' && backType && from) {
          // 兼容Android Webview返回上一页
          this.$router.push(`/${from}`);
        } else {
          this.$router.go(-1);
        }
      },
    },
  };
</script>
<style lang="scss" scope>
  .tc-content {
    width: 100%;
    max-width: 1180px;
    line-height: 26px;
    font-size: 14px;
    margin: 0 auto;
    padding: 0 20px;
    color: #141413;
    box-sizing: border-box;
    .title {
      line-height: 40px;
      font-size: 30px;
      @extend .ff-bold;
      padding: 30px 0;
      text-align: center;
    }
    h2 {
      line-height: 30px;
      font-size: 24px;
      @extend .ff-bold;
      padding: 30px 0 20px;
    }

    p {
      padding-bottom: 10px;
    }

    a {
      color: blue;
      text-decoration: underline;
    }
  }
  @media screen and (max-width: 1024px) {
    .tc-content {
      width: 92%;
      padding: 0;
      .title {
        font-size: 24px;
        padding: 20px 0 10px;
      }
      h2 {
        font-size: 18px;
      }
    }
  }
</style>

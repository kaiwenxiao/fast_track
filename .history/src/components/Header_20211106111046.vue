import Header from '@/components/Header.vue';
<template>
  <div class="top" v-if="showAppHeader">
    <div class="header">
      <img class="headerBg" src="@/assets/images/header@2x.png" />
      <div class="nav">
        <div v-if="showBack" class="iconBack" @click="goBack" />
        <div v-if="showBack" class="navTitle">{{ navTitle }}</div>
        <img :class="{ centerShow: !showBack }" src="@/assets/images/icn-logo.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      navTitle: String,
      showBack: {
        type: Boolean,
        default: true,
      },
    },

    methods: {
      goBack() {
        this.$emit('goBack');
      },
    },

    computed: {
      showAppHeader() {
        return sessionStorage.getItem('appType') === 'app';
      },
    },
  };
</script>
<style lang="scss" scoped>
  .top {
    height: 99px;
    .header {
      width: 100%;
      max-width: 750px;
      text-align: left;
      position: fixed;
      left: 50%;
      transform: translateX(-50%);
      top: constant(safe-area-inset-top);
      top: env(safe-area-inset-top);
      z-index: 100;
      .headerBg {
        width: 100%;
        height: 99px;
      }
      .nav {
        position: absolute;
        bottom: 10px;
        left: 0;
        right: 0;
        overflow: hidden;
        font-size: 18px;
        .iconBack {
          float: left;
          width: 46px;
          height: 41px;
          background: url('~img/icn-back@2x.png') no-repeat;
          background-position: center center;
          background-size: 8px 16px;
        }
        .navTitle {
          float: left;
          height: 41px;
          line-height: 41px;
          @extend .ff-bold;
        }
        img {
          float: right;
          margin-right: 10px;
        }
        .centerShow {
          display: block;
          float: none;
          margin: 0 auto;
        }
      }
    }
  }
</style>

<template>
  <div class="textLeft">
    <Header :navTitle="category" @goBack="goBack" />
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
        <div class="category-wrapper fl">
          <div class="category" v-if="!inApp">{{ category }}</div>
          <div
            class="category-item"
            v-for="(item, index) in list"
            :key="index"
            @click="handleItemClick(item)"
          >
            {{ item.labelStr }}
            <span class="icon-right-arrow"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue';
  import { data } from '@/utils/helpTopicData';
  import { getQueryString } from '@/utils';

  export default {
    data() {
      return {
        category: null,
        isActive: false,
      };
    },

    mounted() {
      this.category = getQueryString('category');
    },

    components: {
      Header,
    },

    methods: {
      getList() {
        const obj = this.faqData.filter(_ => {
          return _.categoryStr === this.category;
        });
        return obj[0]?.list;
      },

      handleItemClick(item) {
        sessionStorage.setItem(
          'helpTopic',
          JSON.stringify({
            ...item,
            categoryStr: this.category,
          })
        );
        this.$router.push('/helptopics/third');
      },

      goBack() {
        this.$router.push('/helptopics/Index');
      },
    },

    computed: {
      inApp() {
        return sessionStorage.getItem('appType') === 'app';
      },

      faqData() {
        data.forEach(_ => {
          _.categoryStr = this.$t(_.category);
          _.list.forEach(i => {
            i.labelStr = this.$t(i.label);
            i.valueStr = this.$t(i.value);
          });
        });
        return data;
      },

      list() {
        return this.getList();
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
    .category-wrapper {
      width: 670px;
      margin: -4px auto 0;
      padding-bottom: 40px;
      .category {
        line-height: 30px;
        font-size: 24px;
        @extend .ff-bold;
        padding-bottom: 24px;
      }
      .category-item {
        position: relative;
        line-height: 22px;
        font-size: 16px;
        @extend .ff-book;
        padding: 16px 30px 16px 0;
        border-bottom: 1px solid #ddd;
        cursor: pointer;
        .icon-right-arrow {
          position: absolute;
          width: 20px;
          height: 20px;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          background-image: url('~img/icon-right-arrow@2x.png');
          background-repeat: no-repeat;
          background-size: contain;
        }
        &:hover {
          color: #ff671b;
          .icon-right-arrow {
            background-image: url('~img/icon-right-arrow-actived@2x.png');
          }
        }
      }
    }
  }

  @media screen and (max-width: 1024px) {
    .help-topics-wrapper {
      width: 90%;
      padding: 0;
      .category-wrapper {
        width: 100%;
        padding-top: 16px;
        .category {
          line-height: 22px;
          font-size: 18px;
          padding-bottom: 16px;
          margin-top: 0;
        }
        .category-item {
          &:hover {
            color: unset;
            .icon-right-arrow {
              background-image: url('~img/icon-right-arrow@2x.png');
            }
          }
        }
      }
      .back {
        height: 18px;
        img {
          width: 7px;
          height: 12px;
        }
      }
    }
  }
</style>

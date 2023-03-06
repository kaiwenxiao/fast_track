<template>
  <div class="textLeft">
    <Header :navTitle="$t('basic.help-module-nav')" @goBack="closeWB" />
    <div class="help-topics-wrapper">
      <div class="bread-crumb" v-if="!inApp">
        <router-link to="/">{{ $t('account.go-page-home') }}</router-link>
        <span>&gt;</span>
        <router-link to="/helptopics?backType=-1">{{ $t('basic.help-module-nav') }}</router-link>
      </div>
      <div class="search-box-wrapper">
        <h1 class="title">{{ $t('faq.help-quest') }}</h1>
        <div class="search-box">
          <div class="search-default" v-show="!showSearchInput">
            <img class="icon-search" src="~img/icn-search@2x.png" alt="" />
            <input
              class="search-default-input"
              type="text"
              value=""
              :placeholder="$t('faq.search-faq-placeholder')"
              autocomplete="new-search-default-input"
              :autofocus="false"
              @focus="handleSearchInputShow"
            />
          </div>
          <input
            class="search-input"
            type="text"
            v-show="showSearchInput"
            v-model="keyword"
            ref="searchInput"
            autocomplete="new-keyword"
            @keyup="throttle"
            @blur="handleSearchInputBlur"
          />
        </div>
      </div>
      <!-- default data -->
      <div class="category-wrapper category-wrapper-default" v-show="showDefaultData">
        <div class="title">{{ $t('faq.browse-by') }}</div>
        <div class="category-item-wrapper">
          <div
            class="category-item"
            v-for="(item, index) in category"
            :key="index"
            @click="handleItemClick('category', item)"
          >
            {{ item }}
            <span class="icon-right-arrow"></span>
          </div>
        </div>
      </div>

      <!-- frequently-asked-questions -->
      <div class="category-wrapper category-wrapper-f-a-q" v-show="showFrequentlyData">
        <div class="title">{{ $t('faq.ask-question') }}</div>
        <div
          class="category-item"
          v-for="(item, index) in frequentData"
          :key="index"
          @click="handleItemClick('label', item)"
        >
          {{ item.labelStr }}
          <span class="icon-right-arrow"></span>
        </div>
      </div>

      <!-- search -->
      <div class="category-wrapper category-wrapper-search" v-show="showSearchList">
        <div
          class="category-item"
          v-for="(item, index) in searchResult"
          :key="index"
          @click="handleItemClick('label', item)"
        >
          {{ item.labelStr }}
          <span class="icon-right-arrow"></span>
        </div>
      </div>

      <div class="search-no-result" v-show="showSearchNoResult">{{ $t('faq.no-reason') }}</div>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue';
  import { data } from '@/utils/helpTopicData';

  export default {
    data() {
      return {
        showSearchInput: false,
        keyword: '',
        status: true,
        searchResult: [],
      };
    },

    mounted() {},

    components: {
      Header,
    },

    methods: {
      handleSearchInputShow() {
        this.showSearchInput = true;
        this.$nextTick(() => {
          this.$refs.searchInput.focus();
        });
      },

      handleSearchInputBlur() {
        setTimeout(() => {
          this.showSearchInput = false;
        }, 500);
      },

      throttle() {
        if (!this.status) {
          return;
        }

        this.status = false;
        setTimeout(() => {
          this.searchResult = this.searchHelpTopic(this.keyword);
          this.status = true;
        }, 500);
      },

      handleItemClick(clickType, item) {
        if (clickType === 'category') {
          this.$router.push(`/helptopics/second?category=${item}`);
        } else if (clickType === 'label') {
          sessionStorage.setItem('helpTopic', JSON.stringify(item));
          this.$router.push('/helptopics/third');
        }
      },

      closeWB() {
        const type = sessionStorage.getItem('appType');
        if (type === 'app') {
          window.appNative.setSendData({
            returnHTML: 0,
          });
          window.appNative.handleSend();
        } else {
          this.$router.go(-1);
        }
      },

      getCategory() {
        const arr = [];
        this.faqData.forEach(_ => {
          arr.push(_.categoryStr);
        });
        return arr;
      },

      searchHelpTopic(keyword) {
        const key = keyword.trim().toLowerCase(),
          arr = [];
        if (!key) {
          return [];
        }
        this.faqData.forEach(item => {
          item.list.forEach(_ => {
            if (_.labelStr.toLowerCase().indexOf(key) !== -1) {
              arr.push({
                ..._,
                categoryStr: item.categoryStr,
              });
            }
          });
        });
        return arr;
      },

      filterFrequently() {
        const arr = [];
        this.faqData.forEach(item => {
          item.list.forEach(_ => {
            if (_.frequently) {
              arr.push({
                ..._,
                categoryStr: item.categoryStr,
              });
            }
          });
        });
        return arr;
      },
    },

    computed: {
      showDefaultData() {
        return !this.showSearchInput;
      },

      showFrequentlyData() {
        return !this.keyword.trim() && this.showSearchInput && this.searchResult.length <= 0;
      },

      showSearchList() {
        return this.searchResult.length > 0 && this.showSearchInput;
      },

      showSearchNoResult() {
        return this.searchResult.length <= 0 && !!this.keyword.trim() && this.showSearchInput;
      },

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

      category() {
        return this.getCategory();
      },

      frequentData() {
        return this.filterFrequently();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .help-topics-wrapper {
    width: 100%;
    .bread-crumb {
      width: 100%;
      max-width: 1180px;
      line-height: 20px;
      font-size: 16px;
      @extend .ff-book;
      margin: 32px auto 16px;
      padding: 0 20px;
      box-sizing: border-box;
      span {
        margin: 0 4px;
      }
    }
    .search-box-wrapper {
      width: 100%;
      padding: 32px 0;
      background-color: #e3dfd7;
      .title {
        line-height: 40px;
        font-size: 32px;
        @extend .ff-bold;
        margin-bottom: 32px;
        text-align: center;
      }
    }
    .search-box {
      position: relative;
      width: 800px;
      height: 50px;
      line-height: 16px;
      margin: 24px auto 8px;
      color: #383838;
      border-radius: 10px;
      box-shadow: 0 5px 10px #00000029;
      box-sizing: border-box;
      background: #fff;
      .search-default {
        display: flex;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        .icon-search {
          width: 18px;
          height: 18px;
          margin: 17px 8px 0 17px;
        }
        .search-default-input {
          flex: 1;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
      .search-input {
        position: absolute;
        width: 100%;
        height: 100%;
        padding: 17px;
        box-sizing: border-box;
        border-radius: 10px;
      }
    }
    .category-wrapper {
      width: 100%;
      max-width: 1180px;
      margin: 0 auto;
      padding: 0 20px 40px;
      box-sizing: border-box;
      .title {
        line-height: 30px;
        font-size: 24px;
        @extend .ff-bold;
        padding-top: 24px;
        text-align: center;
      }
      .category-item-wrapper {
        width: 800px;
        display: flex;
        flex-wrap: wrap;
        margin: 0 auto;
      }
      .category-item {
        position: relative;
        width: 33%;
        line-height: 22px;
        font-size: 16px;
        @extend .ff-book;
        padding: 40px 0 0 0;
        box-sizing: border-box;
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
    .category-wrapper-default {
      .category-item-wrapper {
        justify-content: space-between;
        &:after {
          content: '';
          width: 30%;
        }
      }
      .category-item {
        position: relative;
        width: 30%;
        padding: 0 30px 0 0;
        margin-top: 40px;

        //     width: 160px;
        //     margin-right: 120px;
        //     box-sizing: border-box;
        //     &:nth-last-of-type(3n) {
        //       margin-right: 0;
        //     }
        //     .icon-right-arrow {
        //       bottom: 0;
        //       top: auto;
        //       transform: none;
        //     }
        //     &:nth-of-type(1),
        //     &:nth-of-type(4) {
        //       width: 155px;
        //     }
        //     &:nth-of-type(2),
        //     &:nth-of-type(5) {
        //       width: 245px;
        //     }
      }
    }
    .category-wrapper-f-a-q,
    .category-wrapper-search {
      width: 535px;
      margin: 0 auto;
      .title {
        padding-bottom: 32px;
      }
      .category-item {
        width: 100%;
        padding: 16px 20px 16px 0;
        border-bottom: 1px solid #dddddd;
      }
    }
    .category-wrapper-search {
      padding-top: 8px;
    }
    .search-no-result {
      padding: 24px 0 40px;
      text-align: center;
    }
  }

  @media screen and (max-width: 1024px) {
    .help-topics-wrapper {
      width: 90%;
      margin: 0 auto;
      .bread-crumb {
        line-height: 15px;
        font-size: 12px;
        margin-top: 16px;
        padding: 0;
      }
      .search-box-wrapper {
        padding: 0;
        background-color: transparent;
        .title {
          display: none;
        }
      }
      .search-box {
        width: 100%;
      }
      .category-wrapper {
        width: 100%;
        padding: 0 0 50px;
        .title {
          line-height: 22px;
          font-size: 18px;
          padding-top: 16px;
          text-align: left;
        }
        .category-item-wrapper {
          width: 100%;
          display: unset;
        }
        .category-item {
          width: 100% !important;
          margin-right: 0 !important;
          padding: 16px 30px 16px 0;
          margin-top: 0;
          border-bottom: 1px solid #ddd;
          .icon-right-arrow {
            right: 0;
            top: 50%;
            transform: translateY(-50%);
          }
          &:hover {
            color: unset;
            .icon-right-arrow {
              background-image: url('~img/icon-right-arrow@2x.png');
            }
          }
        }
      }
      .category-wrapper-default {
        .title {
          display: none;
        }
      }
      .category-wrapper-f-a-q {
        .title {
          padding-bottom: 0 !important;
        }
      }
      .search-no-result {
        padding-top: 16px;
        text-align: left;
      }
    }
  }
</style>

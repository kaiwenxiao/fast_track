<template>
  <div class="modelWrapper">
    <div class="modelBox" :style="{ height: height }">
      <Header :navTitle="$t('product.area-code')" @goBack="close" />
      <div class="modelContent">
        <div class="seachBox flexCenter">
          <div class="seachInput">
            <div class="box-row">
              <div class="flexCenter">
                <img src="@/assets/images/icon-search-small@2x.png" class="icon" />
                <input
                  maxlength="30"
                  :placeholder="$t('product.search-country-placeholder')"
                  v-model.trim="searchKeyword"
                  @keyup="throttle"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="textLeft" v-show="showSearchResult">
          <div
            class="country"
            v-for="(item, index) in codeFiltered"
            :key="index"
            @click="selectCountry(item)"
          >
            {{ item.name }} ({{ item.telabbr }})
          </div>
        </div>

        <div class="textLeft" v-show="showNoResult">
          <p class="noResult">{{ $t('product.no-search') }}</p>
        </div>

        <div
          class="textLeft"
          v-show="showFirstPages"
          v-for="group in data"
          v-bind:key="group.firstWord"
        >
          <div class="firstWord" :index="group.firstWord">{{ group.firstWord }}</div>
          <div
            class="country"
            v-for="item in group.list"
            v-bind:key="item.id"
            @click="selectCountry(item)"
          >
            {{ item.name }} ({{ item.telabbr }})
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Header from '@/components/Header.vue';
  import { transformData } from '@/utils/index';
  export default {
    components: {
      Header,
    },
    props: {
      height: String,
      list: Array,
    },
    data() {
      return {
        // data: [],
        status: true,
        // originData: [],
        searchKeyword: '',
        codeFiltered: [],
        showNoResult: false,
        showSearchResult: false,
        showFirstPages: true,
      };
    },
    methods: {
      close() {
        this.$emit('close');
      },
      selectCountry(i) {
        this.$emit('close', i.telabbr, i.ios2);
        sessionStorage.setItem('country', i.name);
        sessionStorage.setItem('telabbr', i.telabbr);
      },
      throttle() {
        if (!this.status) {
          return;
        }
        this.status = false;
        setTimeout(() => {
          this.search();
          this.status = true;
        }, 1000);
      },
      search() {
        const key = this.searchKeyword.trim().toLowerCase();
        if (!key) {
          this.showSearchResult = false;
          this.showNoResult = false;
          this.showFirstPages = true;
          return;
        }
        this.codeFiltered = [];
        this.originData.forEach(item => {
          if (
            (item.name && item.name.toLowerCase().indexOf(key) !== -1) ||
            (item.telabbr && item.telabbr.indexOf(key) !== -1)
          ) {
            this.codeFiltered.push(item);
            this.showNoResult = false;
            this.showFirstPages = false;
            this.showSearchResult = true;
          } else if (
            item.name &&
            item.name.toLowerCase().indexOf(key) === -1 &&
            item.telabbr &&
            item.telabbr.indexOf(key) === -1 &&
            this.codeFiltered.length === 0
          ) {
            this.showNoResult = true;
            this.showFirstPages = false;
            this.showSearchResult = false;
          }
        });
      },
    },

    computed: {
      originData() {
        return this.list;
      },

      data() {
        return transformData(this.originData);
      },
    },
  };
</script>
<style lang="scss" scoped>
  .modelWrapper {
    position: fixed;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0);
    z-index: 100;

    .modelBox {
      position: absolute;
      width: 100%;
      height: 100%;
      bottom: 0;
      background-color: #f1efeb;
      overflow-x: hidden;
      .modelContent {
        .seachBox {
          background-color: #eeeff3;
          height: 60px;
          .seachInput {
            height: 40px;
            width: 90%;
            border-radius: 5px;
            background-color: #ffffff;
            box-shadow: #00000029 0 3px 6px;
            .icon {
              height: 20px;
              width: 20px;
              padding: 5px;
            }
            input {
              width: 100%;
              height: 40px;
            }
            input::-webkit-input-placeholder {
              font-size: 14px;
              color: #cccccc;
            }
          }
        }
        .firstWord {
          background-color: #f7f8fc;
          font-size: 12px;
          padding: 3%;
          color: #959cb9;
        }
        .noResult {
          padding: 3% 3% 20% 5%;
          font-size: 18px;
          @extend .ff-bold;
          color: #323535;
        }
        .country {
          font-size: 15px;
          padding: 10px;
          background-color: #ffffff;
          border-bottom: 1px solid #dddddd;
        }
      }
    }
  }
</style>

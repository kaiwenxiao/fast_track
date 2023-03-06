<template>
  <div class="content">
    <div class="title">{{ title }}</div>
    <div class="listItem" @click="show">
      <div class="center">
        <img class="icon" :src="icon" />
        <input
          @click.stop="focusSeach"
          class="item-input"
          v-model.trim="value"
          @focus="showSearchPage = true"
          @keyup="throttle"
          ref="searchInput"
          v-clickoutside="airportHandleClose"
          autocomplete="off"
        />
      </div>
      <img @click.stop="focusSeach" class="arrow" src="@/assets/images/icon-right-arrow@2x.png" />
    </div>
    <div class="select-list-airport" v-show="showSelect">
      <div
        style="position: relative; padding: 0 56px; margin-top: 26px; word-break: break-word"
        v-if="hasCipEquity"
      >
        <img
          src="@/assets/images/free-trips.svg"
          alt=""
          style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%)"
        />
        {{ $t('home.select-airport-desc-1') }}
      </div>
      <div
        style="position: relative; padding: 0 56px; margin: 26px 0 20px; word-break: break-word"
        v-if="hasCipEquity"
      >
        <img
          src="@/assets/images/free-trips-1.svg"
          alt=""
          style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%)"
        />
        {{ $t('home.select-airport-desc-2') }}
      </div>
      <ul v-if="recentlyAirport.length > 0 && airportFiltered.length == 0 && !showNoResult">
        <div class="title">{{ $t('product.recently-viewed') }}</div>
        <li @click="getSelectAirport(item)" v-for="(item, index) in recentlyAirport" :key="index">
          <img src="@/assets/images/icon-airplane@2x.png" class="icon" />
          <div class="airport">
            <p class="airportName">{{ item.name }} ({{ item.iataCode }})</p>
            <p class="airportAddress">{{ item.city }},{{ item.country }}</p>
          </div>
          <img
            src="@/assets/images/free-trips.svg"
            class="entitlementIcon"
            v-show="item.supportEntitlement && hasCipEquity"
          />
          <img
            src="@/assets/images/free-trips-1.svg"
            class="entitlementIcon"
            v-show="!item.supportEntitlement && hasCipEquity"
          />
        </li>
      </ul>
      <ul v-show="(airportFiltered.length == 0 && !showNoResult) || !value.trim()">
        <div class="title">{{ $t('product.airports') }}</div>
        <li @click="getSelectAirport(item)" v-for="(item, index) in airportListData" :key="index">
          <img src="@/assets/images/icon-airplane@2x.png" class="icon" />
          <div class="airport">
            <p class="airportName">{{ item.name }} ({{ item.iataCode }})</p>
            <p class="airportAddress">{{ item.city }},{{ item.country }}</p>
          </div>
          <img
            src="@/assets/images/free-trips.svg"
            class="entitlementIcon"
            v-show="item.supportEntitlement && hasCipEquity"
          />
          <img
            src="@/assets/images/free-trips-1.svg"
            class="entitlementIcon"
            v-show="!item.supportEntitlement && hasCipEquity"
          />
        </li>
      </ul>
      <ul v-show="showSearchPage && airportFiltered.length > 0">
        <div class="title">{{ $t('product.result') }}</div>
        <li @click="getSelectAirport(item)" v-for="(item, index) in airportFiltered" :key="index">
          <img src="@/assets/images/icon-airplane@2x.png" class="icon" />
          <div class="airport">
            <p class="airportName">{{ item.name }} ({{ item.iataCode }})</p>
            <p class="airportAddress">{{ item.city }},{{ item.country }}</p>
          </div>
          <img
            src="@/assets/images/free-trips.svg"
            class="entitlementIcon"
            v-show="item.supportEntitlement && hasCipEquity"
          />
          <img
            src="@/assets/images/free-trips-1.svg"
            class="entitlementIcon"
            v-show="!item.supportEntitlement && hasCipEquity"
          />
        </li>
      </ul>
      <ul v-show="showNoResult">
        <li class="no-result">{{ $t('product.no-result') }}</li>
      </ul>
    </div>
    <div class="ErrTextStyle" v-show="showErr">{{ ErrText }}</div>
  </div>
</template>
<script>
  import { mapMutations, mapState } from 'vuex';
  /* eslint-disable  */
  const clickoutside = {
    // 初始化指令
    bind(el, binding, vnode) {
      function documentHandler(e) {
        // 这里判断点击的元素是否是本身，是本身，则返回
        if (el.contains(e.target)) {
          return false;
        }
        // 判断指令中是否绑定了函数
        if (binding.expression) {
          // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
          binding.value(e);
        }
      }
      // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
      el.__vueClickOutside__ = documentHandler;
      document.addEventListener('click', documentHandler);
    },
    update() {},
    unbind(el, binding) {
      // 解除事件监听
      document.removeEventListener('click', el.__vueClickOutside__);
      delete el.__vueClickOutside__;
    },
  };
  /* eslint-disable  */
  export default {
    props: {
      icon: String,
      title: String,
      ErrText: String,
      showErr: Boolean,
      airportListData: Array,
      hasCipEquity: Boolean,
    },
    data() {
      return {
        showSelect: false,
        value: '',
        recentlyAirport: [],
        searchKeyword: '',
        showSearchPage: false,
        airportFiltered: [],
        status: true,
        showRecently: false,
        showNoResult: false,
        airportData: [],
      };
    },
    directives: { clickoutside },

    methods: {
      fetchAirportList() {
        this.$http.booking.getAirport().then(res => {
          if (res.state === '11') {
            localStorage.setItem('airportList', JSON.stringify(res.data));
            // this.airportListData = res.data;
            this.fetchRecentlyView();
          } else {
            // this.$toast.clear();
            // this.$toast(res.note);
          }
        });
      },

      fetchRecentlyView() {
        this.$http.booking.recentlyView().then(res => {
          if (res.state === '11') {
            const airportData = JSON.parse(localStorage.getItem('airportList')),
              recentlyAirportCode = res.data;
            let index;
            this.airportData = airportData;
            this.recentlyAirport = [];

            for (index in recentlyAirportCode) {
              const aa = airportData.filter(item => {
                return item.code === recentlyAirportCode[index];
              });
              if (aa[0]) {
                this.recentlyAirport.push(aa[0]);
              }
            }
          }
        });
      },

      getEquityUseInfo() {
        this.$http.account.equityUseInfo().then(res => {
          if (res.state === '11') {
            const {
              data: { hasCipEquity },
            } = res;
            this.hasCipEquity = hasCipEquity;
          } else {
          }
        });
      },

      show() {
        this.$emit('show');
      },
      airportHandleClose() {
        this.showSelect = false;
      },
      getSelectAirport(item) {
        this.showSelect = false;
        this.setSelectAirport(item);
        this.$emit('getSelectAirport', item.name);
        sessionStorage.setItem('selectAirport', JSON.stringify(item));
        this.value = item.name;
      },
      focusSeach() {
        this.showSelect = true;
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
        const key = this.$refs.searchInput.value.toLowerCase();
        console.log(key);
        if (!key) {
          this.showNoResult = false;
          this.showSearchPage = false;
          return;
        }
        this.airportFiltered = [];
        this.airportData.forEach(item => {
          if (
            item.city.toLowerCase().indexOf(key) !== -1 ||
            item.country.toLowerCase().indexOf(key) !== -1 ||
            item.iataCode.toLowerCase().indexOf(key) !== -1 ||
            item.name.toLowerCase().indexOf(key) !== -1
          ) {
            this.airportFiltered.push(item);
            this.showSearchPage = true;
            this.showRecently = false;
            this.showNoResult = false;
          } else if (
            item.city.toLowerCase().indexOf(key) === -1 &&
            item.country.toLowerCase().indexOf(key) === -1 &&
            item.iataCode.toLowerCase().indexOf(key) === -1 &&
            item.name.toLowerCase().indexOf(key) === -1 &&
            this.airportFiltered.length === 0
          ) {
            this.showSearchPage = false;
            this.showRecently = false;
            this.showAirportNearby = false;
            this.showNoResult = true;
          }
        });
      },

      ...mapMutations(['setSelectAirport']),
    },
    mounted() {
      if (this.selectAirport) {
        const { name } = this.selectAirport;
        this.value = name;
      }
      if (this.userToken && this.localeInit) {
        this.fetchAirportList();
      }
    },

    computed: {
      ...mapState(['selectAirport', 'longitude', 'latitude', 'userToken', 'localeInit']),
    },

    watch: {
      userToken() {
        this.fetchAirportList();
      },
      localeInit(newVal) {
        this.fetchAirportList();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .content {
    padding: 16px 12px;
    .title {
      font-size: 16px;
      padding-bottom: 10px;
      color: #141413;
      @extend .ff-bold;
    }
    .listItem {
      display: flex;
      text-decoration: row;
      justify-content: space-between;
      align-items: justify;
      border: 1px solid #6e6e6e;
      border-radius: 4px;
      // width: 98%;
      height: 44px;
      .center {
        display: flex;
        align-items: center;
        justify-content: center;
        .icon {
          width: 30px;
          height: 30px;
          padding: 5px 7px;
        }
        .item-input {
          color: #2d354c;
          font-size: 16px;
          @extend .ff-book;
          width: 380px;
          height: 100%;
        }
      }
    }
    @media screen and (max-width: 1024px) {
      .listItem {
        border: unset;
        .center {
          .icon {
            width: 28px;
            height: 28px;
          }
        }
      }
    }

    .arrow {
      width: 20px;
      height: 20px;
      padding: 13px;
      transform: rotate(90deg);
    }
    .select-list-airport {
      position: absolute;
      z-index: 999;
      overflow-x: hidden;
      width: 480px;
      max-height: 360px;
      border: 1px solid #ddd;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 0 20px #00000029;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: #323535;
        @extend .ff-bold;
        padding: 10px 16px;
      }
      .no-result {
        font-size: 16px;
        @extend .ff-book;
        padding: 24px 20px;
      }
      ul li {
        width: 100%;
        font-size: 15px;
        display: flex;
        align-items: center;
        cursor: pointer;
        .icon {
          width: 28px;
          height: 28px;
          padding: 10px;
        }
        .airport {
          flex: 1;
          padding: 14px 40px 6px 0;
          .airportName {
            line-height: 18px;
            font-size: 14px;
            @extend .ff-bold;
            color: #323535;
          }
          .airportAddress {
            font-size: 12px;
            padding: 3px 0;
            color: #7b8191;
          }
        }
        .entitlementIcon {
          width: 30px;
          height: 30px;
          margin: 0 5px 0 5px;
        }
      }
      ul li:hover {
        background-color: #ff9900;
        .airport {
          .airportName {
            color: #ffffff;
          }
          .airportAddress {
            color: #ffffff;
          }
        }
      }
    }
  }
</style>

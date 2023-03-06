<template>
  <div class="modelWrapper">
    <div class="modelBox" :style="{ height }">
      <div class="modelHeader">
        <div class="flexCenter seachBox">
          <img src="@/assets/images/yellow-btn-close@2x.png" @click="close" class="iconClose" />
          <div class="searchCell">
            <input
              class="searchInput"
              :placeholder="$t('product.search-airport-placeholder')"
              v-model.trim="searchKeyword"
              autocomplete="off"
              @focus="showSearchPage = true"
              @keyup="throttle"
              ref="searchInput"
            />
          </div>
        </div>
      </div>
      <div class="info box-row" v-if="hasCipEquity">
        <img src="@/assets/images/icn-entitlement.svg" class="icon" />
        <p class="infoText">{{ $t('home.select-airport-desc-1') }}</p>
      </div>

      <div class="info box-row" style="padding-top: 0" v-if="hasCipEquity">
        <img src="@/assets/images/icn-payment.svg" class="icon" />
        <p class="infoText">{{ $t('home.select-airport-desc-2') }}</p>
      </div>

      <!-- Nearest location -->
      <div class="airportList" v-if="showAirportNearby && airportNearby">
        <div class="title">{{ $t('product.nearest-location') }}</div>
        <div class="list">
          <div class="listItem box-row">
            <img class="iconPlane" src="@/assets/images/icon-airplane@2x.png" />
            <div class="airport" @click="handleSelectAirport(airportNearby)">
              <p class="airportName">{{ airportNearby.name }} ({{ airportNearby.iataCode }})</p>
              <p class="airportAddress">{{ airportNearby.city }},{{ airportNearby.country }}</p>
            </div>
            <img
              src="@/assets/images/icon-ft-search@2x.png"
              class="entitlementIcon"
              v-show="airportNearby.supportEntitlement && hasCipEquity"
            />
            <img
              src="@/assets/images/icon-ft-search-2@2x.png"
              class="entitlementIcon"
              v-show="!airportNearby.supportEntitlement && hasCipEquity"
            />
          </div>
        </div>
      </div>

      <div class="airportList" v-show="showNoResult">
        <p class="noResult">{{ $t('product.no-search') }}</p>
      </div>

      <!-- Recently viewed -->
      <div class="airportList" v-if="showRecently && recentlyAirport.length > 0">
        <div class="title">{{ $t('product.recently-viewed') }}</div>
        <div class="list">
          <div class="listItem box-row" v-for="(item, index) in recentlyAirport" v-bind:key="index">
            <img class="iconPlane" src="@/assets/images/icon-airplane@2x.png" />
            <div class="airport" @click="handleSelectAirport(item)">
              <p class="airportName">{{ item.name }} ({{ item.iataCode }})</p>
              <p class="airportAddress">{{ item.city }},{{ item.country }}</p>
            </div>
            <img
              src="@/assets/images/icon-ft-search@2x.png"
              class="entitlementIcon"
              v-show="item.supportEntitlement && hasCipEquity"
            />
            <img
              src="@/assets/images/icon-ft-search-2@2x.png"
              class="entitlementIcon"
              v-show="!item.supportEntitlement && hasCipEquity"
            />
          </div>
        </div>
      </div>

      <!-- Search ariport -->

      <!-- <div class="airportList" v-show="!searchPage">
        <div class="title">All airport</div>
        <div class="list">
          <div class="listItem box-row" v-for="item in airportData" :key="item.id">
            <img class="iconPlane" src="@/assets/images/icon-airplane@2x.png" />
            <div class="airport" @click="handleSelectAirport(item)">
              <p class="airportName">{{ item.name }}({{ item.iataCode }})</p>
              <p class="airportAddress">{{ item.city }},{{ item.country }}</p>
            </div>
            <img src="@/assets/images/icon-airport-entitlement-supported.svg" class="entitlementIcon" />
          </div>
        </div>
      </div> -->

      <div class="airportList" v-if="showSearchPage">
        <div class="list">
          <div class="listItem box-row" v-for="item in airportFiltered" :key="item.id">
            <img class="iconPlane" src="@/assets/images/icon-airplane@2x.png" />
            <div class="airport" @click="handleSelectAirport(item)">
              <p class="airportName">{{ item.name }} ({{ item.iataCode }})</p>
              <p class="airportAddress">{{ item.city }},{{ item.country }}</p>
            </div>
            <img
              src="@/assets/images/icon-ft-search@2x.png"
              class="entitlementIcon"
              v-show="item.supportEntitlement && hasCipEquity"
            />
            <img
              src="@/assets/images/icon-ft-search-2@2x.png"
              class="entitlementIcon"
              v-show="!item.supportEntitlement && hasCipEquity"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapMutations } from 'vuex';

  export default {
    props: {
      icon: String,
      height: String,
      airportData: Array,
      airportNearby: Object,
      hasCipEquity: Boolean,
    },

    data() {
      return {
        searchKeyword: '',
        status: true,
        showNoResult: false,
        showAirportNearby: true,
        showSearchPage: false,
        showRecently: true,
        airportFiltered: [],
        recentlyAirport: [],
      };
    },

    mounted() {
      this.$nextTick(() => {
        this.$refs.searchInput.focus();
      });
      if (this.userToken) {
        this.fetchAirportList();
      }
    },
    methods: {
      fetchAirportList() {
        this.$http.booking.getAirport().then(res => {
          if (res.state === '11') {
            localStorage.setItem('airportList', JSON.stringify(res.data));
            this.fetchRecentlyView();
          } else {
          }
        });
      },
      fetchRecentlyView() {
        this.$http.booking.recentlyView().then(res => {
          if (res.state === '11') {
            const airportData = JSON.parse(localStorage.getItem('airportList')),
              recentlyAirportCode = res.data;
            this.airportData = airportData;
            let index;
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
      close() {
        this.reset();
        this.$emit('close');
      },

      handleSelectAirport(item) {
        this.setSelectAirport(item);
        sessionStorage.setItem('selectAirport', JSON.stringify(item));
        this.$http.booking.recentlyView({ airportCode: item.code }).then(res => {
          if (res.state === '11') {
            console.log(res.data);
          }
        });
        this.reset();
        this.$emit('close', item.name);
      },

      reset() {
        this.airportFiltered = [];
        this.searchKeyword = '';
        this.showSearchPage = false;
        this.showAirportNearby = true;
        this.showRecently = true;
        this.showNoResult = false;
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
          this.showNoResult = false;
          this.showSearchPage = false;
          this.showAirportNearby = true;
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
            this.showAirportNearby = false;
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

      ...mapMutations(['setSelectAirport', 'userToken']),
    },

    watch: {
      userToken() {
        this.fetchAirportList();
      },
    },
  };
</script>
<style lang="scss" scoped>
  .modelWrapper {
    position: fixed;
    bottom: 0;
    top: constant(safe-area-inset-top);
    top: env(safe-area-inset-top);
    left: 50%;
    transform: translateX(-50%);
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
      padding-top: constant(safe-area-inset-bottom);
      padding-top: env(safe-area-inset-bottom);
      box-sizing: border-box;
      .modelHeader {
        display: flex;
        text-decoration: row;
        padding: 10px 0;
        .seachBox {
          width: 100%;
          padding: 0 20px 0 10px;
          .iconClose {
            width: 40px;
            height: 40px;
            margin-right: 10px;
          }
          .modelTitle {
            @extend .ff-bold;
            font-size: 16px;
            padding: 16px 0;
            width: 90%;
            color: #2d354c;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .searchCell {
            height: 50px;
            width: 100%;
            margin: 0 auto;
            border-radius: 10px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.16);
            display: flex;
            text-decoration: row;
            .searchInput {
              width: 100%;
              text-indent: 8px;
              font-size: 14px;
              border-radius: 10px;
            }
          }
        }
      }

      .info {
        padding: 16px 20px;
        .icon {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
        .entitlementIcon {
          width: 20px;
          height: 20px;
          margin: 0 5px -5px 5px;
        }
        .infoText {
          line-height: 18px;
          font-size: 14px;
          color: #323535;
          word-break: break-word;
        }
      }
      .airportList {
        padding: 0 20px;
        .title {
          line-height: 20px;
          font-size: 16px;
          @extend .ff-bold;
          color: #323535;
        }
        .noResult {
          padding: 3% 3% 20% 3%;
          font-size: 18px;
          @extend .ff-bold;
          color: #323535;
        }
        .list {
          padding: 13px 0;
          .listItem {
            position: relative;
            align-items: center;
            margin-bottom: 10px;
            background-color: #fff;
            border-radius: 10px;
            .iconPlane {
              height: 30px;
              width: 30px;
              margin: 0 4px 0 8px;
            }
            .entitlementIcon {
              position: absolute;
              width: 32px;
              height: 32px;
              right: 0;
              top: 0;
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
                padding: 5px 0;
                color: #7b8191;
              }
            }
          }
        }
      }
    }
  }

  // @media only screen and (width: 375px) and (height: 690px) {
  //   .modelWrapper .modelBox .modelHeader {
  //     // top: 88px;
  //     padding-top: 108px;
  //   }
  // }
</style>

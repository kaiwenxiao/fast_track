<template>
    <div class="airport-wrapper page-main-width">
        <div class="bread-crumb">
            <router-link to="/">{{ $t('product.home') }}</router-link>
            <span>&gt;</span>
            <router-link to="/airport">{{ $t('home.btn-select-airport') }}</router-link>
        </div>
        <h1 class="main-title">{{ $t('product.airport-') }}</h1>
        <div class="search-bar-wrapper" @click="handleInputFocus" @touchstart="handleInputFocus">
            <img class="icon-search" src="~img/icon-search-small@2x.png" alt="" />
            <input type="text" class="search-input" :placeholder="$t('product.search-airport-placeholder')"
                autocomplete="off" :readonly="inputReadonly" v-model="searchKeyword" @keyup="throttle"
                ref="searchInput" />
        </div>
        <div class="airport-list-wrapper">
            <div class="free-trips-wrapper" v-if="isLogin && hasCipEquity">
                <p class="free-trips-desc">
                    <img src="~img/free-trips.svg" alt="" />
                    {{ $t('home.select-airport-desc-1') }}
                </p>
                <p class="free-trips-desc">
                    <img src="~img/free-trips-1.svg" alt="" />
                    {{ $t('home.select-airport-desc-2') }}
                </p>
            </div>

            <img class="page-loading" src="~img/spin.gif" v-if="loading" />
            <div v-else>
                <div class="airport-list" v-if="airportShowList.length > 0">
                    <div class="airport-item" v-for="(item, index) in airportShowList" :key="index"
                        @click="selectAirport(item)">
                        <div class="hover-effect">
                            <div class="book-now">{{ $t('home.book-now') }}</div>
                        </div>
                        <div class="airport-pic-wrapper">
                            <img :src="item.imgUrl || airportImgDefault" :alt="`${item.name}, ${item.iataCode}`"
                                @error="imgError(item)" />
                            <div class="can-i-use-entitlement"
                                v-show="isLogin && item.supportEntitlement && hasCipEquity">
                                <img src="~img/free-trips.svg" alt="" />
                                {{ $t('home.eligible-for-free-ft-pass') }}
                            </div>
                            <div class="can-i-use-entitlement"
                                v-show="isLogin && !item.supportEntitlement && hasCipEquity">
                                <img src="~img/free-trips-1.svg" alt="" />
                                {{ $t('home.available-to-buy') }}
                            </div>
                        </div>
                        <div class="airport-desc">
                            <div class="airport-name">{{ item.name }} ({{ item.iataCode }})</div>
                            <div class="airport-desc-item">
                                <img src="~img/icon-destination@2x.png" alt="" />
                                <div class="available-terminal">
                                    {{ $t('home.available-at-terminals', { terminals: item.cip.terminals }) }}
                                </div>
                            </div>
                            <div class="airport-desc-item" v-if="item.cip.freeEntry > 0">
                                <img src="~img/icon-children@2x.png" alt="" />
                                <div>{{ $t('home.free-entry', { age: item.cip.freeEntry }) }}</div>
                            </div>
                            <div class="airport-desc-item" v-if="item.cip.refundable">
                                <img src="~img/icon-refund-permitted@2x.png" alt="" />
                                <div>{{ $t('home.refunds-permitted') }}</div>
                            </div>
                            <div class="airport-desc-item" v-else>
                                <img src="~img/icn-cancel@2x.png" alt="" />
                                <div>{{ $t('home.non-refundable') }}</div>
                            </div>
                            <div class="airport-desc-item" v-if="item.cip.advancePurchase">
                                <img src="~img/icn-advance booking@2x.png" alt="" />
                                <div>{{ $t('home.advance-bookings-only') }}</div>
                            </div>
                            <div class="airport-desc-item" v-else>
                                <img src="~img/icon-Book-instant@2x.png" alt="" />
                                <div>{{ $t('home.same-day-bookings-available') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="no-results" v-else>{{ $t('home.no-result') }}</div>
            </div>
        </div>
        <router-link :to="{name:'child', params:{userId: 124}}">abc</router-link>

    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
    name: 'Airport',

    data() {
        return {
            airportList: [],
            status: true,
            searchKeyword: '',
            airportShowList: [],
            searching: false,
            loading: true,
            inputReadonly: true,
            hasCipEquity: false,
            airportImgDefault: require('@/assets/images/placeholder.svg'),
        };
    },

    mounted() {
        this.fetchAirportList();
        this.isLogin && this.getEquityUseInfo();
    },

    methods: {
        imgError(item) {
            item.imgUrl = this.airportImgDefault;
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
        fetchAirportList() {
            this.$http.common.airportList().then(res => {
                this.loading = false;
                if (res.state === '11') {
                    this.airportList = res.data;
                    this.airportShowList = res.data;
                } else {
                    this.airportList = [];
                }
            });
        },

        handleInputFocus() {
            this.inputReadonly = false;
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
                this.airportShowList = this.airportList;
                return;
            }
            this.searching = true;
            this.airportShowList = [];
            this.airportList.forEach(item => {
                if (
                    item.city.toLowerCase().indexOf(key) !== -1 ||
                    item.country.toLowerCase().indexOf(key) !== -1 ||
                    item.iataCode.toLowerCase().indexOf(key) !== -1 ||
                    item.name.toLowerCase().indexOf(key) !== -1
                ) {
                    this.airportShowList.push(item);
                }
            });
        },

        selectAirport(data) {
            this.setSelectAirport(data);
            sessionStorage.setItem('selectAirport', JSON.stringify(data));
            sessionStorage.removeItem('selectAirport');
            sessionStorage.removeItem('visitDateEN');
            sessionStorage.removeItem('visitDateData');
            sessionStorage.removeItem('time');
            sessionStorage.removeItem('visitDateTimes');
            sessionStorage.removeItem('cipData');
            sessionStorage.removeItem('passengersText');
            sessionStorage.removeItem('personCount');
            sessionStorage.removeItem('guestData');
            sessionStorage.removeItem('timeDataColumns');
            this.$router.push('/bookingdetails');
        },

        ...mapMutations(['setSelectAirport']),
    },

    computed: {
        locale() {
            return this.$i18n.locale;
        },

        ...mapState(['isLogin', 'languageOpts']),
    },

    watch: {
        isLogin(newVal) {
            if (!!newVal) {
                this.getEquityUseInfo();
                this.fetchAirportList();
            }
        },
        locale() {
            this.fetchAirportList();
        },
    },
};
</script>

<style lang="scss" scoped>
@import './Index.scss';
</style>

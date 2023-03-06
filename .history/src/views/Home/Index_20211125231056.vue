<template>
    <div class="home-page-wrapper">
        <router-view></router-view>
        <div class="page-top">
            <div class="circle-gray"></div>
            <div class="home-page-img-1-wrapper">
                <img class="home-page-img-1" src="~img/home-page-img-1.png" alt="" />
            </div>
            <div class="page-top-wrapper">
                <div class="page-top-label">
                    <h1 class="title">{{ $t('home.fast-with-mc') }}</h1>
                    <div class="desc" v-html="$t('home.fast-with-mc-desc')"></div>
                    <router-link to="/airport" tag="div" class="btn-select-airport">{{
            $t('home.btn-select-airport')
          }}</router-link>
                </div>
            </div>
        </div>
        <div class="page-content">
            <div class="ft-desc-wrapper">
                <div class="ft-desc-item page-main-width">
                    <h2 class="ft-desc-item-title">{{ $t('home.airport-security-ft-title') }}</h2>
                    <div class="ft-desc-label">
                        <img class="home-page-img-2" src="~img/home-page-img-2.png" :alt="$t('home.img-alt-1')" />
                        <div class="ft-desc">
                            <div>
                                {{ $t('home.airport-security-ft-desc-1') }}
                            </div>
                            <div>
                                {{ $t('home.airport-security-ft-desc-2') }}
                            </div>
                            <div>
                                {{ $t('home.airport-security-ft-desc-3') }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="ft-desc-item ft-desc-how-work page-main-width">
                    <div class="circle-gray"></div>
                    <h2 class="ft-desc-item-title">{{ $t('home.how-it-works-title') }}</h2>
                    <div class="ft-desc-label">
                        <div class="ft-desc">
                            <div class="ft-desc-flex">
                                <img src="~img/e-ticket.svg" :alt="$t('home.img-alt-3')" />
                                <div class="ft-desc-how-work-item">
                                    <div>1.</div>
                                    {{ $t('home.how-it-works-desc-1') }}
                                </div>
                            </div>
                            <div class="ft-desc-flex">
                                <img src="~img/free-trip-gift.svg" :alt="$t('home.img-alt-4')" />
                                <div class="ft-desc-how-work-item">
                                    <div>2.</div>
                                    {{ $t('home.how-it-works-desc-2') }}
                                </div>
                            </div>
                            <div class="ft-desc-flex">
                                <img src="~img/qr-code.svg" :alt="$t('home.img-alt-5')" />
                                <div class="ft-desc-how-work-item">
                                    <div>3.</div>
                                    {{ $t('home.how-it-works-desc-3') }}
                                </div>
                            </div>
                        </div>
                        <img class="home-page-img-3" src="~img/home-page-img-3.png" :alt="$t('home.img-alt-2')" />
                    </div>
                </div>
            </div>
            <div class="select-airport-wrapper" v-if="airportList.length > 0">
                <div class="border-line"></div>
                <div class="page-main-width">
                    <h2 class="select-airport-title">{{ $t('home.select-airport') }}</h2>
                    <div class="free-trips-wrapper" v-if="isLogin && hasCipEquity">
                        <p class="free-trips-desc">
                            <img src="~img/free-trips.svg" alt="" />
                            <span>{{ $t('home.select-airport-desc-1') }}</span>
                        </p>
                        <p class="free-trips-desc">
                            <img src="~img/free-trips-1.svg" alt="" />
                            <span>{{ $t('home.select-airport-desc-2') }}</span>
                        </p>
                    </div>
                    <div class="airport-list">
                        <div class="airport-item" v-for="(item, index) in airportList.slice(0, 6)" :key="index"
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
                    <div class="btn-view-all-wrapper">
                        <router-link to="/airport" class="btn-view-all">{{
              $t('home.btn-view-all')
            }}</router-link>
                    </div>
                </div>
            </div>
            <div class="app-wrapper">
                <div class="page-main-width">
                    <div class="app-desc">
                        <div class="desc">
                            {{ $t('home.get-app-desc') }}
                        </div>
                        <div class="img-wrapper">
                            <a target="_blank"
                                href="https://apps.apple.com/us/app/mastercard-travel-experiences/id1577894266">
                                <img src="~img/app-store.png" :alt="$t('home.img-alt-7')" />
                            </a>
                            <a target="_blank"
                                href="https://play.google.com/store/apps/details?id=com.dragonpass.en.mceur">
                                <img src="~img/google-play.png" :alt="$t('home.img-alt-8')" />
                            </a>
                        </div>
                    </div>
                    <img class="app-png" src="~img/app.png" :alt="$t('home.img-alt-6')" />
                </div>
            </div>
        </div>
        <div class="accept-cookie-wrapper" v-show="!acceptCookie">
            <img class="close-accept-cookie" src="~img/icon-close.svg" alt="" @click="handleCloseAcceptCookie" />
            <div class="page-main-width">
                <i18n path="home.accept-cookie-desc" tag="div" class="accept-cookie-desc">
                    <router-link to="/privacypolicy?backType=-1">{{
            $t('basic.privacy-policy')
          }}</router-link>
                </i18n>
                <div class="btn-accept" @click="handleAcceptCookie">{{ $t('home.btn-accept') }}</div>
            </div>
        </div>
        <router-link :to="{name: 'Child', params:{userId: 123}}">abc</router-link>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'Home',
    beforeRouteUpdate() {
        console('fuck')
    },
    data() {
        return {
            airportList: [],
            acceptCookie: localStorage.getItem('accept-cookie') || false,
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

        fetchAirportList() {
            this.$http.common.airportList().then(res => {
                if (res.state === '11') {
                    this.airportList = res.data;
                } else {
                    this.airportList = [];
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

        handleAcceptCookie() {
            this.acceptCookie = true;
            localStorage.setItem('accept-cookie', true);
        },

        handleCloseAcceptCookie() {
            this.acceptCookie = true;
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
    beforeRouteUpdate(to, from, next) {
        console.log('to', to)
        console.log('from', from)
        console.log('next', next)
        next()
    },
};
</script>
<style lang="scss" scoped>
@import './Index.scss';
</style>

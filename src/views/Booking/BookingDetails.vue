<template>
    <div class="textLeft bg">
        <!-- nav部分 -->
        <Header :navTitle="$t('account.fast-track')" @goBack="closeWB" />
        <div class="bread-crumb" v-show="appType">
            <div>
                <router-link to="/">{{ $t('product.home') }}</router-link>
                <span>&gt;</span>
                <router-link to="/airport">{{ $t('home.btn-select-airport') }}</router-link>
                <span>&gt;</span>{{ $t('product.book') }}
            </div>
            <h1 class="mainTitle">{{ $t('product.book') }}</h1>
        </div>
        <ProgressBarWeb index="1" class="webBar" />
        <ProgressBar :thisStep="$t('product.booking-step')" :nextStep="$t('product.next-personal-details')" rate="25"
            :circleText="$t('product.1-of-4')" class="h5Bar" />

        <div class="mainContent">
            <!-- 权益展示部分 -->
            <EntitlementBox :equity="equity" />
            <div style="font-size: 14px; padding: 24px 0">{{ $t('basic.require-field-desc') }}</div>
            <!-- Airport部分 -->
            <div class="firstBox">
                <div class="airport">
                    <SelectionBox :title="$t('product.airport')" @click.native="showAirportList" :cellText="airportName"
                        :icon="iconAirplane" class="airport-box" />
                    <AirportListPC :title="$t('product.airport')" :icon="iconAirplane"
                        :airportListData="airportListData" :hasCipEquity="hasCipEquity" class="airport-box-PC"
                        @getSelectAirport="getSelectAirport" />
                    <!-- 选择机场列表 -->
                    <AirportList height="100%" v-if="showAirport" :icon="iconClose" :airportData="airportListData"
                        :airportNearby="airportNearby" :hasCipEquity="hasCipEquity" @close="selectAirportName">
                    </AirportList>
                    <!-- &Terminal选择框部分 -->
                    <SelectionBox :title="`${$t('product.terminal')}*`" @show="showTerminalAction" :cellText="terminal"
                        :icon="iconDestination" :showErr="showErrTerminal" :ErrText="$t('product.pls-select-terminal')"
                        class="terminal-box" v-clickoutside="terminalHandleClose">
                        <div class="select-list-terminal" v-show="showSelectTerminal">
                            <ul>
                                <li @click="getSelectValue(item)" v-for="(item, index) in terminalDataColumns"
                                    :key="index">
                                    <img :src="iconDestination" class="icon" />
                                    <span>{{ item }}</span>
                                </li>
                            </ul>
                        </div>
                    </SelectionBox>
                    <!-- Terminal弹出层 -->
                    <Popup :show="showTerminal" :icon="iconClose" :title="$t('product.select-terminal')"
                        @close="showTerminal = false" height="45%">
                        <van-picker :columns="terminalDataColumns" confirm-button-text=" " cancel-button-text=" "
                            ref="terminalPicker" visible-item-count="3" default-index="1" />
                        <div class="yellowBtn" @click="terminalConfirm">
                            <div class="btn flexCenter">{{ $t('account.done') }}</div>
                        </div>
                    </Popup>
                </div>
            </div>
            <!-- location部分 -->
            <Location :refundable="refundable" :freeEntry="freeEntry" :advancePurchase="advancePurchase"
                :preBookHr="preBookHr" :location="locationStr" :price="price" :count="personCount" :currency="currency"
                :businessHour="businessHour" v-show="currency" />
            <!-- v-show="currency"是为了加载完cip数据再显示该模块，之后改用loading判断 -->

            <!-- visit Date & visit Time 部分 -->
            <div class="fourthBox">
                <div class="woringTime" v-show="showWrongTime">
                    <div class="box-row">
                        <div class="flexCenter">
                            <img class="icon" src="@/assets/images/icn-error@2x.png" />
                            <p class="errorText">
                                {{ $t('product.error-text') }}
                            </p>
                        </div>
                    </div>
                </div>
                <div class="container">
                    <div class="pb32 flex-justify">
                        <!-- visitDate 部分 -->
                        <div class="box-column visitDate">
                            <div class="title">{{ $t('product.visit-date*') }}</div>
                            <div class="dateInput box-row" @click="showDateAction" v-clickoutside="dateHandleClose">
                                <img src="@/assets/images/icon-calendar@2x.png" class="dateIcon" />
                                <!-- <div class="flexCenter"> -->
                                <div id="date" class="date">{{ date }}</div>
                                <img style="
                    position: absolute;
                    right: 0;
                    width: 20px;
                    height: 20px;
                    padding: 13px;
                    transform: rotate(90deg);
                  " class="data-time-arrow" src="@/assets/images/icon-right-arrow@2x.png" />
                                <!-- </div> -->
                            </div>
                            <div class="ErrTextStyle errVisitDateTime" v-show="showDateErr">
                                {{ $t('product.select-a-date') }}
                            </div>
                        </div>

                        <Popup :show="showCalendar" :icon="iconClose" :title="$t('product.visit-date')"
                            @close="showCalendar = false">
                            <!-- 日历组件 -->
                            <Calendars @confirm="chooseDate" :maxDate="maxDate" :minDate="minDate" />
                        </Popup>

                        <!-- visitTime部分 -->
                        <div class="box-column visitTime">
                            <div class="title">{{ $t('product.visit-time*') }}</div>
                            <div class="timeInput box-row" @click="showTimeAction" :class="{ error: showWrongTime }"
                                v-clickoutside="timeHandleClose">
                                <img src="@/assets/images/icon-clock@2x.png" class="timeIcon" />
                                <!-- <div class="flexCenter"> -->
                                <div id="time" class="time">{{ time }}</div>
                                <!-- </div> -->
                                <img style="
                    position: absolute;
                    right: 0;
                    width: 20px;
                    height: 20px;
                    padding: 13px;
                    transform: rotate(90deg);
                  " class="data-time-arrow" src="@/assets/images/icon-right-arrow@2x.png" />
                            </div>

                            <div class="ErrTextStyle errVisitDateTime" v-show="showTimeErr">
                                {{ $t('product.select-a-time') }}
                            </div>
                        </div>

                        <!-- visit Time弹出层 -->
                        <Popup :show="showTime" :icon="iconClose" :title="$t('product.visit-time')"
                            @close="showTime = false">
                            <div style="padding-bottom: 20%">
                                <van-picker :columns="timeDataColumns" confirm-button-text=" " cancel-button-text=" "
                                    ref="timePicker" visible-item-count="5" />
                                <div class="yellowBtn">
                                    <div class="btn flexCenter" @click="timeConfirm">{{ $t('account.done') }}</div>
                                </div>
                            </div>
                        </Popup>
                    </div>
                    <!-- 日期下拉框 -->
                    <div class="select-date" v-if="showSelectDate">
                        <van-calendar :poppable="false" :show-confirm="false" :style="{ height: '400px' }" show-subtitle
                            safe-area-inset-bottom :min-date="minDate" :max-date="maxDate" :default-date="minDate"
                            color="#F79F1A" @confirm="selectDate"></van-calendar>
                    </div>

                    <!-- 时间段下拉框 -->
                    <div class="select-time clearfix" v-show="showSelectTime">
                        <ul>
                            <li @click="getSelectTime(item)" v-for="(item, index) in timeDataColumns" :key="index">
                                {{ item }}
                            </li>
                        </ul>
                    </div>

                    <div class="container-inner" v-clickoutside="passengerHandleClose">
                        <SelectionBox @click.native="showPassengerAction" :title="this.$t('product.no-of-passengers*')"
                            :cellText="passengersText" :icon="icnPassenger" :showErr="showPassengerErr"
                            :ErrText="this.$t('product.pls-select-passengers')" class="no-of-passengers" />
                        <div class="select-passenger" v-show="showSelectPassenger">
                            <PassengerSelector @confirm="PassengerConfirm"
                                :maxAllowPreBookingCount="maxAllowPreBookingCount" :price="price" :currency="currency"
                                :freeEntry="freeEntry" />
                        </div>

                        <!-- 乘客选择器部分 -->
                        <Popup :show="showPassenger" :icon="iconClose" :title="this.$t('product.no-of-passengers')"
                            @close="showPassenger = false">
                            <PassengerSelector @confirm="PassengerConfirm"
                                :maxAllowPreBookingCount="maxAllowPreBookingCount" :price="price" :currency="currency"
                                :freeEntry="freeEntry" />
                        </Popup>
                    </div>
                </div>
            </div>
        </div>
        <!-- Continue按钮部分 -->
        <div class="btn-continue">
            <SubmitBtn :text="$t('basic.continue')" @click.native="gotoPersonalDetails" />
        </div>
    </div>
</template>
<script>
// 自定义组件
import SelectionBox from '@/views/Booking/components/SelectionBox.vue';
import AirportList from '@/views/Booking/components/AirportList.vue';
import AirportListPC from '@/views/Booking/components/AirportListPC.vue';
import Calendars from '@/views/Booking/components/Calendar.vue';
import Header from '@/components/Header.vue';
import Popup from '@/components/Popup.vue';
import ProgressBar from '@/views/Booking/components/ProgressBar.vue';
import ProgressBarWeb from '@/views/Booking/components/ProgressBarWeb.vue';
import EntitlementBox from '@/views/Booking/components/EntitlementBox.vue';
import Location from '@/views/Booking/components/Location.vue';
import Details from '@/views/Booking/components/Details.vue';
import PassengerSelector from '@/views/Booking/components/PassengerSelector.vue';
import SubmitBtn from '@/views/Booking/components/SubmitBtn.vue';
// icon图片
import iconAirplane from '@/assets/images/icon-airplane@2x.png';
import iconDestination from '@/assets/images/icon-destination@2x.png';
import icnPassenger from '@/assets/images/icn-passengers@2x.png';
import iconClose from '@/assets/images/btn-close@2x.png';

import {
    fomatTerminals,
    visitDateFomat,
    visitTimeFomat,
    formatDateEN,
    jsDateFormatter,
} from '@/utils/index';
import { mapState } from 'vuex';
import { Locale, Picker, Calendar } from 'vant';
import choose from '@/utils/calendarLangues';

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
    update() { },
    unbind(el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__);
        delete el.__vueClickOutside__;
    },
};
// /* eslint-disable  */

export default {
    components: {
        Header,
        ProgressBar,
        ProgressBarWeb,
        SelectionBox,
        Popup,
        AirportList,
        EntitlementBox,
        Location,
        Details,
        PassengerSelector,
        SubmitBtn,
        Calendars,
        defaultAirport: false,
        [Picker.name]: Picker,
        [Calendar.name]: Calendar,
        AirportListPC,
    },

    data() {
        return {
            false: false,
            iconAirplane,
            iconDestination,
            icnPassenger,
            iconClose,
            date: this.$t('product.select-date'),
            time: this.$t('product.select-time'),
            airportName: '',
            showAirport: false,
            showTerminal: false,
            showPassenger: false,
            showCalendar: false,
            showTime: false,
            minDate: new Date(2020, 12, 1),
            maxDate: new Date(2021, 12, 31),
            terminal: this.$t('product.select-terminal'),
            showErrTerminal: false,
            showDateErr: false,
            showTimeErr: false,
            terminalDataColumns: [],
            timeDataColumns: [],
            airportListData: [],
            refundable: 0,
            freeEntry: '',
            advancePurchase: 1,
            maxAllowPreBookingCount: 0,
            locationStr: '',
            price: 0,
            passengersText: this.$t('product.select-passengers'),
            showPassengerErr: false,
            businessHour: '',

            personCount: 1, // 人数
            visitDateData: '', // 下单的时间格式2021-01-12
            equity: null,
            airportNearby: null,
            currency: '',
            showWrongTime: false,
            preBookHr: 0,
            loadingSpin: require('@/assets/images/spin.gif'),
            timer: null,
            showSelectTime: false,
            showSelectTerminal: false,
            showSelectDate: false,
            showSelectPassenger: false,
            appType: false,
            hasCipEquity: false,
        };
    },

    directives: { clickoutside },
    methods: {
        passengerHandleClose() {
            this.showSelectPassenger = false;
        },
        dateHandleClose() {
            this.showSelectDate = false;
        },
        timeHandleClose() {
            this.showSelectTime = false;
        },
        terminalHandleClose() {
            this.showSelectTerminal = false;
        },
        getSelectValue(item) {
            const { code } = this.selectAirport;
            this.showSelectTerminal = false;
            this.terminal = item;

            this.getCipData(code, this.terminal);
            console.log(item);
        },
        getSelectTime(item) {
            this.showSelectTime = false;
            this.time = item;
            sessionStorage.setItem('time', this.time);
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
        // 时间段确认按钮
        timeConfirm() {
            this.$refs.timePicker.confirm();
            this.time = this.$refs.timePicker.getColumnValue(0);
            sessionStorage.setItem('time', this.time);
            this.showTime = false;
            this.showWrongTime = false;
        },
        showTerminalAction() {
            if (!this.airportName) {
                this.$toast(this.$t('product.airport-first'));
            } else if (document.documentElement.clientWidth <= 1024) {
                this.showTerminal = true;
                this.showSelectTerminal = false;
            } else {
                this.showTerminal = false;
                this.showSelectTerminal = true;
            }
        },
        // 拉起选择日期框时
        showDateAction() {
            if (this.terminal === this.$t('product.select-terminal')) {
                this.$toast(this.$t('product.terminal-first'));
            } else if (document.documentElement.clientWidth <= 1024) {
                this.showCalendar = true;
                this.showSelectDate = false;
            } else {
                this.showCalendar = false;
                this.showSelectDate = true;
            }
        },
        // 拉起选择时间段框时
        showTimeAction() {
            if (this.timeDataColumns.length === 0) {
                this.$toast(this.$t('product.date-first'));
            } else if (document.documentElement.clientWidth <= 1024) {
                this.showTime = true;
                this.showSelectTime = false;
            } else if (document.documentElement.clientWidth > 1024) {
                this.showTime = false;
                this.showSelectTime = true;
            }
        },
        showPassengerAction() {
            if (this.terminal === this.$t('product.select-terminal')) {
                this.$toast(this.$t('product.terminal-first'));
            } else if (document.documentElement.clientWidth <= 1024) {
                this.showPassenger = true;
                this.showSelectPassenger = false;
            } else {
                this.showPassenger = false;
                this.showSelectPassenger = true;
            }
        },
        selectAirportName(name) {
            this.showAirport = false;
            if (name) {
                this.terminal = this.$t('product.select-terminal');
                this.passengersText = this.$t('product.select-passengers');
                this.date = this.$t('product.select-date');
                this.time = this.$t('product.select-time');
                this.showWrongTime = false;
                this.firstAssignment();
            }
        },
        // 选择terminal点击done按钮
        terminalConfirm() {
            const terminal = this.$refs.terminalPicker.getColumnValue(0),
                { code, terminalList } = this.selectAirport,
                terminalCode = terminalList.find(item => {
                    return item.name === terminal;
                });

            this.terminal = terminal;
            sessionStorage.setItem('terminalCode', terminalCode);
            console.log('terminalCode', terminalCode);
            this.showTerminal = false;

            this.passengersText = this.$t('product.select-passengers');
            this.date = this.$t('product.select-date');
            this.time = this.$t('product.select-time');
            this.getCipData(code, this.terminal);
        },
        // 乘客选择器的确认按钮
        PassengerConfirm(count) {
            this.showPassenger = false;
            this.showSelectPassenger = false;
            this.passengersText =
                count > 1
                    ? `${count} ${this.$t('product.booking-passengers')}`
                    : `${count} ${this.$t('product.booking-passenger')}`;
            this.personCount = count;
            console.log(count);
            sessionStorage.setItem('personCount', count);
            sessionStorage.setItem('passengersText', this.passengersText);
        },
        // 选中日历日期触发的方法
        chooseDate(visitDateEN, visitDateData) {
            sessionStorage.setItem('visitDateEN', visitDateEN);
            sessionStorage.setItem('visitDateData', visitDateData);
            this.showCalendar = false;
            this.showSelectDate = false;
            this.date = visitDateEN;
            this.visitDateData = visitDateData;
            console.log(visitDateData);
            const data = JSON.parse(sessionStorage.getItem('visitDateTimes'));
            this.timeDataColumns = visitTimeFomat(data, visitDateData);
            sessionStorage.setItem('timeDataColumns', JSON.stringify(this.timeDataColumns));
        },
        // 拉起机场列表的弹出层
        showAirportList() {
            this.showAirport = true;
            // sessionStorage.clear();
        },

        // 获取机场列表
        fetchAirportList() {
            this.$http.booking.getAirport().then(res => {
                if (res.state === '11') {
                    localStorage.setItem('airportList', JSON.stringify(res.data));
                    this.airportListData = res.data;
                } else {
                    this.$toast.clear();
                    res.note && this.$toast(res.note);
                }
            });
        },

        // 获取附近机场
        fetchAirportNearby(longitude, latitude) {
            this.$http.booking
                .transportNearby({
                    longitude, // 105.8054
                    latitude, // 21.2188
                })
                .then(res => {
                    if (res.state === '11') {
                        this.airportNearby = res.data;
                        console.log(res.data);
                    } else {
                        // this.$toast.clear();
                        res.note && this.$toast(res.note);
                    }
                });
        },
        // 有括号的站点需要排在后面--惰性模式（判断浏览器是否支持localeCompare）,除去第一次需要判断外，后面每次都只拿结果（针对当前浏览器），减少判断，提高性能
        // 函数覆盖，假如一个函数返回一个同名的函数，那么后面调用该函数会返回那个同名函数
        orderTerminal() {
            let orderTerminal = function () {
                try {
                    'foo'.localeCompare('bar', 'i')
                } catch (e) {
                    return true
                }
                return false
            }
            return orderTerminal()
        },
        // 第一次进来页面时调用的方法
        firstAssignment() {
            if (this.selectAirport) {
                const { code, name, terminalList } = this.selectAirport;
                console.log(name);
                this.airportName = name;
                // 格式化接口传来的terminalList字段
                this.terminalDataColumns = fomatTerminals(terminalList);
                // 当航站楼为一个时 自动默认选中当前terminal
                if (this.terminalDataColumns.length === 1) {
                    this.terminal = String(this.terminalDataColumns[0]);
                }
                debugger

                if (this.orderTerminal()) {
                    let withParentheseTerminal = this.terminalDataColumns.filter((item) => {
                        return /^(\(.*\))/.test(item)
                    })
                    let noWithParentheseTerminal = this.terminalDataColumns.filter((item) => {
                        return withParentheseTerminal.indexOf(item) === -1
                    })
                    withParentheseTerminal.sort((a, b) => a.localeCompare(b, this.$i18n.locale, { ignorePunctuation: true }))
                    noWithParentheseTerminal.sort((a, b) => a.localeCompare(b, this.$i18n.locale, { ignorePunctuation: true }))
                    this.terminalDataColumns = [...noWithParentheseTerminal, ...withParentheseTerminal]
                }
                let { terminal } = this;
                terminal =
                    terminal === this.$t('product.select-terminal')
                        ? this.terminalDataColumns[0]
                        : terminal;
                this.getCipData(code, terminal);
                this.getEquityGetBySiteCode(code);
            }
        },

        // 调用cip数据接口
        getCipData(airport, terminalCode) {
            this.$toast.loading({
                forbidClick: true,
                duration: 0,
                icon: this.loadingSpin,
                className: 'loading-spin',
            });
            this.$http.booking
                .getCipAirports({ airportCode: airport, terminal: terminalCode })
                .then(res => {
                    this.$toast.clear();
                    if (res.state === '11') {
                        sessionStorage.setItem('cipData', JSON.stringify(res.data));
                        this.refundable = res.data.refundable; // 是否可取消
                        this.freeEntry = res.data.freeEntry; // 儿童收费规则
                        this.advancePurchase = res.data.allowPreBooking; // 只能提前预约/支持当天预订
                        this.maxAllowPreBookingCount = res.data.maxAllowPreBookingCount; // 最大乘客数量
                        this.price = res.data.price; // 乘客单价
                        this.businessHour = res.data.businessHour; // openTime
                        this.currency = res.data.currencySymbol;
                        this.preBookHr = res.data.preBookHr;
                        this.locationStr = res.data.location;
                        // 日历范围
                        const dateRange = visitDateFomat(res.data.visitDateTimes);
                        sessionStorage.setItem('visitDateTimes', JSON.stringify(res.data.visitDateTimes));
                        console.log(dateRange.minDate);
                        this.minDate = dateRange.minDate;
                        this.maxDate = dateRange.maxDate;
                        this.selectDate(this.minDate);
                    } else {
                        console.log('token失效！');
                    }
                });
        },
        // 校验表单
        validate() {
            if (this.terminal === this.$t('product.select-terminal')) {
                this.showErrTerminal = true;
                return false;
            }

            if (this.date === this.$t('product.select-date')) {
                this.showDateErr = true;
                return false;
            }
            if (this.time === this.$t('product.select-time')) {
                this.showTimeErr = true;
                return false;
            }
            if (this.passengersText === this.$t('product.select-passengers')) {
                this.showPassengerErr = true;
                return false;
            }
            if (
                !this.showErrTerminal &&
                !this.showPassengerErr &&
                !this.showDateErr &&
                !this.showTimeErr
            ) {
                return true;
            }
        },
        // 下单调用的方法
        addGeneralInfos() {
            const cipData = JSON.parse(sessionStorage.getItem('cipData')),
                { code } = this.selectAirport,
                data = {
                    fastTrackCode: cipData.code,
                    personCount: this.personCount,
                    price: cipData.price,
                    currency: cipData.currency,
                    visitDate: this.visitDateData,
                    totalPrice: (this.personCount * cipData.price).toFixed(2),
                    visitTime: this.time,
                    airportCode: code,
                    terminalCode: sessionStorage.getItem('terminalCode'),
                    terminal: this.terminal,
                };
            console.log(data);
            this.$toast.loading({
                forbidClick: true,
                duration: 0,
                icon: this.loadingSpin,
                className: 'loading-spin',
            });
            this.$http.order.addGeneralInfos(data).then(res => {
                this.$toast.clear();
                if (res.state === '11') {
                    console.log(res);
                    sessionStorage.setItem('orderNo', res.data.orderNo);
                    this.$router.push({ path: '/personaldetails' });
                } else if (res.state === '00' && res.errorCode === 'err_order_using_time') {
                    this.showWrongTime = true;
                } else {
                    res.note && this.$toast(res.note);
                }
            });
        },
        // 校验数据、下单、去下一页
        gotoPersonalDetails() {
            if (!this.validate()) {
                console.log('校验不通过');
            } else {
                this.addGeneralInfos();
            }
        },

        // 获取权益
        getEquityGetBySiteCode(airportCode) {
            this.$http.booking
                .equityGetBySiteCode({
                    airportCode,
                })
                .then(res => {
                    if (res.state === '11') {
                        this.equity = res.data;
                    }
                });
        },

        appDataCallApi() {
            this.firstAssignment();
            this.longitude && this.latitude && this.fetchAirportNearby(this.longitude, this.latitude);
        },

        // 桌面端选择日期触发的函数
        selectDate(e) {
            console.log(e);
            const visitDate = e,
                // 对日期按需求进行格式化成  => 25 July 2020
                visitDateEN = formatDateEN(visitDate),
                visitDateData = jsDateFormatter(visitDate),
                data = JSON.parse(sessionStorage.getItem('visitDateTimes'));
            sessionStorage.setItem('visitDateEN', visitDateEN);
            sessionStorage.setItem('visitDateData', visitDateData);
            this.date = visitDateEN;
            console.log(visitDateData);
            this.timeDataColumns = visitTimeFomat(data, visitDateData);
            this.visitDateData = visitDateData;
            this.showSelectDate = false;
            this.time = this.$t('product.select-time');
            sessionStorage.setItem('timeDataColumns', JSON.stringify(this.timeDataColumns));
        },

        getSelectAirport(name) {
            console.log(name);
            if (name) {
                this.airportName = name;
                this.terminal = this.$t('product.select-terminal');
                this.passengersText = this.$t('product.select-passengers');
                this.date = this.$t('product.select-date');
                this.time = this.$t('product.select-time');
                this.showWrongTime = false;
                this.firstAssignment();
            }
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
    },

    mounted() {
        const appType = sessionStorage.getItem('appType'),
            visitDateEN = sessionStorage.getItem('visitDateEN'),
            visitDateData = sessionStorage.getItem('visitDateData'),
            timeDataColumns = sessionStorage.getItem('timeDataColumns'),
            time = sessionStorage.getItem('time'),
            personCount = sessionStorage.getItem('personCount'),
            passengersText = sessionStorage.getItem('passengersText');

        if (visitDateEN && visitDateData && timeDataColumns) {
            this.date = visitDateEN;
            this.visitDateData = visitDateData;
            this.timeDataColumns = JSON.parse(timeDataColumns);
        }

        if (time) {
            this.time = time;
        }

        if (personCount && passengersText) {
            this.passengersText = passengersText;
            this.personCount = Number(personCount);
        }

        if (appType === 'app') {
            this.timer = setInterval(() => {
                if (this.selectAirport && !this.defaultAirport) {
                    this.defaultAirport = true;
                    this.appDataCallApi();
                    clearInterval(this.timer);
                }
            }, 500);
            Locale.add(choose(this.$i18n.locale));
            this.firstAssignment();
            this.fetchAirportList();
        } else {
            this.appType = true;
        }
        if (this.userToken) {
            console.log('mounted userToken');
            this.getEquityUseInfo();
        }
        if (appType === 'web' && this.localeInit) {
            Locale.add(choose(this.$i18n.locale));
            this.firstAssignment();
            this.fetchAirportList();
        }
    },

    watch: {
        // 监听terminal的值 消除ErrText
        terminal(val) {
            this.terminal = val;
            if (!(this.terminal === this.$t('product.select-terminal'))) {
                this.showErrTerminal = false;
            }
        },
        // 监听passengersText的值 消除ErrText
        passengersText(val) {
            this.passengersText = val;
            if (!(this.passengersText === this.$t('product.select-passengers'))) {
                this.showPassengerErr = false;
            }
        },
        // 监听date的值 消除ErrText
        date(val) {
            this.date = val;
            if (!(this.date === this.$t('product.select-date'))) {
                this.showDateErr = false;
            }
        },
        // 监听time的值 消除ErrText
        time(val) {
            this.time = val;
            if (!(this.time === this.$t('product.select-time'))) {
                this.showTimeErr = false;
            }
        },

        selectAirport: {
            handler(newVal) {
                if (newVal && !this.defaultAirport) {
                    this.defaultAirport = true;
                    this.appDataCallApi();
                    console.log('接收到APP数据并请求cip数据，附近机场数据');
                }
            },
            deep: true,
        },

        userToken(newVal) {
            this.getEquityUseInfo();
        },

        localeInit(newVal) {
            Locale.add(choose(this.$i18n.locale));
            this.firstAssignment();
            this.fetchAirportList();
        },
    },

    computed: {
        ...mapState(['selectAirport', 'longitude', 'latitude', 'userToken', 'localeInit']),
    },
};
</script>
<style lang="scss" scoped>
@import './index.scss';

.mainContent {
  .yellowBtn {
    position: absolute;
    bottom: 0;
    z-index: 999;
    width: 100%;
    padding-left: 70%;
    padding-bottom: 9%;
    cursor: pointer;
    .btn {
      height: 50px;
      width: 90px;
      background-color: #f38b00;
      border-radius: 4px;
      font-size: 16px;
      @extend .ff-bold;
      color: #ffffff;
    }
  }
  .passengerBtn {
    width: 30%;
    padding: 20px 0 20px 10%;
    .btn {
      height: 50px;
      width: 90px;
      background-color: #f38b00;
      border-radius: 4px;
      font-size: 16px;
      @extend .ff-bold;
      color: #ffffff;
    }
  }

  .firstBox {
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.16);
    .airport {
      display: flex;
      align-items: justify;
      justify-content: space-between;
      margin: 0 50px;
      .airport-box-PC {
        width: 480px;
        padding: 32px 0;
      }
      .airport-box {
        display: none;
      }
      .terminal-box {
        width: 480px;
        padding: 32px 0;
      }
    }
  }

  .thirdBox {
    background-color: #ffffff;
    width: 100%;
    margin: 16px 0;
    border-radius: 8px;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.16);
    .container {
      padding: 0 16px;
    }
  }
  .fourthBox {
    background-color: #ffffff;
    width: 100%;
    margin: 16px 0;
    border-radius: 8px;
    box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.16);
    .woringTime {
      padding: 0 3%;
      .icon {
        height: 28px;
        width: 28px;
        padding: 10px;
      }
    }
    .container {
      position: relative;
      padding: 36px 0 28px;
      margin: 0 50px;
      .container-inner {
        border-top: 1px solid #e3e3e3;
        .no-of-passengers {
          width: 480px;
          padding: 32px 0 0 0 !important;
        }
      }
      .pb32 {
        padding-bottom: 32px;
      }
      .title {
        @extend .ff-bold;
        font-size: 16px;
        color: #141413;
        padding-bottom: 10px;
      }
      .visitDate {
        width: 480px;
        .dateInput {
          position: relative;
          display: flex;
          width: 100%;
          height: 44px;
          padding-right: 8px;
          align-items: center;
          border: 1px solid #6e6e6e;
          border-radius: 4px;
          box-sizing: border-box;
          cursor: default;
          .dateIcon {
            height: 31px;
            width: 31px;
            padding: 0 14px 0 12px;
          }
          .date {
            font-size: 16px;
          }
        }
      }
      .visitTime {
        width: 480px;
        .timeInput {
          position: relative;
          display: flex;
          width: 100%;
          height: 44px;
          padding-right: 8px;
          align-items: center;
          border: 1px solid #6e6e6e;
          border-radius: 4px;
          box-sizing: border-box;
          cursor: default;
          .timeIcon {
            height: 31px;
            width: 31px;
            padding: 0 14px 0 12px;
          }
          .time {
            font-size: 16px;
          }
        }
      }
    }
  }
}

.errVisitDateTime {
  padding-top: 10px;
}

@media screen and (max-width: 1024px) {
  .data-time-arrow {
    display: none;
  }
  .mainContent {
    .fourthBox {
      .container {
        margin: 0;
        padding: 16px;
        .container-inner {
          .no-of-passengers {
            width: 100%;
          }
        }
        .title {
          font-size: 12px;
        }
        .visitDate {
          width: 48%;
          padding-right: 0;
          .dateInput {
            .date {
              font-size: 14px;
            }
            .dateIcon {
              width: 25px;
              height: 25px;
              padding: 9px;
            }
          }
        }
        .visitTime {
          width: 48%;
          .timeInput {
            .time {
              font-size: 14px;
            }
            .timeIcon {
              width: 25px;
              height: 25px;
              padding: 9px;
            }
          }
        }
      }
    }
    .firstBox {
      background-color: #ffffff;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 0;
      .airport {
        display: unset;
        flex-direction: unset;
        margin: 0;
        padding: 0;
        .airport-box-PC {
          display: none;
          width: 0;
        }
        .airport-box {
          display: block;
          width: 100%;
          border-bottom: 1px solid #e3e3e3;
        }
        .terminal-box {
          width: 100%;
          padding: 16px;
        }
      }
    }
  }
  .lang-fr-FR {
    #date,
    #time {
      font-size: 12px;
    }
  }
}
</style>

<template>
    <div>
        <div class="bg" v-show="!showAreaCodeList">
            <!-- nav部分 -->
            <Header :navTitle="$t('account.fast-track')" @goBack="goBack" />
            <div class="bread-crumb" v-show="appType">
                <router-link to="/">{{ $t('product.home') }}</router-link>
                <span>&gt;</span>
                <router-link to="/airport">{{ $t('home.select-airport') }}</router-link>
                <span>&gt;</span>{{ $t('product.book') }}
                <h1 class="mainTitle">{{ $t('product.book') }}</h1>
            </div>
            <ProgressBarWeb index="2" class="webBar" />
            <ProgressBar :thisStep="$t('product.personal-details')" :nextStep="$t('product.next-review')" rate="50"
                :circleText="$t('product.2-of-4')" class="h5Bar" />
            <div class="mainContent">
                <div class="to-back" v-show="appType">
                    <div class="click" @click="goStep1">
                        <div class="iconBack"></div>
                        <span class="text"> {{ $t('basic.page-back') }}</span>
                    </div>
                </div>
                <div style="font-size: 14px; padding: 24px 0">
                    {{ $t('basic.require-field-desc') }}
                </div>
                <div class="err-box" v-show="errorCodeList && errDetail">
                    <img src="~img/icn-error@2x.png" />
                    <span>{{ $t('error.name-invalid') }}</span>
                </div>
                <!-- Lead Passenger部分 -->
                <BoxBg :title="$t('product.lead-passenger')">
                    <div class="leadPassengerBox">
                        <div class="firstPassenger">
                            <div class="inputTitle">{{ $t('product.first-name') }}</div>
                            <div class="firstPassengerInput">
                                <p class="nameText">{{ firstName }}</p>
                            </div>
                        </div>
                        <div class="firstPassenger">
                            <div class="inputTitle">{{ $t('product.last-name') }}</div>
                            <div class="lastPassengerInput">
                                <p class="nameText">{{ lastName }}</p>
                            </div>
                        </div>
                    </div>
                    <!-- <TelCell /> -->
                    <div class="telEmailBox">
                        <div class="telBox">
                            <div class="box-column" style="width: 100%">
                                <div class="inputTitle">{{ $t('product.contact-number') }}</div>
                                <div class="box-row">
                                    <div class="codeInput" :class="{ error: phonePrefixErr }">
                                        <div class="flexCenter" @click="selectCountryCode"
                                            v-clickoutside="codeHandleClose">
                                            <div class="area-flag">+</div>
                                            <input class="code" maxlength="10" type="tel" autocomplete="new-phonePrefix"
                                                v-model.trim="phonePrefix" ref="phonePrefixInput"
                                                @keyup="searchAreaCodeResult" @focus="whenFocusPhonePrefixInput" />
                                        </div>
                                        <div class="select-list" v-show="showSelect">
                                            <ul>
                                                <li @click="getSelectValue(item)"
                                                    v-for="(item, index) in searchResultAreaList" :key="index">
                                                    {{ item.name }}({{ item.telabbr }})
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div style="padding: 3%" class="flexCenter">—</div>
                                    <input class="telNum" :class="{ error: phoneErr }" maxlength="20" type="tel"
                                        v-model.trim="phone" autocomplete="off" />
                                </div>
                                <div class="errorText" v-show="phonePrefixErrComputed">
                                    {{ $t('error.field-empty-msg') }}
                                </div>
                                <div class="errorText" v-show="phoneErr">{{ phoneErrMsg }}</div>
                            </div>
                        </div>

                        <!-- <EmailCell v-model="email" /> -->
                        <div class="emailBox">
                            <div class="inputTitle">{{ $t('product.email-address') }}</div>
                            <input class="email" :class="{ error: emailErr }" maxlength="50" type="text"
                                autocomplete="off" v-model.trim="email" />
                            <div class="errorText" v-show="emailErr">{{ emailErrMsg }}</div>
                        </div>
                    </div>
                </BoxBg>
                <!-- 其他Passenger部分 -->
                <div v-for="(item, index) in guestData" :key="index" ref="nameBox">
                    <div class="secondBox" v-if="guestData.length > 0">
                        <div class="content"
                            :class="{ error: !item.showDetail && (item.firstNameErr || item.lastNameErr) }">
                            <div class="flex-justify">
                                <div class="title">{{ $t('product.passenger') }} {{ index + 2 }}</div>
                                <div class="show" @click="togglePassengerInfo(index, item.showDetail)">
                                    {{ item.toggleText }}
                                </div>
                            </div>
                            <div class="part-box" v-show="item.showDetail">
                                <div class="inputBox">
                                    <div class="inputTitle">{{ $t('product.first-name') }}*</div>
                                    <input class="inputCell" :class="{ error: item.firstNameErr }"
                                        v-model="item.firstName" maxlength="50" type="text" autocomplete="off"
                                        @input="passengerNameChange(index, 'first')" />
                                    <div class="errorText" v-show="item.firstNameErr">{{ errMsg }}</div>
                                </div>
                                <div class="inputBox2">
                                    <div class="inputTitle">{{ $t('product.last-name') }}*</div>
                                    <input class="inputCell" :class="{ error: item.lastNameErr }"
                                        v-model="item.lastName" maxlength="50" type="text" autocomplete="off"
                                        @input="passengerNameChange(index, 'last')" />
                                    <div class="errorText" v-show="item.lastNameErr">{{ errMsg }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-continue">
                <SubmitBtn :text="$t('basic.continue')" @click.native="gotoReviewBooking" />
            </div>
        </div>
        <AreaCodeList v-show="showAreaCodeList" @close="closeAreaCodeList" height="100%" :list="areaList" />
    </div>
</template>
<script>
import Header from '@/components/Header.vue';
import BoxBg from '@/components/BoxBg.vue';
import ProgressBar from '@/views/Booking/components/ProgressBar.vue';
import ProgressBarWeb from '@/views/Booking/components/ProgressBarWeb.vue';
import TelCell from '@/components/TelCell.vue';
import EmailCell from '@/components/EmailCell.vue';
import InputCell from '@/components/InputCell.vue';
import SubmitBtn from '@/views/Booking/components/SubmitBtn.vue';
import AreaCodeList from '@/views/Booking/components/AreaCodeList.vue';
import validator from 'validator';
import { mapState } from 'vuex';

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
/* eslint-disable  */

export default {
    components: {
        Header,
        BoxBg,
        ProgressBar,
        ProgressBarWeb,
        InputCell,
        TelCell,
        EmailCell,
        SubmitBtn,
        AreaCodeList,
    },
    data() {
        return {
            firstName: '',
            lastName: '',
            passengerCount: 0,
            email: '',
            phonePrefix: '',
            phone: '',
            ios2: null,
            guestData: [],
            showDetail: false,
            phonePrefixErr: false,
            phoneErr: false,
            phoneErrMsg: this.$t('error.field-empty-msg'),
            guestLastNameErr: false,
            guestFirstNameErr: false,
            guestLastNameStatus: false,
            guestFirstNameStatus: false,
            result: false,
            showAreaCodeList: false,
            emailErr: false,
            emailErrMsg: this.$t('error.field-empty-msg'),
            loadingSpin: require('@/assets/images/spin.gif'),
            areaList: [],
            showSelect: false,
            appType: false,
            errorCodeList: '',
            errMsg: this.$t('error.field-empty-msg'),
            errDetail: false,
            searchResultAreaList: JSON.parse(sessionStorage.getItem('areaListData')),
        };
    },

    directives: { clickoutside },
    methods: {
        codeHandleClose() {
            this.showSelect = false;
        },
        goBack() {
            this.goStep1();
        },
        goStep1() {
            this.$router.push('/bookingdetails');
        },
        togglePassengerInfo(index) {
            this.guestData[index].showDetail = !this.guestData[index].showDetail;
            if (this.guestData[index].showDetail) {
                this.guestData[index].toggleText = this.$t('product.hide-details');
                this.errDetail = false;
            } else {
                this.guestData[index].toggleText = this.$t('product.show-details');
                this.errDetail = true;
            }
        },
        closeAreaCodeList(telabbr, ios2) {
            this.showAreaCodeList = false;
            this.phonePrefix = telabbr;
            this.ios2 = ios2;
        },
        whenFocusPhonePrefixInput() {
            if (/^\d+$/.test(this.phonePrefix)) {
                this.searchResultAreaList = this.areaList.filter(item => {
                    return item.telabbr.includes(this.phonePrefix);
                });
            }
            // 电话区号输入框输入字母时，按区号搜索
            if (/[a-z,A-Z]+/g.test(this.phonePrefix)) {
                this.searchResultAreaList = this.areaList.filter(item => {
                    return item.name.toLowerCase().includes(this.phonePrefix.toLowerCase());
                });
            }
        },
        searchAreaCodeResult() {
            // console.log(this.phonePrefix)
            // 电话区号输入框输入数字时，按区号搜索
            if (/^\d+$/.test(this.phonePrefix)) {
                this.searchResultAreaList = this.areaList.filter(item => {
                    return item.telabbr.includes(this.phonePrefix);
                });
            }
            // 电话区号输入框输入字母时，按区号搜索
            if (/[a-z,A-Z]+/g.test(this.phonePrefix)) {
                debugger
                this.searchResultAreaList = this.areaList.filter(item => {
                    return item.name.toLowerCase().includes(this.phonePrefix.toLowerCase());
                });
            }
            console.log(this.searchResultAreaList)

        },
        // 校验表单
        validatePhone() {
            if (!this.phonePrefix) {
                this.phonePrefixErr = true;
                return false;
            }
            if (!this.phone) {
                this.phoneErr = true;
                this.phoneErrMsg = this.$t('error.field-empty-msg');
                return false;
            }
            const phone = `+${this.phonePrefix}${this.phone}`;
            if (!validator.isMobilePhone(phone)) {
                this.phoneErr = true;
                this.phoneErrMsg = this.$t('error.phone-invalid');
                return false;
            }
            return true;
            /* eslint-disable */
        },
        validateEmail() {
            /* eslint-disable */
            const rule =
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            /* eslint-disable */
            if (!this.email) {
                this.emailErr = true;
                this.emailErrMsg = this.$t('error.field-empty-msg');
                return false;
            } else if (!rule.test(this.email)) {
                this.emailErr = true;
                this.emailErrMsg = this.$t('error.email-invalid');
                return false;
            }
            return true;
        },

        checkPassengerInfo() {
            if (!this.errorCodeList) {
                if (this.guestData.length > 0) {
                    this.guestData.forEach(v => {
                        if (!v.firstName.trim()) {
                            v.firstNameErr = true;
                            this.errMsg = this.$t('error.field-empty-msg');
                        }
                        if (!v.lastName.trim()) {
                            v.lastNameErr = true;
                            this.errMsg = this.$t('error.field-empty-msg');
                        }
                    });

                    const bol = this.guestData.every(item => {
                        return item.firstNameErr === false && item.lastNameErr === false;
                    });
                    return bol;
                }
            }
            return true;
        },

        validateEmptyField() {
            if (!this.phonePrefix) {
                this.phonePrefixErr = true;
            }
            if (!this.phone) {
                this.phoneErr = true;
                this.phoneErrMsg = this.$t('error.field-empty-msg');
            }
            if (!this.email) {
                this.emailErr = true;
                this.emailErrMsg = this.$t('error.field-empty-msg');
            }
            if (!this.errorCodeList) {
                if (this.guestData.length > 0) {
                    this.guestData.forEach(v => {
                        if (!v.firstName.trim()) {
                            v.firstNameErr = true;
                            this.errMsg = this.$t('error.field-empty-msg');
                        }
                        if (!v.lastName.trim()) {
                            v.lastNameErr = true;
                            this.errMsg = this.$t('error.field-empty-msg');
                        }
                    });
                }
            }

            const bol = this.guestData.every(item => {
                return item.firstNameErr === false && item.lastNameErr === false;
            });

            if (this.phonePrefix && this.phone && bol) {
                return true;
            }
            return false;
        },

        gotoReviewBooking() {
            /* eslint-disable */
            if (
                this.validateEmptyField() &&
                this.validatePhone() &&
                this.validateEmail() &&
                this.checkPassengerInfo()
            ) {
                let passengers = [];
                this.guestData.length > 0 &&
                    this.guestData.forEach((item, index) => {
                        passengers.push({
                            firstName: item.firstName,
                            lastName: item.lastName,
                            sort: index + 2,
                        });
                    });
                passengers.push({
                    firstName: this.firstName,
                    lastName: this.lastName,
                    phonePrefix: this.phonePrefix,
                    phone: this.phone,
                    email: this.email,
                    isLeaderPassenger: 1,
                    sort: 1,
                });
                sessionStorage.setItem('guestData', JSON.stringify(this.guestData));
                const orderNo = sessionStorage.getItem('orderNo'),
                    params = {
                        orderNo,
                        passengers,
                    };
                console.log(params);
                this.$toast.loading({
                    forbidClick: true,
                    duration: 0,
                    icon: this.loadingSpin,
                    className: 'loading-spin',
                });
                this.$http.booking.savePassengers(params).then(res => {
                    if (res.state === '11') {
                        this.$toast.clear();
                        this.$router.push({ path: '/reviewbooking' });
                    } else {
                        this.$toast.clear();
                        const errorCodeList = res.errorCodeList;
                        this.errorCodeList = errorCodeList;
                        this.errMsg = this.$t('error.name-invalid');
                        for (let i = 0; i < this.guestData.length; i++) {
                            this.guestData[i].firstNameErr = !errorCodeList[i].firstName;
                            this.guestData[i].lastNameErr = !errorCodeList[i].lastName;
                        }
                        res.note && this.$toast(res.note);
                    }
                });
            } else {
                console.log('校验不通过');
            }
            /* eslint-disable */
        },
        selectCountryCode() {
            if (document.documentElement.clientWidth <= 1024) {
                this.$refs.phonePrefixInput.readOnly = true;
                this.showAreaCodeList = true;
                this.showSelect = false;
            } else {
                this.showSelect = true;
            }
        },
        getSelectValue(item) {
            console.log(item.telabbr);
            this.showSelect = false;
            this.phonePrefix = item.telabbr;
        },

        passengerNameChange(index, _) {
            this.guestData[index][`${_}NameErr`] = false;
            this.errorCodeList = null;
        },
        getAreasAndGetUserInfo() {
            return Promise.all([this.$http.booking.getAreas(), this.$http.account
                .getAccountInfo({
                    bookingProcess: 1,
                    needMemberShipDetail: 0,
                })]).then((res) => {
                    this.$toast.clear();
                    if (res[0].state === '11') {
                        //   this.$toast.clear();
                        this.areaList = res[0].data;
                        // console.log(this.areaList)
                        sessionStorage.setItem('areaListData', JSON.stringify(this.areaList));
                    }
                    if (res[1].state === '11') {
                        // this.$toast.clear();
                        const { data } = res[1];
                        this.firstName = data.firstName;
                        this.lastName = data.lastName;
                        this.email = data.email;
                        this.phone = data.lastOrderPhoneNumber;
                        this.phonePrefix = data.lastOrderPhonePrefix;
                        this.phonePrefix &&
                            this.areaList.forEach(item => {
                                if (item.telabbr === this.phonePrefix) {
                                    this.ios2 = item.ios2;
                                }
                            });
                    } else {
                        res[1].note && this.$toast(res[1].note);
                    }
                });
        },
        // getAreas() {
        //   this.$http.booking.getAreas().then(res => {
        //     // if (res.state === '11') {
        //     //   //   this.$toast.clear();
        //     //   this.areaList = res.data;
        //     //   // console.log(this.areaList)
        //     //   sessionStorage.setItem('areaListData', JSON.stringify(this.areaList));
        //     // }
        //   });
        // },

        // getUserInfo() {
        //   this.$http.account
        //     .getAccountInfo({
        //       bookingProcess: 1,
        //       needMemberShipDetail: 0,
        //     })
        //     .then(res => {
        //       // if (res.state === '11') {
        //       //   // this.$toast.clear();
        //       //   const { data } = res;
        //       //   this.firstName = data.firstName;
        //       //   this.lastName = data.lastName;
        //       //   this.email = data.email;
        //       //   this.phone = data.lastOrderPhoneNumber;
        //       //   this.phonePrefix = data.lastOrderPhonePrefix;
        //       //   this.phonePrefix &&
        //       //     this.areaList.forEach(item => {
        //       //       if (item.telabbr === this.phonePrefix) {
        //       //         this.ios2 = item.ios2;
        //       //       }
        //       //     });
        //       // } else {
        //       //   res.note && this.$toast(res.note);
        //       // }
        //     });
        // },
    },

    watch: {
        // 监听输入框值  清除异常
        phonePrefix(val) {
            this.phonePrefix = val;
            if (this.phonePrefix) {
                this.phonePrefixErr = false;
            }
        },
        phone(val) {
            this.phone = val;
            if (this.phone) {
                this.phoneErr = false;
                this.phoneErrMsg = '';
            }
        },

        email(newVal) {
            if (newVal) {
                this.emailErr = false;
                this.emailErr = '';
            }
        },
        guestData: {
            handler(newVal, oldVal) {
                if (!this.errorCodeList) {
                    for (let i = 0; i < newVal.length; i++) {
                        // if (newVal[i].firstName.trim()) {
                        //   newVal[i].firstNameErr = false;
                        // }
                        // if (newVal[i].lastName.trim()) {
                        //   newVal[i].lastNameErr = false;
                        // }
                    }
                }
            },
            deep: true,
        },

        localeInit() {
            this.getAreas();
        },
    },

    mounted() {
        this.$toast.loading({
            forbidClick: true,
            duration: 0,
            icon: this.loadingSpin,
            className: 'loading-spin',
        });

        this.getAreasAndGetUserInfo();
        // 在页面内切换语种，确保区号列表取到对应语种数据
        sessionStorage.getItem('areaList') && sessionStorage.removeItem('areaList');

        this.passengerCount = Number(sessionStorage.getItem('personCount') || 1) - 1;
        const guestData = JSON.parse(sessionStorage.getItem('guestData')),
            appType = sessionStorage.getItem('appType');

        if (appType === 'web') {
            this.appType = true;
        }

        if (appType === 'web' && this.localeInit) {
            this.getAreas();
        }
        if (appType === 'app') {
            this.getAreas();
        }
        this.getUserInfo();

        if (this.passengerCount < 0) {
            return false;
        }

        for (let i = 0; i < this.passengerCount; i++) {
            this.guestData.push({
                firstName: ' ',
                firstNameErr: false,
                lastName: ' ',
                lastNameErr: false,
                showDetail: true,
                toggleText: this.$t('product.hide-details'),
            });
        }

        if (guestData) {
            if (guestData.length < this.passengerCount) {
                this.guestData = guestData;
                for (let i = 0; i <= this.passengerCount - guestData.length; i++) {
                    this.guestData.push({
                        firstName: ' ',
                        firstNameErr: false,
                        lastName: ' ',
                        lastNameErr: false,
                        showDetail: true,
                        toggleText: this.$t('product.hide-details'),
                    });
                }
            } else {
                this.guestData = guestData.slice(0, this.passengerCount);
            }
        }

        if (document.documentElement.clientWidth <= 1024) {
            this.$refs.phonePrefixInput.readOnly = true;
        }
    },

    computed: {
        phonePrefixErrComputed() {
            if (this.phonePrefixErr && !this.phoneErr) {
                return true;
            }
            return false;
        },

        ...mapState(['localeInit']),
    },
};
</script>
<style lang="scss" scoped>
@import './index.scss';
.mainContent {
  padding: 15px;
  .err-box {
    display: flex;
    align-items: center;
    padding: 0 0 20px;
    img {
      width: 30px;
      height: 30px;
      padding-right: 10px;
    }
    span {
      font-size: 16px;
      color: #d22a2f;
    }
  }
  .leadPassengerBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: justify;
    justify-content: space-between;
    .firstPassenger {
      padding-bottom: 10px;
      width: 45%;
      .inputTitle {
        font-size: 16px;
        @extend .ff-bold;
        color: #2d354c;
        padding: 10px 0;
      }
      .firstPassengerInput {
        height: 44px;
        width: 480px;
        background-color: #f0ede7;
        border-radius: 4px;
        .nameText {
          padding: 15px 12px;
          color: #bebebe;
          font-size: 14px;
          @extend .ff-book;
        }
      }
      .lastPassengerInput {
        @extend .firstPassengerInput;
        width: 440px !important;
      }
    }
  }
  .telEmailBox {
    display: flex;
    align-items: justify;
    justify-content: space-between;
    .telBox {
      display: flex;
      width: 532px;
    }
  }
  @media screen and (max-width: 1024px) {
    .leadPassengerBox {
      display: unset;
      .firstPassenger {
        padding-bottom: 10px;
        width: 100%;
        .inputTitle {
          font-size: 12px;
          @extend .ff-bold;
          color: #2d354c;
          padding: 10px 0;
        }
        .firstPassengerInput {
          height: 44px;
          width: 100%;
          background-color: #f0ede7;
          border-radius: 4px;
          .nameText {
            padding: 15px 12px;
            color: #bebebe;
            font-size: 14px;
            @extend .ff-book;
          }
        }
        .lastPassengerInput {
          @extend .firstPassengerInput;
          width: 100% !important;
        }
      }
    }
    .telEmailBox {
      display: unset;
      .telBox {
        display: unset;
        padding-bottom: 10px;
        .telNum {
          width: 60%;
        }
      }
      .emailBox {
        width: 100%;
      }
    }
  }

  @media screen and (max-width: 1024px) {
  }
  .telBox {
    .inputTitle {
      font-size: 16px;
      @extend .ff-bold;
      color: #2d354c;
      padding: 10px 0;
    }
    @media screen and (max-width: 1024px) {
      .inputTitle {
        font-size: 12px;
      }
    }
    .codeInput {
      position: relative;
      width: 28%;
      height: 44px;
      border: 1px solid #bebebe;
      border-radius: 4px;
      box-sizing: border-box;
      .area-flag {
        position: absolute;
        top: 21%;
        left: 12px;
        font-size: 22px;
        @extend .ff-book;
      }
      .code {
        width: 80%;
        height: 42px;
        font-size: 14px;
        @extend .ff-book;
        padding: 0 16px;
        box-sizing: border-box;
      }
    }

    .telNum {
      height: 44px;
      width: 54%;
      padding: 0 12px;
      font-size: 14px;
      @extend .ff-book;
      border-radius: 4px;
      border: 1px solid #bebebe;
      box-sizing: border-box;
    }
  }
  .emailBox {
    padding-bottom: 10px;
    width: 45%;
    .inputTitle {
      font-size: 16px;
      @extend .ff-bold;
      color: #2d354c;
      padding: 10px 0;
    }
    @media screen and (max-width: 1024px) {
      .inputTitle {
        font-size: 12px;
      }
    }
    .email {
      height: 44px;
      width: 96%;
      font-size: 14px;
      @extend .ff-book;
      padding: 0 12px;
      border-radius: 4px;
      border: 1px solid #bebebe;
      box-sizing: border-box;
    }
    @media screen and (max-width: 1024px) {
      .email {
        width: 100%;
      }
    }
  }
  .secondBox {
    background-color: #ffffff;
    border-radius: 8px;
    text-align: left;
    margin-bottom: 16px;
    box-shadow: 3px 3px 10px #00000033;
    .content {
      padding: 30px 60px;
      .part-box {
        display: flex;
        align-items: justify;
        justify-content: space-between;
        .inputBox {
          padding-bottom: 10px;
          width: 480px;
          padding-right: 20px;
          .inputTitle {
            font-size: 16px;
            @extend .ff-bold;
            color: #2d354c;
            padding: 10px 0;
          }
          .inputCell {
            height: 44px;
            width: 100%;
            border: 1px solid #bebebe;
            border-radius: 4px;
            text-indent: 12px;
          }
        }
        .inputBox2 {
          @extend .inputBox;
          width: 440px;
        }
      }
      .title {
        font-size: 20px;
        @extend .ff-bold;
        color: #2d354c;
        padding-bottom: 6px;
      }
      @media screen and (max-width: 1024px) {
        .title {
          font-size: 16px;
        }
      }
      .show {
        font-size: 14px;
        font-weight: bold;
        color: #f38b00;
        cursor: pointer;
      }
      @media screen and (max-width: 1024px) {
        .part-box {
          display: unset;
          .inputBox {
            width: 100%;
            .inputTitle {
              font-size: 12px;
            }
          }
        }
      }
    }
    @media screen and (max-width: 1024px) {
      .content {
        padding: 16px;
      }
    }
  }
}
</style>

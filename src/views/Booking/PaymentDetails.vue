<template>
  <div class="bg">
    <!-- 加多一层div，是为了避免页面mounted加载接口数据导致v-if的div不显示，header和footer贴合在一起 -->
    <div v-if="billData">
      <!-- nav部分 -->
      <Header :navTitle="$t('account.fast-track')" @goBack="goBack" />
      <div class="bread-crumb" v-show="appType">
        <router-link to="/">{{ $t('product.home') }}</router-link>
        <span>&gt;</span>
        <router-link to="/airport">{{ $t('home.btn-select-airport') }}</router-link>
        <span>&gt;</span>{{ $t('product.book') }}
        <h1 class="mainTitle">{{ $t('product.book') }}</h1>
      </div>
      <ProgressBarWeb index="4" class="webBar" />
      <ProgressBar
        class="h5Bar"
        :thisStep="$t('product.payment-datails')"
        rate="100"
        :circleText="$t('product.4-of-4')"
      />
      <div class="mainContent">
        <div class="to-back" v-show="appType">
          <div class="click" @click="goStep3">
            <div class="iconBack"></div>
            <span class="text">{{ $t('basic.page-back') }}</span>
          </div>
        </div>
        <div class="error-about-tc" v-show="tcError">
          <div class="icon-error"></div>
          <div class="desc">{{ $t('product.error-about-tc') }}</div>
        </div>
        <div class="part-box">
          <div class="part1">
            <div class="entitlement-wrapper" v-if="showEquity">
              <div class="entitlement-title">
                <img class="entitlementIcon" src="@/assets/images/icon-freetrip.svg" slot="icon" />
                {{ $t('product.eligible-free') }}
              </div>

              <!-- 1. CH & Guest Unlmited -->
              <div class="free-trip-wrapper" v-if="equityType === 1">
                <div class="free-trip-item">
                  <div class="free-trip">
                    <div class="free-trip-title">{{ $t('product.cardholder-and-guest') }}</div>
                    <div class="free-trip-desc">{{ $t('product.unlimited') }}</div>
                  </div>
                  <div class="applied">{{ $t('product.applied') }}</div>
                </div>
              </div>

              <!-- 2. CH: Unlimited ， Guest: * Visits -->
              <div v-if="equityType === 2">
                <div class="free-trip-wrapper">
                  <div class="free-trip-item">
                    <div class="free-trip">
                      <div class="free-trip-title">{{ $t('product.free-cardholder-pass') }}</div>
                      <div class="free-trip-desc">{{ $t('product.unlimited') }}</div>
                    </div>
                    <div class="applied">{{ $t('product.applied') }}</div>
                  </div>
                </div>
                <div
                  class="free-trip-wrapper free-trip-limited-wrapper ch-unlimted-g-v"
                  v-if="personCount > 1 && equity.remainPoint > 0"
                >
                  <div class="free-trip-item">
                    <div class="free-trip">
                      <div class="free-trip-title">{{ $t('product.free-guest-pass') }}</div>
                      <div class="free-trip-desc">
                        {{ $t('product.left') }}: {{ equity.remainPoint - usePoint }}
                      </div>
                    </div>
                    <div class="selector">
                      <div
                        class="btn-handle btn-minus"
                        :class="{ 'btn-minus-disabled': usePoint === 0 }"
                        @click="handleMinusUsePoint"
                      ></div>
                      <div class="num">{{ usePoint }}</div>
                      <div
                        class="btn-handle btn-plus"
                        :class="{
                          'btn-plus-disabled':
                            usePoint >= guestCount || usePoint >= equity.remainPoint,
                        }"
                        @click="handlePlusUsePoint(2)"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3. CH： Unlimited,  Guest: No entitlement -->
              <div class="free-trip-wrapper" v-if="equityType === 3">
                <div class="free-trip-item">
                  <div class="free-trip">
                    <div class="free-trip-title">{{ $t('product.free-cardholder-pass') }}</div>
                    <div class="free-trip-desc">{{ $t('product.unlimited') }}</div>
                  </div>
                  <div class="applied">{{ $t('product.applied') }}</div>
                </div>
              </div>

              <!-- 4. CH+ Guest : * visits -->
              <div class="free-trip-wrapper free-trip-limited-wrapper" v-if="equityType === 4">
                <div class="free-trip-item">
                  <div class="free-trip">
                    <div class="free-trip-title">{{ $t('product.free-cardholder-guest') }}</div>
                    <div class="free-trip-desc">
                      {{ $t('product.left') }}: {{ equity.remainPoint - usePoint }}
                    </div>
                  </div>
                  <div class="selector">
                    <div
                      class="btn-handle btn-minus"
                      :class="{ 'btn-minus-disabled': usePoint === 0 }"
                      @click="handleMinusUsePoint"
                    ></div>
                    <div class="num">{{ usePoint }}</div>
                    <div
                      class="btn-handle btn-plus"
                      :class="{
                        'btn-plus-disabled':
                          usePoint >= personCount || usePoint >= equity.remainPoint,
                      }"
                      @click="handlePlusUsePoint(4)"
                    ></div>
                  </div>
                </div>
              </div>

              <!-- 5. CH： * visits,  Guest: No entitlement -->
              <div class="free-trip-wrapper free-trip-limited-wrapper" v-if="equityType === 5">
                <div class="free-trip-item">
                  <div class="free-trip">
                    <div class="free-trip-title">{{ $t('product.free-cardholder-pass') }}</div>
                    <div class="free-trip-desc">
                      {{ $t('product.left') }}: {{ equity.remainPoint - usePoint }}
                    </div>
                  </div>
                  <div class="applied btn-remove" v-show="usePoint > 0" @click="removePoints">
                    {{ $t('product.remove') }}
                  </div>
                  <div class="btn-apply" v-show="usePoint <= 0" @click="applyPoint">
                    {{ $t('product.apply') }}
                  </div>
                </div>
              </div>
            </div>

            <!-- paycard -->
            <div
              class="pay-card-wrapper"
              :class="{ 'pay-card-wrapper-gray': Number(billData.totalComputed) === 0 }"
            >
              <div class="pay-card-desc">
                <img src="@/assets/images/icon-pay-securely@2x.png" alt="" />
                <div>{{ $t('product.pay-sas') }}</div>
              </div>

              <div class="pay-card">
                <img src="@/assets/images/logo-mc-header@2x.png" alt="" />
                <div>{{ $t('product.pay-card') }} {{ last4CardNo }}</div>
              </div>
            </div>

            <!-- Billing Details -->
            <div class="billing-details" v-show="billData.totalComputed > 0">
              <div class="bill-title">{{ $t('product.billing-details') }}</div>
              <!-- <div style="font-size: 14px; padding: 0 0 16px">* indicates a required field</div> -->
              <div class="form-item">
                <div class="label">{{ $t('product.postal-code') }}*</div>
                <input
                  class="form-input"
                  :class="{ 'form-input-error': postalCodeErr }"
                  type="text"
                  maxlength="50"
                  v-model="postalCode"
                  autocomplete="off"
                  :disabled="showInputPwd"
                  @keyup="btKeyUp"
                />
              </div>
              <div class="error-msg" v-show="postalCodeErr">{{ $t('error.field-empty-msg') }}</div>
            </div>
          </div>

          <div class="part2">
            <!-- Total -->
            <div class="total-wrapper">
              <div v-if="equityType === 1">
                <div class="summary">{{ $t('product.booking-summary') }}</div>
                <div class="total">
                  <div class="total-title">{{ $t('product.total') }}</div>
                  <div>{{ currencySymbol }} {{ billData.totalComputed }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">
                    {{ personCount }}
                    {{
                      personCount > 1
                        ? $t('product.booking-passengers')
                        : $t('product.booking-passenger')
                    }}
                  </div>
                  <div class="bill-price">{{ currencySymbol }}{{ billData.totalPrice }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">{{ $t('product.free-pass-cardholder') }}</div>
                  <div class="bill-price">
                    -{{ currencySymbol }}{{ billData.cardholderDiscount }}
                  </div>
                </div>
                <div class="bill-item" v-if="personCount > 1">
                  <div class="bill-label">
                    {{ personCount - 1 }} {{ $t('product.free') }}
                    {{ personCount - 1 > 1 ? $t('product.passes') : $t('product.pass') }} -
                    {{ $t('product.guest1') }}
                  </div>
                  <div class="bill-price">-{{ currencySymbol }}{{ billData.guestDiscount }}</div>
                </div>
              </div>

              <div v-if="equityType === 2">
                <div class="summary">{{ $t('product.booking-summary') }}</div>
                <div class="total">
                  <div class="total-title">{{ $t('product.total') }}</div>
                  <div>{{ currencySymbol }} {{ billData.totalComputed }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">
                    {{ personCount }}
                    {{
                      personCount > 1
                        ? $t('product.booking-passengers')
                        : $t('product.booking-passenger')
                    }}
                  </div>
                  <div class="bill-price">{{ currencySymbol }}{{ billData.totalPrice }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">{{ $t('product.free-pass-cardholder') }}</div>
                  <div class="bill-price">
                    -{{ currencySymbol }}{{ billData.cardholderDiscount }}
                  </div>
                </div>
                <div class="bill-item" v-if="personCount > 1 && equity.remainPoint > 0">
                  <div class="bill-label">
                    {{ usePoint }} {{ $t('product.free') }}
                    {{ usePoint > 1 ? $t('product.passes') : $t('product.pass') }} -
                    {{ $t('product.guest1') }}
                  </div>
                  <div class="bill-price">-{{ currencySymbol }}{{ billData.guestDiscount }}</div>
                </div>
              </div>

              <div v-if="equityType === 3">
                <div class="summary">{{ $t('product.booking-summary') }}</div>
                <div class="total">
                  <div class="total-title">{{ $t('product.total') }}</div>
                  <div>{{ currencySymbol }} {{ billData.totalComputed }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">
                    {{ personCount }}
                    {{
                      personCount > 1
                        ? $t('product.booking-passengers')
                        : $t('product.booking-passenger')
                    }}
                  </div>
                  <div class="bill-price">{{ currencySymbol }}{{ billData.totalPrice }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">{{ $t('product.free-pass-cardholder') }}</div>
                  <div class="bill-price">
                    -{{ currencySymbol }}{{ billData.cardholderDiscount }}
                  </div>
                </div>
              </div>

              <div v-if="equityType === 4">
                <div class="summary">{{ $t('product.booking-summary') }}</div>
                <div class="total">
                  <div class="total-title">{{ $t('product.total') }}</div>
                  <div>{{ currencySymbol }} {{ billData.totalComputed }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">
                    {{ personCount }}
                    {{
                      personCount > 1
                        ? $t('product.booking-passengers')
                        : $t('product.booking-passenger')
                    }}
                  </div>
                  <div class="bill-price">{{ currencySymbol }}{{ billData.totalPrice }}</div>
                </div>
                <div class="bill-item" v-show="billData.cardholderDiscount > 0">
                  <div class="bill-label">{{ $t('product.free-pass-cardholder') }}</div>
                  <div class="bill-price">
                    -{{ currencySymbol }}{{ billData.cardholderDiscount }}
                  </div>
                </div>
                <div
                  class="bill-item"
                  v-if="personCount > 1 && usePoint > 1 && equity.remainPoint > 0"
                >
                  <div class="bill-label">
                    {{ usePoint - 1 }} {{ $t('product.free') }}
                    {{ usePoint - 1 > 1 ? $t('product.passes') : $t('product.pass') }} -
                    {{ $t('product.guest1') }}
                  </div>
                  <div class="bill-price">-{{ currencySymbol }}{{ billData.guestDiscount }}</div>
                </div>
              </div>

              <div v-if="equityType === 5">
                <div class="summary">{{ $t('product.booking-summary') }}</div>
                <div class="total">
                  <div class="total-title">{{ $t('product.total') }}</div>
                  <div>{{ currencySymbol }} {{ billData.totalComputed }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">
                    {{ personCount }}
                    {{
                      personCount > 1
                        ? $t('product.booking-passengers')
                        : $t('product.booking-passenger')
                    }}
                  </div>
                  <div class="bill-price">{{ currencySymbol }}{{ billData.totalPrice }}</div>
                </div>
                <div class="bill-item" v-show="billData.cardholderDiscount > 0">
                  <div class="bill-label">{{ $t('product.free-pass-cardholder') }}</div>
                  <div class="bill-price">
                    -{{ currencySymbol }}{{ billData.cardholderDiscount }}
                  </div>
                </div>
              </div>

              <div v-if="equityType === 6">
                <div class="summary">{{ $t('product.booking-summary') }}</div>
                <div class="total">
                  <div class="total-title">{{ $t('product.total') }}</div>
                  <div>{{ currencySymbol }} {{ billData.totalComputed }}</div>
                </div>
                <div class="bill-item">
                  <div class="bill-label">
                    {{ personCount }}
                    {{
                      personCount > 1
                        ? $t('product.booking-passengers')
                        : $t('product.booking-passenger')
                    }}
                  </div>
                  <div class="bill-price">{{ currencySymbol }}{{ billData.totalPrice }}</div>
                </div>
              </div>

              <div class="note" v-if="note && billData.totalComputed * 1 === 0">
                <div class="note-title">{{ $t('product.notes') }}</div>
                <div class="note-text">{{ note }}</div>
              </div>
              <div class="total2">
                <div class="total-title">{{ $t('product.total') }}</div>
                <div>{{ currencySymbol }} {{ billData.totalComputed }}</div>
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="terms-N-conditions">
              <div class="title">{{ $t('basic.terms-and-conditions') }}</div>
              <div class="content">
                <div
                  class="icon-tickbox"
                  :class="{ actived: checked }"
                  @click="handleClickTickbox"
                ></div>
                <div v-html="$t('product.terms', { target: linkTarget })" class=""></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Book Now -->
      <div class="btn-continue">
        <SubmitBtn :text="$t('home.book-now')" @click.native="handleBook" />
      </div>

      <!-- Enter password -->
      <van-popup class="popup" v-model="showInputPwd">
        <!-- <div class="popup"> -->
        <div class="close" @click="handeCloseInputPwd"></div>
        <div class="content">
          <div class="desc">{{ $t('product.popup-desc') }}</div>

          <div class="password">
            <!-- <div style="font-size: 14px; padding: 0 0 24px">* indicates a required field</div> -->
            <div class="label">{{ $t('product.psw') }}*</div>
            <div class="password-wrapper" :class="{ 'input-pwd-err': passwordErr }">
              <input class="input-pwd" :type="pwdInputType" v-model="password" autocomplete="off" />
              <span :class="{ 'eye-off': pwdInputType === 'text' }" @click="changePwdType" />
            </div>
          </div>
          <div class="pwd-err-msg" v-show="passwordErr">{{ passwordErrMsg }}</div>
          <div class="pay" @click="handlePay">{{ $t('product.pay') }}</div>
        </div>
        <!-- </div> -->
      </van-popup>
    </div>
  </div>
</template>
<script>
  /* eslint-disable */
  import Header from '@/components/Header.vue';
  import BoxBg from '@/components/BoxBg.vue';
  import ProgressBar from '@/views/Booking/components/ProgressBar.vue';
  import ProgressBarWeb from '@/views/Booking/components/ProgressBarWeb.vue';
  import SubmitBtn from '@/views/Booking/components/SubmitBtn.vue';
  import { Popup } from 'vant';

  export default {
    data() {
      return {
        checked: false,
        showInputPwd: false,
        equity: {
          isCardHolderUnlimited: true,
          allowGuestUse: true,
          isGuestUnlimited: false,
          remainPoint: 3,
          initPoint: 3,
          hasCipEquity: true,
        },
        note: null,
        last4CardNo: null,
        personCount: null,
        price: null,
        usePoint: 0,
        equityType: null,
        tcError: false,
        postalCode: '',
        postalCodeErr: false,
        password: '',
        passwordErr: false,
        passwordErrMsg: '',
        pwdInputType: 'password',
        currencySymbol: null,
        loadingSpin: require('@/assets/images/spin.gif'),
        appType: false,
      };
    },

    mounted() {
      const orderNo = sessionStorage.getItem('orderNo'),
        appType = sessionStorage.getItem('appType');
      if (!orderNo) {
        this.$router.push('/bookingdetails');
      }
      this.orderNo = orderNo;
      this.payPreview();
      if (appType === 'web') {
        this.appType = true;
      }
    },

    components: {
      Header,
      BoxBg,
      ProgressBar,
      ProgressBarWeb,
      [Popup.name]: Popup,
      SubmitBtn,
    },

    methods: {
      goStep3() {
        this.$router.push('/reviewbooking');
      },
      changePwdType() {
        if (this.pwdInputType === 'password') {
          this.pwdInputType = 'text';
        } else {
          this.pwdInputType = 'password';
        }
      },

      btKeyUp(e) {
        e.target.value = e.target.value.replace(/[@#\$%\^&\*\!\(\)\'\;\.\/\,\[\]\{\}]+/g, '');
      },

      payPreview() {
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          icon: this.loadingSpin,
          className: 'loading-spin',
        });
        this.$http.booking
          .payPreview({
            orderNo: this.orderNo,
          })
          .then(res => {
            this.$toast.clear();
            if (res.state === '11') {
              const {
                data: { equity, note, last4CardNo, personCount, price, currencySymbol },
              } = res;
              this.equity = equity;
              this.note = note;
              this.last4CardNo = last4CardNo;
              this.personCount = personCount;
              this.price = price;
              this.currencySymbol = currencySymbol;

              if ((equity && !equity.hasCipEquity) || !equity) {
                this.equityType = 6;
              }
              if (equity.isCardHolderUnlimited && equity.allowGuestUse && equity.isGuestUnlimited) {
                this.equityType = 1;
              }
              if (
                equity.isCardHolderUnlimited &&
                equity.allowGuestUse &&
                !equity.isGuestUnlimited
              ) {
                this.equityType = 2;
                if (personCount > 1 && equity.remainPoint > 0) {
                  this.usePoint =
                    personCount - 1 > equity.remainPoint ? equity.remainPoint : personCount - 1;
                } else {
                  this.usePoint = 0;
                }
              }
              if (equity.isCardHolderUnlimited && !equity.allowGuestUse) {
                this.equityType = 3;
              }
              if (
                !equity.isCardHolderUnlimited &&
                equity.allowGuestUse &&
                !equity.isGuestUnlimited
              ) {
                this.equityType = 4;
                if (personCount > 0 && equity.remainPoint > 0) {
                  this.usePoint =
                    personCount > equity.remainPoint ? equity.remainPoint : personCount;
                } else {
                  this.usePoint = 0;
                }
              }
              if (!equity.isCardHolderUnlimited && !equity.allowGuestUse) {
                this.equityType = 5;
                if (personCount > 0 && equity.remainPoint > 0) {
                  this.usePoint = 1;
                } else {
                  this.usePoint = 0;
                }
              }
            } else {
              res.note && this.$toast(res.note);
            }
          })
          .catch(() => {
            this.$toast.clear();
          });
      },

      handlePay() {
        if (!this.password) {
          this.passwordErr = true;
          this.passwordErrMsg = this.$t('error.field-empty-msg');
          return;
        }

        this.payCheck();
      },

      handeCloseInputPwd() {
        this.showInputPwd = false;
        this.password = '';
        this.passwordErr = false;
      },

      handleClickTickbox() {
        this.checked = !this.checked;
        if (this.checked) {
          this.tcError = false;
        }
      },

      handleBook() {
        if (!this.checked) {
          this.tcError = true;
          window.scrollTo(0, 0);
          return;
        }

        if (this.billData.totalComputed > 0 && !this.postalCode.trim()) {
          this.postalCodeErr = true;
          return;
        }

        if (this.billData.totalComputed > 0) {
          this.showInputPwd = true;
          return;
        }
        this.payCheck();
      },

      payCheck() {
        this.$toast.loading({
          forbidClick: true,
          duration: 0,
          icon: this.loadingSpin,
          className: 'loading-spin',
        });
        this.$http.booking
          .payCheck({
            orderNo: this.orderNo,
            totalAmount: this.billData.totalComputed,
            usePoint: this.usePoint,
            password: this.password,
          })
          .then(res => {
            if (res.state === '11') {
              this.$toast.clear();
              const {
                data: { ticket, paymentId },
              } = res;
              this.toBookingLoading(ticket, paymentId);
            } else if (res.state === '00' && res.errorCode === 'err_pwd_incorrect') {
              this.$toast.clear();
              this.passwordErr = true;
              this.passwordErrMsg = this.$t('error.pwd-incorrect');
            } else {
              this.$toast.clear();
              res.note && this.$toast(res.note);
            }
          })
          .catch(res => {
            res.note && this.$toast(res.note);
          });
      },

      toBookingLoading(ticket, paymentId) {
        const data = {
          orderNo: this.orderNo,
          ticket,
          paymentId,
          totalAmount: this.billData.totalComputed,
          usePoint: this.usePoint,
          billingDetails: {
            postalCode: this.postalCode,
          },
        };
        this.$router.push({
          name: 'BookingLoading',
          params: data,
        });
      },

      handleMinusUsePoint() {
        if (this.usePoint === 0) {
          return;
        } else {
          this.usePoint--;
        }
      },

      handlePlusUsePoint(type) {
        if (
          (type === 2) &
          (this.usePoint >= this.guestCount || this.usePoint >= this.equity.remainPoint)
        ) {
          return;
        }
        if (
          (type === 4) &
          (this.usePoint >= this.personCount || this.usePoint >= this.equity.remainPoint)
        ) {
          return;
        }
        this.usePoint++;
      },

      removePoints() {
        this.usePoint = 0;
      },

      applyPoint() {
        this.usePoint = 1;
      },

      goBack() {
        this.goStep3();
      },
    },

    computed: {
      currentType() {
        const type = sessionStorage.getItem('appType');
        return type === 'app' ? 'app' : 'website';
      },

      linkTarget() {
        return this.currentType === 'app' ? '_self' : '_blank';
      },

      showEquity() {
        if (this.equity && this.equity.hasCipEquity) {
          if ((this.equityType === 4 || this.equityType === 5) && this.equity.remainPoint <= 0) {
            return false;
          }
          return true;
        }
        return false;
      },

      guestCount() {
        return this.personCount - 1;
      },

      billData() {
        switch (this.equityType) {
          case 1:
            return {
              totalPrice: (this.personCount * this.price).toFixed(2),
              cardholderDiscount: this.price.toFixed(2),
              guestDiscount: ((this.personCount - 1) * this.price).toFixed(2),
              totalComputed: (
                this.personCount * this.price -
                this.price * 1 -
                this.guestCount * this.price
              ).toFixed(2),
            };
            break;

          case 2:
            return {
              totalPrice: (this.personCount * this.price).toFixed(2),
              cardholderDiscount: this.price.toFixed(2),
              guestDiscount: (this.usePoint * this.price).toFixed(2),
              totalComputed: (
                this.personCount * this.price -
                this.price * 1 -
                this.usePoint * this.price
              ).toFixed(2),
            };
            break;

          case 3:
            return {
              totalPrice: (this.personCount * this.price).toFixed(2),
              cardholderDiscount: this.price.toFixed(2),
              guestPrice: (this.guestCount * this.price).toFixed(2),
              totalComputed: (this.personCount * this.price - this.price * 1).toFixed(2),
            };
            break;

          case 4:
            return {
              totalPrice: (this.personCount * this.price).toFixed(2),
              cardholderDiscount: this.usePoint >= 1 ? this.price.toFixed(2) : 0,
              guestDiscount: ((this.usePoint - 1) * this.price).toFixed(2),
              totalComputed: (
                this.personCount * this.price -
                this.price * 1 -
                (this.usePoint - 1) * this.price
              ).toFixed(2),
            };
            break;

          case 5:
            return {
              totalPrice: (this.personCount * this.price).toFixed(2),
              cardholderDiscount: this.usePoint >= 1 ? this.price.toFixed(2) : 0,
              totalComputed: (
                this.personCount * this.price -
                this.price * 1 -
                (this.usePoint - 1) * this.price
              ).toFixed(2),
            };
            break;

          case 6:
            return {
              totalPrice: (this.personCount * this.price).toFixed(2),
              totalComputed: (this.personCount * this.price).toFixed(2),
            };
            break;
        }
      },
    },

    watch: {
      postalCode(newVal) {
        if (newVal) {
          this.postalCodeErr = false;
        }
      },
      password(newVal) {
        if (newVal) {
          this.passwordErr = false;
        }
      },
    },
  };
  /* eslint-disable */
</script>
<style lang="scss" scoped>
  @import '@/assets/css/variables.scss';
  @import './index.scss';

  .bg {
    .mainContent {
      padding: 16px;
      .error-about-tc {
        display: flex;
        line-height: 22px;
        font-size: 14px;
        align-items: center;
        padding-bottom: 16px;
        color: #d22a2f;
        .icon-error {
          width: 29px;
          height: 29px;
          margin-right: 6px;
          background: url('~img/icn-error@2x.png') no-repeat;
          background-size: contain;
        }
        .desc {
          flex: 1;
        }
      }
      .entitlement-wrapper {
        font-size: 14px;
        @extend .ff-bold;
        @include cardBox(16px, 16px, 16px, 16px);
        .entitlement-title {
          display: flex;
          align-items: center;
          margin-bottom: 18px;
          .entitlementIcon {
            height: 26px;
            width: 22px;
            margin-right: 16px;
          }
        }
        .free-trip-wrapper {
          .free-trip-item {
            display: flex;
            padding: 0 0 10px 0;
            .free-trip {
              flex: 1;
              .free-trip-title {
                padding-bottom: 4px;
              }
              .free-trip-desc {
                color: #c3c0b8;
              }
            }
            .applied {
              font-size: 16px;
              color: #f38b00;
            }
          }
        }
        .free-trip-limited-wrapper {
          .free-trip-item {
            margin-top: 12px;
            padding-bottom: 4px;
            .selector {
              display: flex;
              margin-left: 10px;
              .num {
                width: 42px;
                height: 26px;
                line-height: 26px;
                font-size: 18px;
                text-align: center;
              }
              .btn-handle {
                width: 26px;
                height: 26px;
                background-repeat: no-repeat;
                background-size: contain;
              }
              .btn-minus {
                background-image: url('../../assets/images/btn-minus-2@2x.png');
                &.btn-minus-disabled {
                  background-image: url('../../assets/images/btn-minus-disabled@2x.png');
                }
              }
              .btn-plus {
                background-image: url('../../assets/images/btn-plus-2@2x.png');
                &.btn-plus-disabled {
                  background-image: url('../../assets/images/btn-plus-disabled@2x.png');
                }
              }
            }
            .btn-remove {
              margin-left: auto;
              text-decoration: underline;
              cursor: pointer;
            }
            .btn-apply {
              width: 100px;
              height: 30px;
              line-height: 30px;
              font-size: 16px;
              margin-left: auto;
              color: #ffffff;
              text-align: center;
              border-radius: 4px;
              background: #ff8c00;
              cursor: pointer;
            }
          }
        }
        .ch-unlimted-g-v {
          border-top: 1px solid #e3e3e3;
        }
      }

      .pay-card-wrapper {
        @include cardBox(9px, 14px, 15px, 14px);
        .pay-card-desc {
          display: flex;
          height: 20px;
          align-items: center;
          margin-bottom: 18px;
          img {
            width: 20px;
            height: 20px;
            margin-right: 10px;
          }
        }
        .pay-card {
          display: flex;
          height: 20px;
          align-items: center;
          img {
            width: 28px;
          }
          div {
            padding-left: 10px;
            @extend .ff-bold;
          }
        }
        &.pay-card-wrapper-gray {
          color: #c3c0b9;
          background-color: #f4f4f4;
        }
      }

      .billing-details {
        @include cardBox(16px, 24px, 24px, 24px);
        .bill-title {
          font-size: 16px;
          @extend .ff-bold;
          padding-bottom: 16px;
        }
        .form-item {
          .label {
            font-size: 12px;
            @extend .ff-bold;
            margin-bottom: 10px;
            color: #2d354c;
          }
          .form-input {
            width: 100%;
            font-size: 14px;
            padding: 11px 12px;
            border: 1px solid #bebebe;
            border-radius: 4px;
            box-sizing: border-box;
            &.form-input-error {
              border-color: #d22a2f;
            }
          }
        }
        .error-msg {
          line-height: 22px;
          font-size: 14px;
          color: #d22a2f;
          margin-top: 8px;
        }
      }

      .total-wrapper {
        @include cardBox(16px, 15px, 16px, 15px);
        .summary {
          font-size: 24px;
          font-weight: bold;
          padding: 24px 12px;
        }
        .total {
          display: none;
        }
        @media screen and (max-width: 1024px) {
          .ff-bold-media {
            font-family: 'MarkForMC-Bold';
          }
          .lang-ru-RU {
            .ff-bold-media {
              font-family: 'FuturaPTW10-Bold';
            }
          }
          .lang-el-GR {
            .ff-bold-media {
              font-family: 'FuturaPlusW15-Bold';
            }
          }
          .summary {
            display: none;
          }
          .total {
            display: flex;
            font-size: 18px;
            @extend .ff-bold-media;
            padding-bottom: 16px;
            justify-content: space-between;
          }
          .total2 {
            display: none !important;
          }
        }
        .total2 {
          display: flex;
          font-size: 24px;
          @extend .ff-bold-media;
          margin: 20px 8px 10px 8px;
          padding-top: 18px;
          border-top: 2px solid #d1d1d1;
          justify-content: space-between;
        }
        .bill-item {
          display: flex;
          font-size: 14px;
          padding-bottom: 8px;
          margin: 0 12px;
          justify-content: space-between;
        }
        @media screen and (max-width: 1024px) {
          .bill-item {
            margin: 0;
          }
        }
        .note {
          font-size: 14px;
          .note-title {
            @extend .ff-bold;
            padding-bottom: 8px;
            margin: 0 12px;
            text-decoration: underline;
            padding-top: 12px;
          }
          .note-text {
            line-height: 20px;
            margin: 0 12px;
          }
          @media screen and (max-width: 1024px) {
            .note-title {
              margin: 0;
            }
            .note-text {
              margin: 0;
            }
          }
        }
      }

      @media screen and (max-width: 1024px) {
        .terms-N-conditions {
          @include cardBox(16px, 16px, 16px, 16px);
        }
      }

      .terms-N-conditions {
        padding: 16px;
        .title {
          font-size: 16px;
          @extend .ff-bold;
          padding-bottom: 10px;
        }
        .content {
          position: relative;
          padding-left: 32px;
          line-height: 24px;
          font-size: 14px;
          .icon-tickbox {
            position: absolute;
            width: 24px;
            height: 24px;
            top: 0;
            left: 0;
            background-image: url('../../assets/images/empty-tickbox@2x.png');
            background-repeat: no-repeat;
            background-size: contain;
            cursor: pointer;
            &.actived {
              background-image: url('../../assets/images/ticked-box@2x.png');
            }
          }
          a {
            @extend .ff-bold;
            text-decoration: underline;
            color: #ff671b;
          }
        }
      }
    }
    .book-btn-wrapper {
      display: flex;
      height: 88px;
      justify-content: center;
      align-items: center;
      background-color: #f0ede7;
      .book-btn {
        @include confirmBtn();
        width: 80%;
      }
    }

    // .popup-bg {
    //   position: fixed;
    //   top: 0;
    //   right: 0;
    //   bottom: 0;
    //   left: 0;
    //   background: rgba(0, 0, 0, 0.6);
    //   z-index: 101;
    @media screen and (max-width: 1024px) {
      .popup {
        position: fixed !important;
        bottom: 0 !important;
        left: 0 !important;
        right: 0 !important;
        top: unset !important;
        transform: unset !important;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
    }
    .popup {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 10px;
      background: #fff;
      .close {
        width: 40px;
        height: 40px;
        background: url('~img/btn-close@2x.png') no-repeat;
        background-size: contain;
      }
      .content {
        width: 90%;
        line-height: 18px;
        font-size: 14px;
        margin: 0 auto;
        padding: 12px 0;
        .desc {
          padding-bottom: 16px;
        }
        .password {
          .label {
            @extend .ff-bold;
            margin-bottom: 8px;
          }
          .password-wrapper {
            position: relative;
            display: flex;
            width: 100%;
            height: 46px;
            padding: 0 52px 0 12px;
            border: 1px solid #bebebe;
            border-radius: 4px;
            box-sizing: border-box;
            &.input-pwd-err {
              border-color: #d22a2f;
            }
            .input-pwd {
              flex: 1;
            }
            span {
              position: absolute;
              width: 28px;
              height: 28px;
              top: 9px;
              right: 12px;
              background-image: url('~img/icon-feather-eye-on@2x.png');
              background-repeat: no-repeat;
              background-size: contain;
              &.eye-off {
                background-image: url('~img/icon-feather-eye-off@2x.png');
              }
            }
          }
        }
        .pwd-err-msg {
          margin-top: 8px;
          color: #d22a2f;
        }
        .pay {
          margin-top: 16px;
          @include confirmBtn();
        }
      }
      // }
    }
  }

  ::v-deep .van-popup--center {
    top: auto;
    left: auto;
    transform: none;
  }

  @media screen and (max-width: 320px) {
    .bg .mainContent .entitlement-wrapper .free-trip-limited-wrapper .free-trip-item .btn-apply {
      width: 80px;
      height: 36px;
      line-height: 36px;
      font-size: 14px;
    }
  }
  .part-box {
    display: flex;
    flex-flow: wrap;
    align-items: justify;
    justify-content: space-between;
    .part1 {
      width: 500px;
    }
    .part2 {
      width: 570px;
    }
  }

  @media screen and (max-width: 1024px) {
    .part-box {
      display: unset;
      .part1 {
        width: unset;
      }
      .part2 {
        width: unset;
      }
    }
  }
</style>

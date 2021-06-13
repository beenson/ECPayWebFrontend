<template>
  <div class="dark-layout list-view product-checkout">

    <!-- Left Card -->
    <b-card no-body>
      <b-card-header class="flex-column align-items-start">
        <b-card-title>付款方式</b-card-title>
        <b-card-text class="text-muted mt-25">
          目前僅提供超商繳費&ATM
        </b-card-text>
      </b-card-header>
      <b-card-body>
        <h6 class="card-holder-name my-75">
          ECPay
        </h6>

        <!-- Radios -->
        <b-form-radio-group>
          <hr class="mb-2 mt-1">

          <b-form-radio
            v-model="type"
            name="payment-method"
            value="1"
            checked="true"
          >
            ATM
            <b-form-select
              v-show="type==1"
              v-model="atm"
              :options="options"
            />
          </b-form-radio>
          <br class="mb-5 mt-5">
          <b-form-radio
            v-model="type"
            name="payment-method"
            class="mt-1"
            value="0"
          >
            超商代碼
          </b-form-radio>
        </b-form-radio-group>

        <hr class="my-2">
        <b-row>
          <b-col
            cols="12"
            md="4"
            lg="3"
            offset-lg="9"
            offset-md="8"
          >
            <div class="demo-inline-spacing">
              <b-button
                variant="success"
                align="right"
                block
                @click="onSubmit()"
              >
                確認訂單
              </b-button>
            </div>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>

    <!-- Right Card -->
    <div class="amount-payable checkout-options">
      <b-card>
        <div class="price-details">
          <h6 class="price-title">
            詳細價格
          </h6>
          <ul class="list-unstyled">
            <li class="price-detail">
              <div class="detail-title">
                商品小計
              </div>
              <div class="detail-amt">
                ${{ total }}
              </div>
            </li>
            <li class="price-detail">
              <div class="detail-title">
                運費
              </div>
              <div class="detail-amt discount-amt text-success">
                免費
              </div>
            </li>
          </ul>
          <hr>
          <ul class="list-unstyled">
            <li class="price-detail">
              <div class="detail-title detail-total">
                總計
              </div>
              <div class="detail-amt font-weight-bolder">
                ${{ total }}
              </div>
            </li>
          </ul>
        </div>

      </b-card>
    </div>
    <b-overlay
      :show="busy"
      no-wrap
      @shown="onShown"
      @hidden="onHidden"
    >
      <template v-slot:overlay>
        <div
          v-if="processing"
          class="text-center p-4 bg-light text-light rounded"
        >
          <div class="mb-3">
            訂單處理中...
          </div>
          <b-progress
            min="1"
            max="20"
            :value="counter"
            variant="success"
            height="3px"
            class="mx-n4 rounded-0"
          />
        </div>
        <div
          v-else
          ref="dialog"
          tabindex="-1"
          role="dialog"
          aria-modal="false"
          aria-labelledby="form-confirm-label"
          class="text-center p-3"
        >
          <p><strong id="form-confirm-label">訂單送出後無法更改，確定嗎？</strong></p>
          <div class="d-flex">
            <b-button
              v-ripple.400="'rgba(40, 199, 111, 0.15)'"
              variant="outline-success"
              class="mr-3"
              @click="onOK"
            >
              確定
            </b-button>
            <b-button
              v-ripple.400="'rgba(234, 84, 85, 0.15)'"
              variant="outline-danger"
              @click="onCancel"
            >
              再想想
            </b-button>
          </div>
        </div>
      </template>
    </b-overlay>
  </div>
</template>

<script>
import {
  BIcon, BFormRadioGroup, BFormSelect, BProgress, BOverlay, BRow, BCol, BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BFormGroup, BFormRadio, BFormInput, BButton,
} from 'bootstrap-vue'
import useJwt from '@/auth/jwt/useJwt'
import querystring from 'querystring'
import Ripple from 'vue-ripple-directive'
import ShoppingCart from './ShoppingCart'

export default {
  components: {
    // BSV
    BRow,
    BCol,
    BFormSelect,
    BCard,
    BIcon,
    BCardHeader,
    BOverlay,
    BProgress,
    BCardTitle,
    BCardText,
    BCardBody,
    BFormGroup,
    BFormRadio,
    BFormRadioGroup,
    BFormInput,
    BButton,
  },
  directives: {
    Ripple,
  },
  props: {
    paymentDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      type: 0,
      total: 0,
      busy: false,
      processing: false,
      counter: 1,
      interval: null,
      result: undefined,
      atm: 'BOT',
      options: [
        { value: 'BOT', text: '台灣銀行' },
        { value: 'TAISHIN', text: '台新銀行' },
        { value: 'CHINATRUST', text: '中國信託' },
        { value: 'FIRST', text: '第一銀行' },
        { value: 'LAND', text: '土地銀行' },
        { value: 'TACHONG', text: '大眾銀行' },
      ],
    }
  },
  mounted() {
    this.getTotal()
  },
  updated() {
    this.getTotal()
  },
  beforeDestroy() {
    this.clearInterval()
  },
  methods: {
    getTotal() {
      let t = 0
      ShoppingCart.get().forEach(p => {
        t += p.price * p.amount
      })
      this.total = t
    },
    createOrder() {
      const list = []
      ShoppingCart.get().forEach(item => {
        list.push({
          productId: item.id,
          amount: item.amount,
        })
      })
      useJwt.axiosIns.post('http://127.0.0.1:8080/order/create', querystring.stringify({
        data: JSON.stringify(list),
        type: this.type,
        bank: this.atm,
      })).then(res => {
        this.result = res.data
      })
    },
    clearInterval() {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }
    },
    onShown() {
      // onShown
    },
    onHidden() {
      // onHidden
    },
    onSubmit() {
      this.processing = false
      this.busy = true
    },
    onCancel() {
      this.busy = false
    },
    onOK() {
      this.counter = 1
      this.processing = true
      // Simulate an async request
      this.createOrder()
      this.clearInterval()
      this.interval = setInterval(() => {
        if (this.counter < 20) {
          this.counter += 1
        } else if (this.result) {
          this.clearInterval()
          this.$nextTick(() => {
            this.processing = false
            this.busy = false
          })
          ShoppingCart.set([])
          this.$router.push({ name: 'order', params: { id: this.result.Order.id } })
        }
      }, 350)
    },
  },
}
</script>

<style lang="css">
.bg-light {
  background-color: #161d31 !important;
}
</style>

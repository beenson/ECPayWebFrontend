<template>
  <div class="list-view product-checkout">

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
        <b-form-group>
          <hr class="mb-2 mt-1">

          <b-form-radio
            name="payment-method"
            value="debit-atm-credit-card"
          >
            ATM
          </b-form-radio>
          <b-form-radio
            name="payment-method"
            class="mt-1"
            value="net-banking"
          >
            超商代碼
          </b-form-radio>
        </b-form-group>

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
                @click="$emit('next-step')"
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
  </div>
</template>

<script>
import {
  BRow, BCol, BCard, BCardHeader, BCardTitle, BCardText, BCardBody, BFormGroup, BFormRadio, BFormInput, BButton,
} from 'bootstrap-vue'
import ShoppingCart from './ShoppingCart'

export default {
  components: {
    // BSV
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardTitle,
    BCardText,
    BCardBody,
    BFormGroup,
    BFormRadio,
    BFormInput,
    BButton,
  },
  props: {
    paymentDetails: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      total: 0,
    }
  },
  created() {
    this.getTotal()
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
      // TODO
    },
  },
}
</script>

<style lang="scss" scoped>
#cvv {
  width: auto;
}
</style>

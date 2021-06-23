<template>
  <div class="list-view product-checkout mt-0">

    <e-commerce-checkout-step-cart-products />

    <div class="checkout-options">
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
          <b-button
            variant="primary"
            block
            @click="$emit('next-step')"
          >
            下一步，確認聯絡資料
          </b-button>
        </div>

      </b-card>
    </div>
  </div>
</template>

<script>
import {
  BButton, BCard, BInputGroup, BFormInput, BInputGroupAppend,
} from 'bootstrap-vue'
import ECommerceCheckoutStepCartProducts from './ECommerceCheckoutStepCartProducts.vue'
import ShoppingCart from './ShoppingCart'

export default {
  components: {
    // BSV
    BButton,
    BCard,
    BInputGroup,
    BFormInput,
    BInputGroupAppend,

    // SFC
    ECommerceCheckoutStepCartProducts,
  },
  setup() {
    return {
      total: 0,
    }
  },
  created() {
    this.getTotal(undefined)
  },
  methods: {
    getTotal(newp) {
      let t = 0
      if (newp) {
        newp.forEach(p => {
          t += p.price * p.amount
        })
        this.total = t
        return
      }
      ShoppingCart.get().forEach(p => {
        t += p.price * p.amount
      })
      this.total = t
    },
  },
}
</script>

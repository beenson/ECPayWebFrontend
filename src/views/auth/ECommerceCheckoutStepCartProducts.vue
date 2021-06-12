<template>

  <div class="checkout-items">
    <b-card
      v-for="product in products"
      :key="product.id"
      class="ecommerce-card"
      no-body
    >

      <!-- Product Image -->
      <div class="item-img">
        <b-link>
          <b-img
            :src="product.photo"
            :alt="`${product.name}-${product.id}`"
          />
        </b-link>
      </div>

      <!-- Product Details: Card Body -->
      <b-card-body>
        <div class="item-name">
          <h6 class="mb-0">
            <b-link class="text-body">
              {{ product.name }}
            </b-link>
          </h6>
          <div class="item-rating">
            <ul class="unstyled-list list-inline">
              <li
                v-for="star in 5"
                :key="star"
                class="ratings-list-item"
                :class="{'ml-25': star-1}"
              >
                <feather-icon
                  icon="StarIcon"
                  size="16"
                  :class="[{'fill-current': star <= product.rating}, star <= product.rating ? 'text-warning' : 'text-muted']"
                />
              </li>
            </ul>
          </div>
        </div>
        <span class="text-success mb-1">尚有{{ product.storageAmount }}個</span>
        <div class="item-quantity">
          <span class="quantity-title">數量:</span>
          <b-form-spinbutton
            v-model="product.amount"
            size="sm"
            class="ml-75"
            :max="product.storageAmount"
            inline
            :formatter-fn="changeAmount"
          />
        </div>
      </b-card-body>

      <!-- Product Options/Actions -->
      <div class="item-options text-center">
        <div class="item-wrapper">
          <div class="item-cost">
            <h4 class="item-price">
              ${{ product.price }}
            </h4>
            <p
              v-if="product.hasFreeShipping"
              class="card-text shipping"
            >
              <b-badge
                pill
                variant="light-success"
              >
                Free Shipping
              </b-badge>
            </p>
          </div>
        </div>
        <b-button
          variant="light"
          class="mt-1 remove-wishlist"
          @click="removeProductFromCartClick(product)"
        >
          <feather-icon
            icon="XIcon"
            class="mr-50"
          />
          <span>移除</span>
        </b-button>
      </div>
    </b-card>
  </div>

</template>

<script>
import {
  BCard, BCardBody, BLink, BImg, BButton, BBadge, BFormSpinbutton,
} from 'bootstrap-vue'
import { ref } from '@vue/composition-api'
import { formatDate } from '@core/utils/filter'
import { useEcommerceUi } from '../data/useEcommerce'
import ShoppingCart from './ShoppingCart'

export default {
  components: {
    BCard, BCardBody, BLink, BImg, BButton, BBadge, BFormSpinbutton,
  },
  setup() {
    const products = ref([])

    const { toggleProductInWishlist } = useEcommerceUi()

    const fetchCartProducts = () => {
      products.value = []
      ShoppingCart.get().forEach(item => {
        products.value.push(item)
      })
    }

    const removeProductFromCartClick = product => {
      ShoppingCart.remove(product)
      fetchCartProducts()
    }

    fetchCartProducts()

    return {
      products,

      // UI
      toggleProductInWishlist,
      removeProductFromCartClick,

      // Filter
      formatDate,
    }
  },
  methods: {
    changeAmount(value) {
      this.updateCart()
      return value
    },
    updateCart() {
      ShoppingCart.set(this.products)
      this.$parent.getTotal(this.products)
      if (this.$parent.$parent.$parent.$parent.refFormWizard) {
        this.$parent.$parent.$parent.$parent.refFormWizard.tabs[2].$children[0].getTotal()
      }
    },
  },
}
</script>

<style>

</style>

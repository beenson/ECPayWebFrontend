<template>
  <section class="dark-layout ecommerce-application">
    <section class="app-ecommerce-details">
      <!-- Alert: No item found -->
      <b-alert
        variant="danger"
        :show="product === undefined"
      >
        <h4 class="alert-heading">
          Error fetching product data
        </h4>
        <div class="alert-body">
          No item found with this item slug. Check
          <b-link
            class="alert-link"
            :to="{ name: 'apps-e-commerce-shop'}"
          >
            Shop
          </b-link>
          for other items.
        </div>
      </b-alert>

      <!-- Content -->
      <b-card
        v-if="product"
        no-body
      >
        <b-card-body>
          <b-row class="my-2">

            <!-- Left: Product Image Container -->
            <b-col
              cols="12"
              md="5"
              class="d-flex align-items-center justify-content-center mb-2 mb-md-0"
            >
              <div class="d-flex align-items-center justify-content-center">
                <b-img
                  :src="product.photo"
                  :alt="`Image of ${product.name}`"
                  class="product-img"
                  fluid
                />
              </div>
            </b-col>

            <!-- Right: Product Details -->
            <b-col
              cols="12"
              md="7"
            >

              <!-- Product Name -->
              <h4>{{ product.name }}</h4>

              <!-- Price And Ratings -->
              <div class="ecommerce-details-price d-flex flex-wrap mt-1">
                <h4 class="item-price mr-1">
                  ${{ product.price }}
                </h4>
                <!-- <ul class="unstyled-list list-inline pl-1 border-left">
                  <li
                    v-for="star in 5"
                    :key="star"
                    class="ratings-list-item mr-25"
                  >
                    <feather-icon
                      icon="StarIcon"
                      size="18"
                      :class="[{'fill-current': star <= product.rating}, star <= product.rating ? 'text-warning' : 'text-muted']"
                    />
                  </li>
                </ul> -->
              </div>

              <!-- Avability -->
              <!-- <b-card-text>Available - <span class="text-success">In stock</span></b-card-text> -->

              <!-- Product Description -->
              <b-card-text>
                {{ product.desc }}
              </b-card-text>
              <b-card-text>
                已售出 {{ product.sellAmount }}個&nbsp;尚有 {{ product.storageAmount }}個
              </b-card-text>

              <div class="d-flex flex-column flex-sm-row pt-1">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                  class="btn-cart mr-0 mr-sm-1 mb-1 mb-sm-0"
                  @click="handleCartActionClick(product)"
                >
                  <feather-icon
                    icon="ShoppingCartIcon"
                    class="mr-50"
                  />
                  <span>{{ product.isInCart ? '前往購物車' : '加入購物車' }}</span>
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-card-body>

        <!-- Static Content -->
        <e-commerce-product-details-item-features />

        <!-- Static Content -->
        <!-- Slider: Related Products -->
        <e-commerce-product-details-related-products
          :category-id="product.categoryId"
        />
      </b-card>
    </section>
  </section>
</template>

<script>
import { ref } from '@vue/composition-api'
import {
  BCard, BCardBody, BRow, BCol, BImg, BCardText, BLink, BButton, BDropdown, BDropdownItem, BAlert,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import useJwt from '@/auth/jwt/useJwt'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import ECommerceProductDetailsItemFeatures from './ECommerceProductDetailsItemFeatures.vue'
import ECommerceProductDetailsRelatedProducts from './ECommerceProductDetailsRelatedProducts.vue'
import { useEcommerceUi } from '../data/useEcommerce'

export default {
  directives: {
    Ripple,
  },
  components: {
    // BSV
    BCard,
    BCardBody,
    BRow,
    BCol,
    BImg,
    BCardText,
    BLink,
    BButton,
    BDropdown,
    BDropdownItem,
    BAlert,

    // SFC
    ECommerceProductDetailsItemFeatures,
    ECommerceProductDetailsRelatedProducts,
  },
  setup() {
    const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi()

    // UI
    const selectedColor = ref(null)

    return {
      // UI
      selectedColor,
      handleCartActionClick,
      toggleProductInWishlist,
    }
  },
  data() {
    return {
      product: ref(null),
    }
  },
  created() {
    const productId = this.$router.currentRoute.params.id
    console.log(this.product)
    useJwt.axiosIns.post(`http://127.0.0.1:8080/product/${productId}`).then(res => {
      if (res.data.error) {
        console.error(res.data.error)
        return
      }
      this.product = res.data.product
    })
  },
  methods: {
    showToast(title, variant) {
      this.$toast({
        component: ToastificationContent,
        props: {
          title,
          icon: 'EditIcon',
          variant,
        },
      })
    },
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-ecommerce-details.scss";
</style>

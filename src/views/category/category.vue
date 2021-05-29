<template>
  <div
    :key="$route.fullPath"
    style="height: inherit"
  >
    <!-- ECommerce Header -->
    <section id="ecommerce-header">
      <div class="row">
        <div class="col-sm-12">
          <div class="ecommerce-header-items">
            <div class="result-toggler">
              <feather-icon
                icon="MenuIcon"
                class="d-block d-lg-none"
                size="21"
                @click="mqShallShowLeftSidebar = true"
              />
              <div class="search-results">
                {{ totalProducts }} 項商品
              </div>
            </div>
            <div class="view-options d-flex">
              <!-- Item View Radio Button Group  -->
              <b-form-radio-group
                v-model="itemView"
                class="ml-1 list item-view-radio-group"
                buttons
                size="sm"
                button-variant="outline-primary"
              >
                <b-form-radio
                  v-for="option in itemViewOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  <feather-icon
                    :icon="option.icon"
                    size="18"
                  />
                </b-form-radio>
              </b-form-radio-group>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Overlay -->
    <div class="body-content-overlay" />

    <!-- Searchbar -->
    <div class="ecommerce-searchbar mt-1">
      <b-row>
        <b-col cols="12">
          <b-input-group class="input-group-merge">
            <b-form-input
              v-model="search"
              placeholder="搜尋商品"
              class="search-product"
            />
            <b-input-group-append is-text>
              <feather-icon
                icon="SearchIcon"
                class="text-muted"
              />
            </b-input-group-append>
          </b-input-group>
        </b-col>
      </b-row>
    </div>

    <!-- Prodcuts -->
    <section :class="itemView">
      <b-card
        v-for="(product, index) in products"
        v-show="(isPageItem(index) && (search === '' || product.name.includes(search)))"
        :key="product.id"
        class="ecommerce-card"
        no-body
      >
        <div class="item-img text-center">
          <b-link :to="{ name: 'apps-e-commerce-product-details', params: { slug: product.slug } }">
            <b-img
              :alt="`${product.name}-${product.id}`"
              fluid
              class="card-img-top"
              :src="product.photo"
            />
          </b-link>
        </div>

        <!-- Product Details -->
        <b-card-body>
          <div class="item-wrapper">
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
            <div>
              <h6 class="item-price">
                ${{ product.price }}
              </h6>
            </div>
          </div>
          <h6 class="item-name">
            <b-link
              class="text-body"
              :to="{ name: 'apps-e-commerce-product-details', params: { slug: product.slug } }"
            >
              {{ product.name }}
            </b-link>
          </h6>
          <b-card-text class="item-description">
            {{ product.description }}
          </b-card-text>
        </b-card-body>

        <!-- Product Actions -->
        <div class="item-options text-center">
          <div class="item-wrapper">
            <div class="item-cost">
              <h4 class="item-price">
                ${{ product.price }}
              </h4>
            </div>
          </div>
          <!--<b-button
            variant="light"
            tag="a"
            class="btn-wishlist"
            @click="toggleProductInWishlist(product)"
          >
            <feather-icon
              icon="HeartIcon"
              class="mr-50"
              :class="{'text-danger': product.isInWishlist}"
            />
            <span>Wishlist</span>
          </b-button>-->
          <b-button
            variant="primary"
            tag="a"
            class="btn-cart"
            @click="handleCartActionClick(product)"
          >
            <feather-icon
              icon="ShoppingCartIcon"
              class="mr-50"
            />
            <span>{{ product.isInCart ? 'View In Cart' : '加入購物車' }}</span>
          </b-button>
        </div>
      </b-card>
    </section>

    <!-- Pagination -->
    <section>
      <b-row>
        <b-col cols="12">
          <b-pagination
            v-model="filters.page"
            :total-rows="totalProducts"
            :per-page="filters.perPage"
            first-number
            align="center"
            last-number
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                icon="ChevronLeftIcon"
                size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                icon="ChevronRightIcon"
                size="18"
              />
            </template>
          </b-pagination>
        </b-col>
      </b-row>
    </section>
  </div>
</template>

<script>
import {
  BDropdown, BDropdownItem, BFormRadioGroup, BFormRadio, BRow, BCol, BInputGroup, BInputGroupAppend, BFormInput, BCard, BCardBody, BLink, BImg, BCardText, BButton, BPagination,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import { watch } from '@vue/composition-api'
import router from '@/router'
import Vue from 'vue'
import { useShopFiltersSortingAndPagination, useShopUi, useShopRemoteData } from './shop'
import { useEcommerceUi } from './useEcommerce'

export default {
  directives: {
    Ripple,
  },
  components: {
    // BSV
    BDropdown,
    BDropdownItem,
    BFormRadioGroup,
    BFormRadio,
    BRow,
    BCol,
    BInputGroup,
    BInputGroupAppend,
    BFormInput,
    BCard,
    BCardBody,
    BLink,
    BImg,
    BCardText,
    BButton,
    BPagination,
  },
  setup() {
    const {
      filters, filterOptions, sortBy, sortByOptions,
    } = useShopFiltersSortingAndPagination()

    const { handleCartActionClick, toggleProductInWishlist } = useEcommerceUi()

    const {
      itemView, itemViewOptions, totalProducts,
    } = useShopUi()

    const { fetchProducts } = useShopRemoteData()

    const products = []

    const categoryId = router.currentRoute.params.id

    let category = {}

    // Wrapper Function for `fetchProducts` which can be triggered initially and upon changes of filters
    const fetchShopProducts = () => {
      fetchProducts(categoryId).then(res => {
        res.data.products.forEach((prod, i) => {
          Vue.set(products, i, prod)
        })
        totalProducts.value = res.data.products.length
        category = res.data.category
        router.currentRoute.meta.pageTitle = category.name
        router.currentRoute.meta.breadcrumb[1] = {
          text: category.name,
          active: true,
        }
        window.updateBreadcrumb()
        console.log(products)
      })
    }

    fetchShopProducts()

    watch([filters, sortBy], () => {
      fetchShopProducts()
    }, {
      deep: true,
    })

    return {
      categoryId,
      category,

      // useShopFiltersSortingAndPagination
      filters,
      filterOptions,
      sortBy,
      sortByOptions,

      // useShopUi
      itemView,
      itemViewOptions,
      totalProducts,
      toggleProductInWishlist,
      handleCartActionClick,

      // useShopRemoteData
      products,
    }
  },
  data() {
    return {
      search: '',
    }
  },
  methods: {
    isPageItem(index) {
      const { filters } = this
      return (filters.page - 1) * filters.perPage <= index && filters.page * filters.perPage > index
    },
  },
}
</script>

<style lang="scss">
@import "~@core/scss/base/pages/app-ecommerce.scss";
</style>

<style lang="scss" scoped>
.item-view-radio-group ::v-deep {
  .btn {
    display: flex;
    align-items: center;
  }
}
</style>

<template>
  <b-card-body>
    <div class="mt-4 mb-2 text-center">
      <h4>您可能會感興趣</h4>
      <b-card-text>逛過這件商品的人也看過的</b-card-text>
    </div>

    <!-- Swiper -->
    <swiper
      class="swiper-responsive-breakpoints px-4 py-2"
      :options="swiperOptions"
    >
      <swiper-slide
        v-for="(product,index) in relatedProducts"
        :key="index"
      >
        <b-link
          :replace="true"
          :to="{ name: 'product', params: { id: product.id } }"
        >
          <div class="item-heading">
            <h5 class="text-truncate mb-0">
              {{ product.name }}
            </h5>
          </div>
          <div class="img-container w-50 mx-auto py-75">
            <b-img
              :src="product.photo"
              fluid
            />
          </div>
          <div class="item-meta">
            <p class="card-text text-primary mb-0">
              已售出 {{ product.sellAmount }}個
            </p>
            <p class="card-text text-primary mb-0">
              ${{ product.price }}
            </p>
          </div>
        </b-link>
      </swiper-slide>

      <!-- Add Arrows -->
      <div
        slot="button-next"
        class="swiper-button-next"
      />
      <div
        slot="button-prev"
        class="swiper-button-prev"
      />
    </swiper>
  </b-card-body>
</template>

<script>
import {
  BCardBody, BCardText, BImg, BLink,
} from 'bootstrap-vue'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BCardBody,
    BCardText,
    BImg,
    BLink,

    // 3rd Party
    Swiper,
    SwiperSlide,
  },
  props: {
    categoryId: {
      type: Number,
      default: 1,
    },
  },
  setup() {
    const swiperOptions = {
      slidesPerView: 5,
      spaceBetween: 55,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        1600: {
          slidesPerView: 4,
          spaceBetween: 55,
        },
        1300: {
          slidesPerView: 3,
          spaceBetween: 55,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 55,
        },
        320: {
          slidesPerView: 1,
          spaceBetween: 55,
        },
      },
    }

    return {
      swiperOptions,
    }
  },
  data() {
    return {
      relatedProducts: [],
    }
  },
  created() {
    setTimeout(() => {
      this.categoryId = this.$parent.$data.product.categoryId
      useJwt.axiosIns.post(`http://127.0.0.1:8080/category/${this.categoryId}/products`).then(res => {
        if (res.data.error) {
          console.error(res.data.error)
          return
        }
        const relatedProducts = res.data.products
        relatedProducts.sort((a, b) => b.sellAmount - a.sellAmount) // 排序 => sellAmount越大越前面
        this.relatedProducts = relatedProducts.slice(0, 10) // 取售出量最高的前10個商品
      })
    }, 1000)
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/swiper.scss';
@import '~swiper/css/swiper.css';
</style>

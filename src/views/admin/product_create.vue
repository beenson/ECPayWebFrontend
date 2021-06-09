<template>
  <b-card>
    <div>
      <!-- Media -->
      <b-media class="mb-2">
        <template #aside>
          <b-avatar
            ref="previewEl"
            :src="productData.photo"
            :text="avatarText(productData.name)"
            :variant="`light-primary`"
            size="90px"
            rounded
          />
        </template>
        <h4 class="mb-1">
          {{ productData.name }}
        </h4>
      </b-media>

      <!-- Product Info: Input Fields -->
      <b-form>
        <b-row>
          <!-- Field: Product Name -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="名稱"
              label-for="product-name"
            >
              <b-form-input
                id="product-name"
                v-model="productData.name"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Desc -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="描述"
              label-for="desc"
            >
              <b-form-input
                id="desc"
                v-model="productData.desc"
              />
            </b-form-group>
          </b-col>

          <!-- Field: category -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="種類"
              label-for="category"
            >
              <b-form-select
                id="category"
                v-model="productData.categoryId"
                :options="categories"
              />
            </b-form-group>
          </b-col>

          <!-- Field: onSell -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="是否上架"
              label-for="onSell"
            >
              <b-form-select
                id="onSell"
                v-model="productData.onSell"
              >
                <option :value="true">
                  販售中
                </option>
                <option :value="false">
                  未販售
                </option>
              </b-form-select>
            </b-form-group>
          </b-col>

          <!-- Field: price -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="售價"
              label-for="price"
            >
              <b-form-input
                id="price"
                v-model="productData.price"
              />
            </b-form-group>
          </b-col>

          <!-- Field: sellAmount -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="售出數量"
              label-for="sellAmount"
            >
              <b-form-input
                id="sellAmount"
                v-model="productData.sellAmount"
              />
            </b-form-group>
          </b-col>

          <!-- Field: storageAmount -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="庫存數量"
              label-for="storageAmount"
            >
              <b-form-input
                id="storageAmount"
                v-model="productData.storageAmount"
              />
            </b-form-group>
          </b-col>

          <!-- Field: photo -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="照片"
              label-for="photo"
            >
              <b-form-input
                id="photo"
                v-model="productData.photo"
              />
            </b-form-group>
          </b-col>

        </b-row>
      </b-form>

      <!-- PERMISSION TABLE -->
      <!-- <b-card
        no-body
        class="border mt-1"
      >
        <b-card-header class="p-1">
          <b-card-title class="font-medium-2">
            <feather-icon
              icon="LockIcon"
              size="18"
            />
            <span class="align-middle ml-50">Permission</span>
          </b-card-title>
        </b-card-header>
        <b-table
          striped
          responsive
          class="mb-0"
          :items="permissionsData"
        >
          <template #cell(module)="data">
            {{ data.value }}
          </template>
          <template #cell()="data">
            <b-form-checkbox :checked="data.value" />
          </template>
        </b-table>
      </b-card> -->

      <!-- Action Buttons -->
      <b-button
        variant="primary"
        class="mb-1 mb-sm-0 mr-0 mr-sm-1"
        :block="$store.getters['app/currentBreakPoint'] === 'xs'"
        @click="submit"
      >
        新增
      </b-button>
      <b-button
        variant="outline-secondary"
        type="reset"
        :block="$store.getters['app/currentBreakPoint'] === 'xs'"
        @click="reset"
      >
        重設
      </b-button>
    </div>
  </b-card>
</template>

<script>
import {
  BButton, BMedia, BAvatar, BRow, BCol, BFormSelect, BFormGroup, BFormInput, BForm, BTable, BCard, BCardHeader, BCardTitle, BFormCheckbox,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import { useInputImageRenderer } from '@core/comp-functions/forms/form-utils'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import { ref } from '@vue/composition-api'
import querystring from 'querystring'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BButton,
    BMedia,
    BAvatar,
    BRow,
    BCol,
    BFormGroup,
    BFormInput,
    BFormSelect,
    BForm,
    BTable,
    BCard,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
  },
  setup(props) {
    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, base64 => {
      // eslint-disable-next-line no-param-reassign
      props.productData.avatar = base64
    })

    return {
      avatarText,

      //  ? Demo - Update Image on click of update button
      refInputEl,
      previewEl,
      inputImageRenderer,
    }
  },
  data() {
    return {
      id: this.$router.currentRoute.params.id,
      productData: {
        name: '',
        desc: '',
        categoryId: 0,
        onSell: false,
        price: 0,
        sellAmount: 0,
        storageAmount: 0,
        photo: '',
      },
      productDataOri: JSON.parse(localStorage.getItem('product')),
      password: '',
      categories: this.$router.currentRoute.params.categories,
    }
  },
  methods: {
    reset() {
      this.productData.name = this.productDataOri.name
      this.productData.desc = this.productDataOri.desc
      this.productData.categoryId = this.productDataOri.categoryId
      this.productData.onSell = this.productDataOri.onSell
      this.productData.price = this.productDataOri.price
      this.productData.sellAmount = this.productDataOri.sellAmount
      this.productData.storageAmount = this.productDataOri.storageAmount
      this.productData.photo = this.productDataOri.photo
    },
    submit() {
      if (this.productData.name === '') {
        this.showToast('請輸入名稱', 'danger')
        return
      }
      if (this.productData.price === '') {
        this.showToast('請輸入售價', 'danger')
        return
      }
      if (this.productData.categoryId === '') {
        this.showToast('請輸選擇種類', 'danger')
        return
      }
      const body = {
        name: this.productData.name,
        price: this.productData.price,
        desc: this.productData.desc,
        sellAmount: this.productData.sellAmount,
        storageAmount: this.productData.storageAmount,
        onSell: this.productData.onSell,
        photo: this.productData.photo,
        categoryId: this.productData.categoryId,
      }
      useJwt.axiosIns.post('http://127.0.0.1:8080/product/admin/create', querystring.stringify(body)).then(res => {
        if (res.data.error) {
          this.showToast(res.data.error, 'danger')
          return
        }
        this.productData = res.data.product
        this.showToast('新增商品成功!', 'success')
        this.$router.push({ name: 'admin.products' })
      })
    },
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
@import '@core/scss/vue/libs/vue-select.scss';
</style>

<template>
  <b-card>
    <div>
      <!-- Product Info: Input Fields -->
      <b-form>
        <b-row>
          <!-- Field: Product Name -->
          <b-col
            cols="12"
            md="6"
          >
            <b-form-group
              label="名稱"
              label-for="product-name"
            >
              <b-form-input
                id="product-name"
                v-model="categoryData.name"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Desc -->
          <b-col
            cols="12"
            md="6"
          >
            <b-form-group
              label="優先排序"
              label-for="desc"
            >
              <b-form-input
                id="desc"
                v-model="categoryData.priority"
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
      props.categoryData.avatar = base64
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
      categoryData: {
        name: '',
        priority: 0,
      },
    }
  },
  methods: {
    reset() {
      this.categoryData.name = ''
      this.categoryData.priority = 0
    },
    submit() {
      if (this.categoryData.name === '') {
        this.showToast('請輸入名稱', 'danger')
        return
      }
      if (this.categoryData.priority === '') {
        this.showToast('請輸選擇優先指數', 'danger')
        return
      }
      const body = {
        name: this.categoryData.name,
        priority: this.categoryData.priority,
      }
      useJwt.axiosIns.post('http://127.0.0.1:8080/category/admin/create', querystring.stringify(body)).then(res => {
        if (res.data.error) {
          this.showToast(res.data.error, 'danger')
          return
        }
        this.categoryData = res.data.category
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

<template>
  <section class="dark-layout ecommerce-application">
    <form-wizard
      ref="refFormWizard"
      color="#7367F0"
      :title="null"
      :subtitle="null"
      finish-button-text="Submit"
      back-button-text="Previous"
      hide-buttons
      class="checkout-form-wizard steps-transparent"
    >
      <tab-content
        title="購買列表"
        icon="feather icon-shopping-cart"
      >
        <e-commerce-checkout-step-cart @next-step="formWizardNextStep" />
      </tab-content>

      <tab-content
        title="聯絡資訊"
        icon="feather icon-home"
      >
        <e-commerce-checkout-step-address
          :address-details="checkoutDetails.address"
          @next-step="formWizardNextStep"
        />
      </tab-content>

      <tab-content
        title="付款"
        icon="feather icon-credit-card"
      >
        <e-commerce-checkout-step-payment
          :payment-details="checkoutDetails.payment"
          @next-step="formWizardNextStep"
        />
      </tab-content>
    </form-wizard>
  </section>
</template>

<script>
import { FormWizard, TabContent } from 'vue-form-wizard'
import { ref } from '@vue/composition-api'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import ECommerceCheckoutStepPayment from './ECommerceCheckoutStepPayment.vue'
import ECommerceCheckoutStepCart from './ECommerceCheckoutStepCart.vue'
import ECommerceCheckoutStepAddress from './ECommerceCheckoutStepAddress.vue'
import ShoppingCart from './ShoppingCart'

export default {
  components: {
    FormWizard,
    TabContent,
    ECommerceCheckoutStepCart,
    ECommerceCheckoutStepAddress,
    ECommerceCheckoutStepPayment,
  },
  setup() {
    const refFormWizard = ref(null)
    const formWizardNextStep = () => {
      refFormWizard.value.tabs[2].$children[0].getTotal()
      refFormWizard.value.nextTab()
    }

    const checkoutDetails = ref({
      address: {
        fullName: '',
        mobile: '',
        houseNo: '',
        landmark: '',
        city: '',
        pincode: '',
        state: '',
        addressType: null,
      },
      payment: {
        cvv: '',
      },
    })

    return {
      refFormWizard,
      formWizardNextStep,
      checkoutDetails,
    }
  },
  created() {
    if (ShoppingCart.get().length === 0) {
      this.$router.replace('/').then(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: '購物車為空。',
            icon: 'ShoppingCartIcon',
            variant: 'warning',
          },
        })
      })
    }
  },
}
</script>

<style lang="css">
@import '~@core/assets/fonts/feather/iconfont.css';
</style>
<style lang="scss">
@import '@core/scss/vue/libs/vue-wizard.scss';
@import '~@core/scss/base/pages/app-ecommerce.scss';
@import '~vue-form-wizard/dist/vue-form-wizard.min.css';
</style>

<style lang="scss" scoped>
.checkout-form-wizard ::v-deep {
  .wizard-tab-content {
    box-shadow: none !important;
    background: transparent !important;
    padding: 0;
  }
}
</style>

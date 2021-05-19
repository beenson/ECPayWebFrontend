<template>
  <b-card>
    <div>

      <!-- Media -->
      <b-media class="mb-2">
        <template #aside>
          <b-avatar
            ref="previewEl"
            :src="userData.avatar"
            :text="avatarText(userData.name)"
            :variant="`light-primary`"
            size="90px"
            rounded
          />
        </template>
        <h4 class="mb-1">
          {{ userData.name }}
        </h4>
        <div class="d-flex flex-wrap">
          {{ userData.admin > 0 ? '管理員' : '使用者' }}
        </div>
      </b-media>

      <!-- User Info: Input Fields -->
      <b-form>
        <b-row>
          <!-- Field: Full Name -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="名稱"
              label-for="full-name"
            >
              <b-form-input
                id="full-name"
                v-model="userData.name"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Email -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="信箱"
              label-for="email"
            >
              <b-form-input
                id="email"
                v-model="userData.email"
                readonly
                type="email"
              />
            </b-form-group>
          </b-col>

          <!-- Field: Phone -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="手機"
              label-for="phone"
            >
              <b-form-input
                id="phone"
                v-model="userData.phone"
                type="number"
              />
            </b-form-group>
          </b-col>

          <!-- Field: oldPwd -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="舊密碼"
              label-for="oldpwd"
            >
              <b-form-input
                id="oldpwd"
                v-model="oldPassword"
                type="password"
              />
            </b-form-group>
          </b-col>

          <!-- Field: newPwd -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="新密碼"
              label-for="newPwd"
            >
              <b-form-input
                id="newPwd"
                v-model="newPassword"
                type="password"
              />
            </b-form-group>
          </b-col>

          <!-- Field: newPwd2 -->
          <b-col
            cols="12"
            md="4"
          >
            <b-form-group
              label="再次輸入新密碼"
              label-for="newPwd2"
            >
              <b-form-input
                id="newPwd2"
                v-model="newPassword2"
                type="password"
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
        修改
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
  BButton, BMedia, BAvatar, BRow, BCol, BFormGroup, BFormInput, BForm, BTable, BCard, BCardHeader, BCardTitle, BFormCheckbox,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
// import vSelect from 'vue-select'
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
    BForm,
    BTable,
    BCard,
    BCardHeader,
    BCardTitle,
    BFormCheckbox,
    // vSelect,
  },
  setup(props) {
    // ? Demo Purpose => Update image on click of update
    const refInputEl = ref(null)
    const previewEl = ref(null)

    const { inputImageRenderer } = useInputImageRenderer(refInputEl, base64 => {
      // eslint-disable-next-line no-param-reassign
      props.userData.avatar = base64
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
      userData: JSON.parse(localStorage.getItem('user')),
      userDataOri: JSON.parse(localStorage.getItem('user')),
      oldPassword: '',
      newPassword: '',
      newPassword2: '',
    }
  },
  methods: {
    reset() {
      console.log(this.userDataOri.name)
      this.userData.name = this.userDataOri.name
      this.userData.email = this.userDataOri.email
      this.userData.phone = this.userDataOri.phone
      this.oldPassword = ''
      this.newPassword = ''
      this.newPassword2 = ''
    },
    submit() {
      let changePW = false
      if (this.newPassword !== '') {
        changePW = true
      }
      if (changePW && this.oldPassword === '') {
        this.showToast('修改密碼必須先輸入舊密碼', 'danger')
        return
      }
      if (changePW && this.newPassword2 === '') {
        this.showToast('修改密碼必須輸入兩次新密碼', 'danger')
        return
      }
      if (changePW && this.oldPassword === this.newPassword) {
        this.showToast('新舊密碼不可相同', 'danger')
        return
      }
      if (changePW && this.newPassword !== this.newPassword2) {
        this.showToast('兩次輸入的密碼不一樣', 'danger')
        return
      }
      if (this.userData.name === '') {
        this.showToast('請輸入名稱', 'danger')
        return
      }
      if (this.userData.phone === '') {
        this.showToast('請輸入手機號碼', 'danger')
        return
      }
      const body = {
        newPhone: this.userData.phone,
        newName: this.userData.name,
      }
      if (changePW) {
        body.newPassword = this.newPassword
        body.oldPassword = this.oldPassword
      }
      useJwt.axiosIns.post('http://127.0.0.1:8080/user/editProfile', querystring.stringify(body)).then(res => {
        if (res.data.error) {
          this.showToast(res.data.error, 'danger')
          return
        }
        this.userData = res.data.user
        this.showToast('修改會員資料成功!', 'success')
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

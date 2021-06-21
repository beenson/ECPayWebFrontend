<template>
  <div class="navbar-container d-flex content align-items-center">

    <!-- Nav Menu Toggler -->
    <ul class="nav navbar-nav d-xl-none">
      <li class="nav-item">
        <b-link
          class="nav-link"
          @click="toggleVerticalMenuActive"
        >
          <feather-icon
            icon="MenuIcon"
            size="21"
          />
        </b-link>
      </li>
    </ul>

    <!-- Left Col -->
    <div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
      <dark-Toggler class="d-none d-lg-block" />
    </div>

    <b-navbar-nav class="nav align-items-center ml-auto">
      <b-nav-item-dropdown
        right
        toggle-class="d-flex align-items-center dropdown-user-link"
        class="dropdown-user"
      >
        <template #button-content>
          <div class="d-sm-flex d-none user-nav">
            <p class="user-name font-weight-bolder mb-0">
              {{ user.name }}
            </p>
            <span class="user-status">{{ user.admin > 0 ? '管理員' : '使用者' }}</span>
          </div>
          <b-avatar
            size="40"
            variant="light-primary"
            badge
            :src="require('@/assets/images/avatars/default.jpg')"
            class="badge-minimal"
            badge-variant="success"
          />
        </template>

        <b-dropdown-item
          link-class="d-flex align-items-center"
          :to="{ name: 'profile' }"
        >
          <feather-icon
            size="16"
            icon="UserIcon"
            class="mr-50"
          />
          <span>個人資料</span>
        </b-dropdown-item>

        <b-dropdown-item
          link-class="d-flex align-items-center"
          :to="{ name: 'cart' }"
        >
          <feather-icon
            size="16"
            icon="ShoppingCartIcon"
            class="mr-50"
          />
          <span>購物車</span>
        </b-dropdown-item>

        <b-dropdown-item
          link-class="d-flex align-items-center"
          :to="{ name: 'orders' }"
        >
          <feather-icon
            size="16"
            icon="ShoppingCartIcon"
            class="mr-50"
          />
          <span>我的訂單</span>
        </b-dropdown-item>

        <b-dropdown-divider />

        <b-dropdown-item
          link-class="d-flex align-items-center"
          @click="logout"
        >
          <feather-icon
            size="16"
            icon="LogOutIcon"
            class="mr-50"
          />
          <span>登出</span>
        </b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>
  </div>
</template>

<script>
import {
  BLink, BNavbarNav, BNavItemDropdown, BDropdownItem, BDropdownDivider, BAvatar,
} from 'bootstrap-vue'
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import useJwt from '@/auth/jwt/useJwt'

export default {
  components: {
    BLink,
    BNavbarNav,
    BNavItemDropdown,
    BDropdownItem,
    BDropdownDivider,
    BAvatar,

    // Navbar Components
    DarkToggler,
  },
  props: {
    toggleVerticalMenuActive: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')),
    }
  },
  methods: {
    logout() {
      localStorage.removeItem(useJwt.jwtConfig.storageTokenKeyName)
      localStorage.removeItem(useJwt.jwtConfig.storageRefreshTokenKeyName)
      localStorage.removeItem('user')
      this.$router.push({ name: 'login' }).then(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'GoodBye~',
            icon: 'EditIcon',
            variant: 'primary',
          },
        })
      })
    },
  },
}
</script>

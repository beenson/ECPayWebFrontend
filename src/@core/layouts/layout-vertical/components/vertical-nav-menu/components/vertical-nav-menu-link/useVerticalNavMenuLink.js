import { ref } from '@vue/composition-api'
import { isNavLinkActive, navLinkProps } from '@core/layouts/utils'
import router from '@/router'

export default function useVerticalNavMenuLink(item) {
  const isActive = ref(false)

  const linkProps = navLinkProps(item)

  const updateIsActive = () => {
    if (router.currentRoute?.params?.id && linkProps.value?.to?.params?.id) {
      if (router.currentRoute.params.id === linkProps.value.to.params.id) {
        isActive.value = isNavLinkActive(item)
        return
      }
    } else {
      isActive.value = isNavLinkActive(item)
      return
    }
    isActive.value = false
  }

  return {
    isActive,
    linkProps,
    updateIsActive,
  }
}

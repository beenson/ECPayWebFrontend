// 註解 -- 左邊的選單區
import useJwt from '@/auth/jwt/useJwt'

export default async function () {
  const menu = [
    {
      title: '首頁Home',
      route: 'home',
      icon: 'HomeIcon',
    },
  ]
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.admin > 0) {
    menu.push({
      title: '後台管理',
      icon: 'SettingsIcon',
      children: [
        {
          title: '資料統計',
          route: {
            name: 'admin.dashboard',
          },
          icon: 'BarChart2Icon',
        },
        {
          title: '會員管理',
          route: {
            name: 'admin.users',
          },
          icon: 'UserIcon',
        },
        {
          title: '商品管理',
          route: {
            name: 'admin.products',
          },
          icon: 'CoffeeIcon',
        },
      ],
    })
  }
  await useJwt.axiosIns.post('http://127.0.0.1:8080/category/categorys').then(res => {
    const list = res.data
    list.sort((a, b) => b.priority - a.priority) // 排序 => priority越大越前面
    list.forEach(category => {
      menu.push({
        title: category.name,
        route: {
          name: 'category',
          params: { id: category.id },
        },
        icon: 'ShoppingBagIcon',
      })
    })
  })
  return menu
}

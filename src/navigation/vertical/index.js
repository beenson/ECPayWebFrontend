// 註解 -- 左邊的選單區
import useJwt from '@/auth/jwt/useJwt'

export default async function () {
  const menu = [
    {
      title: '首頁Home',
      route: 'home',
      icon: 'HomeIcon',
    },
    {
      title: 'Second Page',
      route: 'second-page',
      icon: 'FileIcon',
    },
  ]
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
  const user = JSON.parse(localStorage.getItem('user'))
  if (user?.admin > 0) {
    menu.push({
      title: '後台管理',
      icon: 'FileIcon',
      children: [
        {
          title: '會員管理',
          route: {
            name: 'admin.users',
          },
          icon: 'FileIcon',
        },
        {
          title: '商品管理',
          route: {
            name: 'admin.products',
          },
          icon: 'FileIcon',
        },
      ],
    })
  }
  return menu
}

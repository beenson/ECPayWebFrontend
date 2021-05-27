// 註解 -- 左邊的選單區
export default function () {
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
  menu.push(
    {
      title: 'Second Page222',
      route: 'second-page',
      icon: 'FileIcon',
    },
  )
  return menu
}

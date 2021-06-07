const ShoppingCart = {
  key: 'cart',
  get() {
    if (localStorage.getItem(this.key)) {
      return JSON.parse(localStorage.getItem(this.key))
    }
    return []
  },
  add(p, amount) {
    const product = p
    if (product) {
      product.amount = amount
      const list = this.get()
      list.push(product)
      localStorage.setItem(this.key, JSON.stringify(list))
      return true
    }
    return false
  },
  remove(product) {
    const list = this.get()
    list.forEach((p, i) => {
      if (p.id === product.id) {
        list.splice(i, 1)
        localStorage.setItem(this.key, JSON.stringify(list))
      }
    })
  },
  set(list) {
    localStorage.setItem(this.key, JSON.stringify(list))
  },
}
export default ShoppingCart

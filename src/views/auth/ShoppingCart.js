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
}
export default ShoppingCart

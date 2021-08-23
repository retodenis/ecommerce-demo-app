import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  static readonly CART_ITEMS: string = 'cartItems'
  static readonly TOTAL_PRICE: string = 'totalPrice'
  static readonly TOTAL_QUANTITY: string = 'totalQuantity'

  cartItems: Map<number, CartItem>
  totalPrice: Subject<number> = new Subject<number>()
  totalQuantity: Subject<number> = new Subject<number>()

  constructor() {
    this.cartItems = new Map<number, CartItem>()
    const sessionCartItems = sessionStorage.getItem(CartService.CART_ITEMS)
    let cartItemsArr: CartItem[] = sessionCartItems !== null ? JSON.parse(sessionCartItems) : [];
    cartItemsArr.forEach(e => {
      const cartItem: CartItem = new CartItem({cartItem: e})
      this.cartItems.set(e.productId, cartItem)
    })
  }

  addToCart(cartItem: CartItem) {
    if (this.cartItems.has(cartItem.productId)) {
      const existingCartItem: CartItem = this.cartItems.get(cartItem.productId)!
      existingCartItem.quantity++
      this.cartItems.set(cartItem.productId, existingCartItem)
    } else {
      this.cartItems.set(cartItem.productId, cartItem)
    }

    this.computeCartTotals()
    this.saveCartItemsToSession()
  }

  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--
    if(cartItem.quantity <= 0) {
      this.cartItems.delete(cartItem.productId)
    } else {
      this.cartItems.set(cartItem.productId, cartItem)
    }
    this.computeCartTotals()
    this.saveCartItemsToSession()
  }

  removeCartItem(cartItem: CartItem) {
    this.cartItems.delete(cartItem.productId)
    this.computeCartTotals()
    this.saveCartItemsToSession()
  }

  computeCartTotals() {
    let totalPrice: number = 0
    let totalQuantity: number = 0
    this.cartItems.forEach((e) => {
      totalPrice += e.subTotalPrice()
      totalQuantity += e.quantity
    })

    this.totalPrice.next(totalPrice)
    this.totalQuantity.next(totalQuantity)
    this.saveTotalsToSession(totalPrice, totalQuantity)
    this.logCartData(totalPrice, totalQuantity)
  }

  private logCartData(totalPrice: number, totalQuantity: number) {
    console.log('_____Cart content start_____')
    this.cartItems.forEach((e) => {
      const subTotalPrice = e.subTotalPrice()
      console.log(`name: ${e.name}, quantity=${e.quantity}, unitPrice=${e.unitPrice}, subTotalPrice=${subTotalPrice}`)
    })
    console.log(`totalPrice=${totalPrice.toFixed(2)} - totalQuantity=${totalQuantity}`)
    console.log('_____Cart content end_____')
  }

  private saveCartItemsToSession() {
    let cartItemArr: CartItem[] = this.getCartItemsAsArray(this.cartItems)
    sessionStorage.setItem(CartService.CART_ITEMS, JSON.stringify(cartItemArr))
  }

  getCartItemsAsArray(cartItems: Map<number, CartItem>): CartItem[] {
    return Array.from(cartItems.values())
  }

  private saveTotalsToSession(totalPrice: number, totalQuantity: number): void {
    sessionStorage.setItem(CartService.TOTAL_PRICE, JSON.stringify(totalPrice))
    sessionStorage.setItem(CartService.TOTAL_QUANTITY, JSON.stringify(totalQuantity))
  }
}

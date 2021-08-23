import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItemsMap: Map<number, CartItem> = new Map<number, CartItem>()
  totalPrice: number = 0.00
  totalQuantity: number = 0

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails()
  }

  listCartDetails() {
    this.cartItemsMap = this.cartService.cartItems
    this.cartService.totalPrice.subscribe(data => this.totalPrice = data)
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data)
    this.cartService.computeCartTotals()
  }

  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem)
  }

  decrementQuantity(cartItem: CartItem) {
    this.cartService.decrementQuantity(cartItem)
  }

  getCartItemValues(cartItemsMap: Map<number, CartItem>): CartItem[] {
    return Array.from(cartItemsMap.values())
  }

  removeCartItem(cartItem: CartItem) {
    this.cartService.removeCartItem(cartItem)
  }
}

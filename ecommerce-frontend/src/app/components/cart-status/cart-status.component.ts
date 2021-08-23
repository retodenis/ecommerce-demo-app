import { Component, OnInit } from '@angular/core';
import { SessionUtils } from 'src/app/common/utils/session-utils';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {
  totalPrice: number = 0.00
  totalQuantity: number = 0

  constructor(private cartService: CartService) {
    this.totalPrice = SessionUtils.getSessionNumberOrDefault(CartService.TOTAL_PRICE, 0.00)
    this.totalQuantity = SessionUtils.getSessionNumberOrDefault(CartService.TOTAL_QUANTITY, 0)
  }

  ngOnInit(): void {
    this.updateCartStatus()
  }

  updateCartStatus(): void {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )
  }
}

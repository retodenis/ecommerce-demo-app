import { Product } from './product';

export class CartItem {
    id!: number;
    productId!: number;
    name!: string;
    imageUrl!: string;
    unitPrice!: number;
    quantity!: number;

    constructor(args: Partial<CartItemArgs>) {
        if (args.product) {
            this.id = args.product.id;
            this.productId = args.product.id;
            this.name = args.product.name;
            this.imageUrl = args.product.imageUrl;
            this.unitPrice = args.product.unitPrice;
            this.quantity = 1;
        } else {
            Object.assign(this, args.cartItem)
        }
    }

    subTotalPrice() {
        return this.quantity * this.unitPrice
    }
}

export interface CartItemArgs {
    product?: Product,
    cartItem?: CartItem
}

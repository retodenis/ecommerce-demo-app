import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Page } from 'src/app/common/page';
import { Product } from 'src/app/common/product';
import { ProductResponse } from 'src/app/common/product-response';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = []
  currentCategoryId: number = 1
  previousCategoryId: number = 1;
  currentCategoryName!: string | null
  searchMode!: boolean
  page: Page = new Page()
  previousKeyword: string | null = null

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private cartService: CartService) { 
      
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword')

    if(this.searchMode) {
      console.log('handleSearchProducts called')
      this.handleSearchProducts()
    } else {
      console.log('handleListProducts called')
      this.handleListProducts()
    }
  }

  handleSearchProducts() {
    const keyword: string | null = this.route.snapshot.paramMap.get('keyword')

    if(this.previousKeyword != this.previousKeyword) {
      this.page.number = 1
    }
    this.previousKeyword = keyword

    this.productService.searchProductsPaginate(this.page, keyword).subscribe(
      data => {
        this.getPaginatedResult(data);
      }
    )
  }

  private getPaginatedResult(data: ProductResponse) {
    let { size, totalElements, number } = data.page;
    this.page = new Page(size, totalElements, number + 1);
    this.products = data._embedded.products;
  }

  handleListProducts() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id')

    if(hasCategoryId) {
      const tmpCategoryId = this.route.snapshot.paramMap.get('id');
      this.currentCategoryId = tmpCategoryId != null ? +tmpCategoryId : 1;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')
    } else {
      this.currentCategoryId = 2
      this.currentCategoryName = 'Books'
    }

    if(this.previousCategoryId != this.currentCategoryId) {
      this.page.number = 1
    }
    this.previousCategoryId = this.currentCategoryId

    this.productService.getProductListPaginate(this.page, this.currentCategoryId).subscribe(
      data => {
        this.getPaginatedResult(data)
      }
    )
  }

  updatePageSize(pageSize: number): void {
    this.page.updatePageSize(pageSize, () => this.listProducts())
  }

  addToCart(product: Product) {
    console.log(`new product in cart ${JSON.stringify(product)}`)
    const cartItem = new CartItem({product: product})
    this.cartService.addToCart(cartItem)
  }
}

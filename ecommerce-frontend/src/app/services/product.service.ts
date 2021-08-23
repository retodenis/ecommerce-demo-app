import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
import { Page } from '../common/page';
import { ProductResponse } from '../common/product-response';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl: string = 'http://localhost:8080/api/products'
  private categoryUrl: string = 'http://localhost:8080/api/product-category'

  constructor(private httpClient: HttpClient) { }

  getProductListPaginate(page: Page, categoryId: number): Observable<ProductResponse> {
    const searchUrl: string = 
      `${this.baseUrl}/search/findByCategoryId?id=${categoryId}&page=${page.number - 1}&size=${page.size}`
    return this.httpClient.get<ProductResponse>(searchUrl)
  }

  getProductList(categoryId: number): Observable<Product[]> {
    const searchUrl: string = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`
    return this.getProducts(searchUrl)
  }

  searchProducts(keyword: string | null): Observable<Product[]> {
    const searchUrl: string = `${this.baseUrl}/search/findByNameContainsIgnoreCase?name=${keyword}`
    return this.getProducts(searchUrl)
  }

  searchProductsPaginate(page: Page, keyword: string | null): Observable<ProductResponse> {
    const searchUrl: string = 
      `${this.baseUrl}/search/findByNameContainsIgnoreCase?name=${keyword}&page=${page.number - 1}&size=${page.size}`
    return this.httpClient.get<ProductResponse>(searchUrl)
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<ProductCategoryResponse>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  }

  getProduct(productId: number): Observable<Product> {
    const url = `${this.baseUrl}/${productId}`
    return this.httpClient.get<Product>(url)
  }

  private getProducts(url: string): Observable<Product[]> {
    return this.httpClient.get<ProductResponse>(url).pipe(
      map(response => response._embedded.products)
    );
  }

}

interface ProductCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[]
  }
}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DropDownValue } from 'src/app/common/drop-down-value';
import { CartService } from 'src/app/services/cart.service';
import { ShopFormService } from 'src/app/services/shop-form.service';

const CURRENT_MONTH: number = new Date().getMonth() + 1

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup
  customerFormGroup!: FormGroup
  shippingAddressFormGroup!: FormGroup
  billingAddressFormGroup!: FormGroup
  creditCardFormGroup!: FormGroup

  routerLinkState: any
  totalPrice: number = 0
  totalQuantity: number = 0

  creditCardData: DropDownValue<string>[] = [new DropDownValue('Visa', 0), new DropDownValue('MasterCard', 1)]
  expirationMonthData!: DropDownValue<number>[]
  expirationYearData!: DropDownValue<number>[]
  stateData: DropDownValue<string>[] = []
  countryData: DropDownValue<string>[] = []

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private shopFormService: ShopFormService) {
  }

  ngOnInit(): void {   
    this.createFormGroups()
    this.subscribeToTotals()
    this.subscribeYearsAndMonths()

    this.shopFormService.getCountries().subscribe(
      data => data.forEach((c, i) => this.countryData.push(new DropDownValue(c.name, i)))
    )
    
    this.logDropDown('expirationMonthData', this.expirationMonthData)
    this.logDropDown('expirationYearData', this.expirationYearData)
  }

  logDropDown(name: string, dropDownData: DropDownValue<any>[]) {
    console.log(`DropDownName=${name}`)
    dropDownData.forEach(e => {
      console.log(`DropDownValue=${e.value} and index=${e.index}`)
    })
    console.log('___End dropDown___')
  }

  createFormGroups(): void {
    this.customerFormGroup = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: ['']
    })

    this.shippingAddressFormGroup = this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: ['']
    })

    this.billingAddressFormGroup = this.formBuilder.group({
      street: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: ['']
    })

    this.creditCardFormGroup = this.formBuilder.group({
      cardType: [''],
      nameOnCard: [''],
      cardNumber: [''],
      securityCode: [''],
      expirationMonth: [''],
      expirationYear: ['']
    })

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.customerFormGroup,
      shippingAddress: this.shippingAddressFormGroup,
      billingAddress: this.billingAddressFormGroup,
      creditCard: this.creditCardFormGroup
    })
  }

  handleMonthsAndYears = () => {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')
    const selectedYear: number = +creditCardFormGroup?.value.expirationYear
    
    let startMonth: number
    if(ShopFormService.CURRENT_YEAR === selectedYear) {
      startMonth = CURRENT_MONTH
    } else {
      startMonth = 1
    }
    this.shopFormService.generateCreditCardMonth(startMonth).subscribe(data => this.expirationMonthData = data)
    //console.log('handleMonthsAndYears called')
  }

  subscribeYearsAndMonths(): void {
    this.shopFormService.generateCreditCardMonth(CURRENT_MONTH).subscribe(data => this.expirationMonthData = data)
    this.shopFormService.generateCreditCardYears().subscribe(data => this.expirationYearData = data)
  }

  subscribeToTotals(): void {
    this.cartService.totalPrice.subscribe(data => {this.totalPrice = data})
    this.cartService.totalQuantity.subscribe(data => this.totalQuantity = data)
    this.cartService.computeCartTotals()
  }

  onSubmit(): void {
    console.log('Handling the submit button')
    console.log(this.checkoutFormGroup.get('customer')?.value)
    console.log(`Credit card form data=${JSON.stringify(this.checkoutFormGroup.get('creditCard')?.value)}`)
  }

  copyShipAddressToBillAddress(isBillingAddressTheSameChecked: boolean): void {
    console.log(`isBillingAddressTheSameChecked=${isBillingAddressTheSameChecked}`)
    if(isBillingAddressTheSameChecked) {
      this.checkoutFormGroup.controls.billingAddress
        .setValue(this.checkoutFormGroup.controls.shippingAddress.value)
    } else {
      this.checkoutFormGroup.controls.billingAddress.reset()
    }
  }
}

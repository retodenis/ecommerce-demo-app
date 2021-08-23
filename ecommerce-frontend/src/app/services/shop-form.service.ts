import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { DropDownValue } from '../common/drop-down-value';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {
  static readonly TOTAL_MONTHS: number = 12
  static readonly CURRENT_YEAR: number = new Date().getFullYear()
  static readonly YEARS_TO_GENERATE = 11

  private countriesUrl = 'http://localhost:8080/api/countries'
  private statesUrl = 'http://localhost:8080/api/states'

  constructor(private httpClient: HttpClient) { }

  /**
   * 
   * @param startMonth in range from 1 to 12
   * @returns months array from startMonth, for example if startMonth = 8, result is [8, 9, 10, 11, 12]
   */
  generateCreditCardMonth(startMonth: number): Observable<DropDownValue<number>[]> {
    const MONTH_TO_GENERATE = 
      startMonth === ShopFormService.TOTAL_MONTHS ? 1 : ShopFormService.TOTAL_MONTHS - startMonth
    const MONTHS: DropDownValue<number>[] = 
      Array(MONTH_TO_GENERATE + 1).fill(0).map((k, v) => new DropDownValue(startMonth + v, v))
    return of(MONTHS)
  }

  generateCreditCardYears(): Observable<DropDownValue<number>[]> {
    const YEARS: DropDownValue<number>[] =
      Array(ShopFormService.YEARS_TO_GENERATE).fill(0).map((k, v) => new DropDownValue((ShopFormService.CURRENT_YEAR + v), v))
    return of(YEARS)
  }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<CountriesResponse>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    )
  }

  getStates(countryCode: string): Observable<State[]> {
    return this.httpClient.get<StatesResponse>(`${this.statesUrl}/search/findByCountryCode?code=${countryCode}`).pipe(
      map(response => response._embedded.states)
    )
  }
}

interface StatesResponse {
  _embedded: {
    states: State[]
  }
}

interface CountriesResponse {
  _embedded: {
    countries: Country[]
  }
}

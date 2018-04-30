import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../models/currency.model';

@Injectable()
export class DataService {

  private apiBaseUrl: string = 'https://api.coinmarketcap.com/v1/';

  constructor(public http: HttpClient) { }

  private makeUrl = (endpoint: string) => this.apiBaseUrl + endpoint;

  fetchData(): Promise<{}> {
    return this.http.get(this.makeUrl('/ticker')).toPromise();
  }

  fetchSpecificCurrencyData(id: string): Promise<{}> {
    return this.http.get(this.makeUrl(`/ticker/${id}`)).toPromise();
  }

}

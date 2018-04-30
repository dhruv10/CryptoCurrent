import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Currency } from '../models/currency.model';

interface HeaderItem {
  title: string;
  property: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  currenciesData: Currency[];
  updateIntervalTime: number = 5;
  registeredInterval: any;

  modalOpen: boolean = false;

  sortsApplied = {
    "rank": 1, // 1 -> asc && -1 -> desc, you'll get the reason of these as objects later :D
    "market_cap_usd": -1,
    "price_usd": 1,
    "24h_volume_usd": 1,
    "percent_change_1h": 1,
    "percent_change_24h": 1,
    "percent_change_7d": 1
  };

  focusedCurrency = {} as Currency;

  headerItems = [
    {
      title: 'Rank',
      property: 'rank'
    },
    {
      title: 'Name',
      property: 'name'
    },
    {
      title: 'Symbol',
      property: 'symbol'
    },
    {
      title: 'Market Cap',
      property: 'market_cap_usd'
    },
    {
      title: 'Price',
      property: 'price_usd'
    },
    {
      title: 'Volume (24hr)',
      property: '24h_volume_usd'
    },
    {
      title: '% (1h)',
      property: 'percent_change_1h'
    },
    {
      title: '% (24h)',
      property: 'percent_change_24h'
    },
    {
      title: '% (7d)',
      property: 'percent_change_7d'
    }
  ] as HeaderItem[];

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.initData();
    this.registerInterval();    
  }

  initData() {
    this.dataService.fetchData()
      .then((currencies: Currency[]) => {
        this.currenciesData = currencies;
        console.log(this.currenciesData);
      });
  }

  registerInterval() {
    if (this.updateIntervalTime < 0.05) return alert('Sorry, too low values of Update Interval might lead to problems!');
    if (this.registeredInterval) clearInterval(this.registeredInterval);
    this.registeredInterval = setInterval(() => {
      this.initData();
    }, this.updateIntervalTime * 10000); // convert to min from ms
  }

  sortData(property: string) {
    if (this.sortsApplied[property] == null) return;
    this.currenciesData.sort((c1: Currency, c2: Currency): number => {
      return this.sortsApplied[property] * (c2[property] - c1[property]);
    });
    this.sortsApplied[property] = -this.sortsApplied[property]; // lets take advantage of JS mutability!
  }

  getIconClass(property: string) {
    if (this.sortsApplied[property] == undefined) return {};
    const conditionalClasses = {
      'fa-sort-asc': this.sortsApplied[property] > 0,
      'fa-sort-desc': this.sortsApplied[property] < 0
    };
    return conditionalClasses;
  }

  switchModalState() {
    this.modalOpen = !this.modalOpen;
  }

  updateFocusedCurrencyAndSwitchModal(currency: Currency) {

    this.focusedCurrency = {} as Currency; // first init with empty to not show wrong data in modal

    // With great power of mutability comes great responsibility of immutability! :D
    this.dataService.fetchSpecificCurrencyData(currency.id).then((response: any) => {
      if (response.error) {
        alert('No specific online data found for this currency, using local data!');
        return this.focusedCurrency = currency;
      }
      this.focusedCurrency = response[0];
    });
    console.log(this.focusedCurrency);
    this.switchModalState();    
  }

}

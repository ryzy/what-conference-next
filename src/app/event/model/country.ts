export interface Currency {
  code: string;
  name: string;
  symbol?: string;
}

export interface Country {
  name: string;
  flag: string;
  isoCode: string;
  currencies: Currency[];
  capital: string;
  region: string;
  subregion: string;
  latlng: [ number, number ];
  timezones: string[]; // e.g. 'UTC+04:30'
}

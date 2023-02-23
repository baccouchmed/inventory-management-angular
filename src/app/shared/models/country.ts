export class Country {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  code?: string;
  countryName?: string;
}

export class Governorate {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  code?: string;
  countryId?: Country;
  governorateName?: string;
}

export class Municipality {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  code?: string;
  countryId?: Country;
  governorateId?: Governorate;
  municipalityName?: string;
}

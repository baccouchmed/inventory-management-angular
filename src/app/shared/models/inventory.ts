import { Company } from './company';

export class CompanyProduct {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  name?: string;
  logo?: string;
}
export class TypeProduct {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  label?: string;
}

export class CompanyProductTypeProduct {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyProductId?: CompanyProduct;
  typeProductId?: TypeProduct;
}
export class Product {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyId?: Company;
  companyProductId?: CompanyProduct;
  typeProductId?: TypeProduct;
  companyProductTypeProductId?: CompanyProductTypeProduct;
  companyProductIdNew?: string;
  typeProductIdNew?: string;
  companyProductTypeProductIdNew?: string;
  label?: string;
  lot?: string;
  DF?: string;
  DLC?: string;
  quantity?: number;
  unitPrice?: number;
  logo?: string;
  myStock?: string;
  minStock?: string;
  requestedStock?: number;
  status?: string;
  creator?: Company;
}
export class ProductStock {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  companyProductId?: CompanyProduct;
  typeProductId?: TypeProduct;
  companyProductTypeProductId?: CompanyProductTypeProduct;
  productId?: Product;
  quantityInTotal?: number;
  quantityIn?: Quantity[];
  quantityOutTotal?: number;
  quantityOut?: Quantity[];
  quantityTotal?: number;
  quantity?: number;
  minStock?: number;
  inStock?: number;
  totalOutPrice?: number;
  totalInPrice?: number;
  price?: number;
}
export class Quantity {
  quantity?: number;
  date?: string;
  unitPrice?: string;
  totalPrice?: string;
}
export class ProductRequest {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  requesterId?: Company;
  requestedId?: Company;
  dueDate?: string;
  productsId?: {
    id?: string;
    // tslint:disable-next-line:variable-name
    _id?: string;
    companyProductId?: CompanyProduct;
    typeProductId?: TypeProduct;
    companyProductTypeProductId?: CompanyProductTypeProduct;
    label?: string;
    quantity?: number;
    unitPrice?: number;
    logo?: string;
    productId?: Product;
    quantityRequested?: number;
    quantityValidated?: number;
    unitPriceRequested?: number;
  }[];
  requesterValidation?: boolean;
  requestedValidation?: boolean;
  done?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

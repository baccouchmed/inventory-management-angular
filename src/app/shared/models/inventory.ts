export class Category {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  label?: string;
  logo?: string;
}
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
export class Subcategory {
  id?: string;
  // tslint:disable-next-line:variable-name
  _id?: string;
  categoryId?: Category;
  label?: string;
  logo?: string;
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
  companyProductId?: CompanyProduct;
  typeProductId?: TypeProduct;
  companyProductTypeProductId?: CompanyProductTypeProduct;
  label?: string;
  quantity?: number;
  unitPrice?: number;
  logo?: string;
  myStock?: string;
  status?: boolean;
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

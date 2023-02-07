import { RefList } from '../models/ref-list';

export enum SubcategoryFood {
  dairyProducts = 'dairyProducts',
  biscuits = 'biscuits',
  chocolates = 'chocolates',
  sweets = 'sweets',
  chips = 'chips',
  jus = 'jus',
  waters = 'waters',
  cakes = 'cakes',
  softDrinks = 'softDrinks',
  animalFood = 'animalFood',
}

export const listSubcategoryFood: RefList<SubcategoryFood>[] = [
  { key: SubcategoryFood.dairyProducts, value: 'Dairy Products' },
  { key: SubcategoryFood.biscuits, value: 'Biscuits' },
  { key: SubcategoryFood.chocolates, value: 'Chocolates' },
  { key: SubcategoryFood.sweets, value: 'Sweets' },
  { key: SubcategoryFood.chips, value: 'Chips' },
  { key: SubcategoryFood.jus, value: 'Jus' },
  { key: SubcategoryFood.waters, value: 'Waters' },
  { key: SubcategoryFood.cakes, value: 'Cakes' },
  { key: SubcategoryFood.softDrinks, value: 'Soft Drinks' },
  { key: SubcategoryFood.animalFood, value: 'Animal Food' },
];

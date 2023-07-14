import {find, get} from 'lodash'

export const getCurrencyRate=(base, target, national , currencies)=>{

  if(base===target){
    return 1;
  }

  if(base===national){
    const rate =  get(find(currencies, currency=>currency.name===target), 'purchase_price') ||1;
    return 1/rate
  }
    
  if(target===national){
    const rate =  get(find(currencies, currency=>currency.name===base), 'sale_price') ||1;
    return rate
  }

  return 1

}
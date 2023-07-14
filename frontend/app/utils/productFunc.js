import { get, isBoolean, omitBy, isNil, isArray } from "lodash"
import { isMoment } from "moment"

export const productInPurchase=(product={})=>{
  const tmpProduct = {currency:'USD', quantity:1, price:0}
  return {...tmpProduct, 
    quantity:product.quantity, id:product.id, price:product.purchase_price, currency:product.purchase_currency}
}

export const getQuery=(values)=>{
  if(typeof values !== 'object'){
    return undefined
  }

  const query =omitBy(values, isNil)
  for(const valueKey in query){
    if(isArray(values[valueKey])){
      const fromValue = get(values, `${valueKey}.0`)
      if(fromValue){
        query[`${valueKey}_from`]= isMoment(fromValue)?fromValue.format('YYYY/MM/DD'):fromValue
      }
      const toValue = get(values, `${valueKey}.1`)
      if(toValue){
        query[`${valueKey}_to`]= isMoment(toValue)?toValue.format('YYYY/MM/DD'):toValue
      }
      delete query[valueKey]
    }
    if(!values[valueKey]){
      delete query[valueKey]
    }
  }
  return query
}
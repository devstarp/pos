import { map } from "highcharts"
import { get, isString, isNumber, omitBy, isNil, isArray, every, join, isObject } from "lodash"
import {lang} from 'services/config'
import { makeJSVariableName } from "./dataFunc"

export const productInPurchase=(product={})=>{
  const tmpProduct = {currency:'USD', quantity:1, price:0}
  return {...tmpProduct, 
    quantity:product.quantity, id:product.id, price:product.purchase_price, currency:product.purchase_currency}
}

export const getFilterQuery=(values)=>{
  if(typeof values !== 'object'){
    return {}
  }

  const query =omitBy(values, isNil)
  for(const valueKey in query){
    const value= query[valueKey]
    if(isArray(value)){
      if(value.map.length===0){
        delete query[valueKey]
      }else if(every(value, ele=>isString( ele) || isNumber(ele)))  {
        query[valueKey]=join(value, ',')
      }else{
        const fromValue = get(values, `${valueKey}.0.from`)
        if(fromValue){
          query[`${valueKey}_from`]= fromValue
        }
        const toValue = get(values, `${valueKey}.0.to`)
        if(toValue){
          query[`${valueKey}_to`]= toValue
        }
        delete query[valueKey]
      }
    }
    if(!value){
      delete query[valueKey]
    }
  }
  return query
}

export const getSortQuery=(values)=>{
  const query={}
  if(isArray(values)){
    for (const value of values){
      if(get(value, 'columnKey') && value.order){
        query[`${get(value, 'columnKey')}_order`]= get(value, 'order')?'asc':'desc'
      }
    }
  }else if(isObject(values)){
    return (values.columnKey && values.order?{[`${values.columnKey}_order`]:values.order==='ascend'?'asc':'desc'}:undefined)
  }
  return query
}

export const getPaginationQuery=(values)=>{
  if(!isObject(values)){
    return undefined
  }
  const query = {}
  if(values.pageSize){
    query.page_size=values.pageSize
  }
  if(values.current){
    query.current=values.current
  }
  if(values.total){
    query.total=values.total
  }
  return query
}

export const getCommonColumn=(column, index)=>({
  title: lang[makeJSVariableName(column.key)],
  align: index===0?'left':'center',
  dataIndex:column.key,
  ...column
})

export const getFieldsOptions=(fields, valueKey='id', labelKey='title')=>{
  if(!isArray(fields)){
    return []
  }
  return map(fields, field=>(isString(field) &&{[valueKey]:field, [labelKey]:lang[makeJSVariableName(field)]})) ||[]
}

import parse from './parse'
import { Op } from 'sequelize';

export const getLimit=(limit)=>{
    return parse.getNumberIfPositive(limit)
}
  
export const getOffset=(limit, page)=>{
      
    if(!parse.getNumberIfPositive(limit)){
        return undefined
      }
      if(parse.getNumberIfPositive(page)>0){
       return parse.getNumberIfPositive(limit) * (parse.getNumberIfPositive(page) - 1)
      }
      return undefined
}
  
export const getOrder=(query)=>{
    if(!Object.keys(query).length){
      return undefined
    }
  
    const orders=[]
  
    for (const key in query) {
      if(parse.getOrderFieldname(key)){
        orders.push([parse.getOrderFieldname(key), query[key]])
      }
    }
  
    return orders;  
}

export const getStringQuery=(value, key)=>{
    if(typeof value !== 'string'){
        return undefined
    }
    if(typeof key !== 'string'){
        return undefined
    }
    if (value.includes(',')) {
        const values = value.split(',');
        return {[key]:values}
      } else {
        return {[key]:value}
    }
}

export const getSearchQuery=(value, key)=>{
    return({[key]:{ [Op.like]: `%${parse.getString(value)}%` }})
}

export const getRangeQuery=(valueFrom, valueTo, key)=>{
    if(typeof key !=='string'){
        return undefined
    }
    let value;

    if(valueFrom){
        value = {[Op.gte]:valueFrom}
    }

    if(valueTo){
        value = {[Op.lte]:valueTo}
    }

    if(valueFrom && valueTo){
        value = {[Op.between]:[valueFrom, valueTo]}
    }

    if(value){
        return {[key]:value}
    }

    return undefined
}

export const getSearchKeyQuery=(value, keys)=>{
    if(!Array.isArray(keys) || !value){
        return undefined
    }
    const conditions = []
    for (const key of keys){
        key && conditions.push(getSearchQuery(value, key))
    }
    return {[Op.or]:conditions}
}
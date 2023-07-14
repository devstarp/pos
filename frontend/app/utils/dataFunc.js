import {
  findIndex, get, isEmpty, xorWith, isEqual, isArray, keys, isObject, split, capitalize, map, join,
  every, isNil, includes, isBoolean
} from 'lodash';

export const updateElementInArray = (array, newElement, key = 'id', change = true, elementId) => {
  if (!isArray(array)) {
    return [];
  }

  const resultArray = [...array];
  
  const index = findIndex(
    array, ele => Number(elementId || get(newElement, key)) === Number(get(ele, key))
  );
  
  if (index >= 0) {
    if (change || typeof newElement !== 'object') {
      resultArray[index] = newElement;
    } else {
      resultArray[index] = { ...resultArray[index], ...newElement };
    }
  } else {
    resultArray.push(newElement);
  }
  
  return resultArray;
};

export const isChangedObject=(newObj={}, orgObj={})=>{
  const newObjKeys = keys(newObj)
  if(!newObjKeys){
    return false;
  }
  for (const newObjKey of newObjKeys) {
    if(get(newObj, newObjKey) && get(orgObj, newObjKey)!==get(newObj, newObjKey)){
      return true
    }
    if(isBoolean(get(newObj, newObjKey)) && get(orgObj, newObjKey)!==get(newObj, newObjKey)){
      return true
    }
  }
  return false
}

export const getFullName=(object)=>{
  if(!isObject(object)){
    return ''
  }
  if(get(object, 'full_name')){
    return get(object, 'full_name')
  }
  if(get(object, 'name')){
    return get(object, 'name')
  }
  let name = ''
  const firstName = get(object, 'first_name')
  const lastName = get(object, 'last_name')
  if(firstName){
    name += firstName
  }
  if(lastName){
    name += ` ${lastName}`
  }
  return name
}

export const makeJSVariableName=(name)=>{
  if(!name){
    return ''
  };
  let subNames= split(name, '_')
  subNames = map(subNames,
    (subName, index)=>( subName==='id' ?'' :index!==0 ? capitalize(subName) :subName)
  );
  return join(subNames,'')
}

export const isEmptyArray=(array)=>{
  if(!isArray(array)){
    return true
  }
  return every(array, ele=>isNil(ele))
}

export const hasArray= (array1, array2)=>every(array2, ele=>includes(array1, ele))
export const isSameArraies = (array1, array2)=> hasArray(array1, array2) &&hasArray(array2, array1)

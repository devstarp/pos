
import { isObject, isString } from 'lodash-es';
import moment from 'moment'

export const DATE_FORMAT_1='DD/MM/YYYY'
export const DATE_FORMAT_2='YYYY-MM-DD'
export const TIME_FORMAT_1='HH:mm:ss'
export const DATE_TIME_FORMAT_1=`${DATE_FORMAT_1} ${TIME_FORMAT_1}`
export const DATE_TIME_FORMAT_2=`${DATE_FORMAT_2} ${TIME_FORMAT_1}`

export const formatDate=(date, format=DATE_FORMAT_1)=>{
  if(!date) {
    return '';
  }
  return moment(date).format(format)
}

export const getMomentObj=(string, format=DATE_FORMAT_2)=>{
  if(!isString(string)){
    return null
  }
  return moment(string, format)
}

export const convertDateObjToRange=(dateObj, format)=>{
  if(!isObject(dateObj)){
    return []
  }
  const dateArray=new Array(2)
  if(dateObj.from){
    dateArray[0]=getMomentObj(dateObj.from, format)
  }
  if(dateObj.to){
    dateArray[1]=getMomentObj(dateObj.to, format)
  }
  return dateArray
}

export const getTodayDateTime=(time, timeFormat=TIME_FORMAT_1, dateTimeFormat=DATE_TIME_FORMAT_1)=>{
  if(!time) {
    return undefined;
  }
  const timeMoment= moment(time, timeFormat)
  if(timeMoment.isValid) {
    return timeMoment.format(dateTimeFormat)
  }
  return undefined
}

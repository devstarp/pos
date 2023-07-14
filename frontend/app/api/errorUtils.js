import { findIndex, isArray, update } from "lodash";

export function getGeneralErrorMessages(error) {
  let message = '';
  if (error) {
    if (typeof (error) === 'string') return error;
    try {
      Object.keys(error).map((key) => {
        const item = error[key];
        message = `${message  }\n${  item.map(i => i)}`;
      });
    } catch (exception) {
      message = error.message; 
    }
  }
  return message;
}

export function get400ErrorMessages(error) {
  let message = '';
  if (typeof (error) === 'string') return error;
  Object.keys(error).map((key) => {
    const item = error[key];
    message = `${message + (message ? '\r\n' : '') + key  }: ${  item.map(i => i)}`;
  });
  return message;
}

// express-validation errrors
export const get422ErrorObject=(errors)=>{
  if(!errors ||!errors.length){
    return {}
  }
  const resultErrors=[]
  for(const error of errors){
    resultErrors.push({name:error.param, errors:[error.msg] })
  }
  return resultErrors
}


// sequelizeValidation
export const get430ErrorObject=(errors)=>{
  if(!errors ||!errors.length){
    return {}
  }
  const resultErrors=[]
  for(const error of errors){
    const existedIndex = findIndex(resultErrors, _error=>_error.name===error.path)
    if(existedIndex>=0){
      resultErrors[existedIndex].errors=isArray(resultErrors[existedIndex].errors)?[...resultErrors[existedIndex].errors,error.message]:[error.message]
    }else{
      resultErrors.push({name:error.path, errors:[error.message] })
    }
  }
  return resultErrors
}

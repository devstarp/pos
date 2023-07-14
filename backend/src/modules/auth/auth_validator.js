import { body, check } from 'express-validator';
import { findOneEmployee } from '../employee/employee_repository';

const validate = (method) => {
  switch (method) {
    case 'register': {
      return [
        body('id').custom(async(id,{req})=>{
          if(!id){
            return Promise.reject('required')
          }
          if(Number.isNaN(Number(id))){
            return Promise.reject('only number')
          }
          const employee = await findOneEmployee({ id });
          if (!employee){
            return Promise.reject('id is not registered')
          }else if(employee.full_name!==req.body.full_name){
            return Promise.reject('wrong name')
          }
        }),
        body('email').not().isEmail().withMessage('not email type').custom(async(email)=>{
          const employee = email && await findOneEmployee({ email });
          if (employee){
            return Promise.reject('Email already in use')
          }
        }),
        body('username').custom(async(username)=>{
          const employee = username && await findOneEmployee({ username });
          if (employee){
            return Promise.reject('username already in use')
          }
        }),
        body('full_name').not().isEmpty().withMessage('full_name can not be empty'),
        check('password').not().isEmpty().withMessage('required').isLength({min:5}).withMessage('password at least 5 chars'),
        body('confirm_password').custom((value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
          }
          // Indicates the success of this synchronous custom validator
          return true;
        }),
      ];
    }
    case 'login': {
      return [
        body('username').not().isEmpty().withMessage('username can not be empty'),
        body('password').not().isEmpty().withMessage('password can not be empty'),
      ];
    }

    default:
      return [];
  }
};

export default validate;

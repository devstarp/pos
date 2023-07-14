import { body } from 'express-validator';

const validate = (method) => {
  switch (method) {
    case 'createWithItems': {
      return [
          body('items').isArray({min:1}).withMessage('Items can not be empty'),
          // body('total_amount').not().isEmpty().withMessage('Total Amount can not be empty'),
          body('currency').not().isEmpty().withMessage('Currency can not be empty'),
          // body('total').not().isEmpty().withMessage('total can not be empty'),
          // body('tax_id').not().isEmpty().withMessage('tax can not be empty'),
        ];
      }
    default:
      return [];
  }
};

export default validate;

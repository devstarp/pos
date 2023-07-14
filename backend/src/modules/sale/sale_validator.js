import { body } from 'express-validator';

const validate = (method) => {
  switch (method) {
    case 'create': {
    return [
        body('supplier_id').not().isEmpty().withMessage('Supplier ID can not be empty'),
        // body('total').not().isEmpty().withMessage('total can not be empty'),
        // body('tax_id').not().isEmpty().withMessage('tax can not be empty'),
      ];
    }
    default:
      return [];
  }
};

export default validate;

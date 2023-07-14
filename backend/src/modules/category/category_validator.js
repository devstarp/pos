import { body } from 'express-validator';

const validate = (method) => {
  switch (method) {
    case 'category1': {
      return [
        body('name').not().isEmpty().withMessage('name can not be empty'),
        body('description').not(),
      ];
    }
    default:
      return [];
  }
};

export default validate;

import { validationResult } from 'express-validator';
import ResponseHelper from '../../helpers/response_helper';
import {
  createCategory,
  findListCategory,
  findCategoryById,
  updateCategory,
  deleteCategory,
  findCategoryFields,
} from './category_repository';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='author';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES
    const categories = await findListCategory(query, current, pageSize, includes);
    const meta = {
      page_size: pageSize,
      current,
      total: categories.count,
    };
    return ResponseHelper(res, 200, 'success get list data category', categories.rows, meta);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get category', error.message);
  }
};

const create = async (req, res) => {
  try {
    const { employee_id } = req.app.locals;
    const category = await createCategory({...req.body, author_id:employee_id}, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 201, 'success create new category', category);
  } catch (error) {
    console.error('creatd failed----', error.errors);
    return ResponseHelper(res, 430, 'failed create new category', error.errors);
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 422, 'Validation Error', errors.array());
  }

  try {
    const { id } = req.params;
    const { employee_id, employee_is_admin } = req.app.locals;
    const result = await updateCategory(req.body, { id }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success updated selected category', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated selected category', error.message);
  }
};

const remove = async (req, res)=>{
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;
    const result = await deleteCategory({ id });
    return ResponseHelper(res, 201, 'success deleted selected product', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected product', error.message);
  }
};

const restore = async (req, res)=>{
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;
    const result = await restoerCategory( { id } );
    return ResponseHelper(res, 201, 'success restored selected product', result);

  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected product', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 422, 'Validation Error', errors.array());
  }

  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;

    // // Check role admin
    // let user = await findUserById(employee_id);

    // if (Number(user.role) !== 1) {
    //   return ResponseHelper(res, 401, 'not allowed to access', [
    //     { message: 'not allowed to access', param: 'id' },
    //   ]);
    // }

    // Update category
    await deleteProduct({ id });

    // const result = await findCategoryById(id);

    return ResponseHelper(res, 201, 'success deleted selected category permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected category permanently', error.message);
  }
};

export { get, create, update, remove, restore, permanentRemove};

import { validationResult } from 'express-validator';
import ResponseHelper from '../../helpers/response_helper';
import {
  createProduct,
  deleteProduct,
  findListProduct,
  findOneProduct,
  findProductById,
  restoreProduct,
  updateProduct,
  updateProducts,
} from './product_repository';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='category,author';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES
    const products = await findListProduct(query, current, pageSize, includes, req.query.paranoid);
    const meta = {
      page_size: pageSize,
      current,
      total: products.count,
    };
    return ResponseHelper(res, 200, 'success get list data product', products.rows, meta);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get product', error.message);
  }
};

const getByBarcode= async (req, res) => {
  try {
    const product = await findOneProduct({barcode:req.params.barcode}, req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data product', product);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get product', error.message);
  }
};

const getById= async (req, res) => {
  try {
    const product = await findProductById(req.params.id, req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data product', product);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get product', error.message);
  }
};

const create = async (req, res) => {
  try {
      const { employee_id } = req.app.locals;
      const product = await createProduct({...req.body, author_id:employee_id}, req.query.includes|| DEFAULT_INCLUDES);
      return ResponseHelper(res, 201, 'success create new product', product);
    } catch (error) {
    console.error(error);
    return ResponseHelper(res, 430, 'failed create new product', error.errors);
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 422, 'Validation Error', errors.array());
  }
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await updateProduct(req.body, { id }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success updated selected product', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated selected product', error.message);
  }
};

const bulkUpdate = async (req, res) => {
  try {
    const { ids } = req.params;
    const { user_id } = req.app.locals;
    await updateProducts(req.body, { id:ids, editable:true });
    const result = await findListProduct({id:ids, editable:true});
    return ResponseHelper(res, 201, 'success updated products', result.rows);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated products', error.message);
  }
};

const remove = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await deleteProduct({ id });
    return ResponseHelper(res, 201, 'success deleted selected product', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected product', error.message);
  }
};

const restore = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await restoreProduct( { id } );
    return ResponseHelper(res, 201, 'success restored selected product', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected product', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    await deleteProduct({ id });
    return ResponseHelper(res, 201, 'success deleted selected category permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected category permanently', error.message);
  }
};

export { get, create, update, getByBarcode, getById, remove, restore, permanentRemove, bulkUpdate };

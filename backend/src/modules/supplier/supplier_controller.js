import { validationResult } from 'express-validator';
import ResponseHelper from '../../helpers/response_helper';
import { 
  createSupplier, findOnesupplier, findSupplierById, 
  updateSupplier, findListSupplier, deleteSupplier, restoreSupplier 
} from './supplier_repository';
// Get suppliers
const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='user';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES

    const suppliers = await findListSupplier(query, current, pageSize, includes);

    const meta = {
      page_size: pageSize,
      current,
      total: suppliers.count,
    };
    return ResponseHelper(res, 200, 'success get list data supplier', suppliers.rows, meta);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get supplier', error.message);
  }
};

const getById= async (req, res) => {
  try {
    const product = await findSupplierById(req.params.id, req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get supplier', product);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get supplier', error.message);
  }
};


// Create new supplier
const create = async (req, res) => {
  try {
    const { user_id } = req.app.locals;
    const supplier = await createSupplier({...req.body, user_id}, req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get details supplier', supplier);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get details supplier', error.message);
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 442, 'validation error', errors.array());
  }

  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;

    const supplier = await findSupplierById(id);

    // Check supplier already exist in database or not
    if (!supplier) {
      return ResponseHelper(res, 404, 'supplier not found', [
        { message: 'supplier not found', param: 'id' },
      ]);
    }
    if (!supplier) {
      return ResponseHelper(res, 409, 'supplier is not exist', [
        { errors: ['supplier is not exist'], name: 'id' },
      ]);
    } else if(!supplier.editable){
      return ResponseHelper(res, 409, 'can not edit supplier', [
        { errors: ['can not edit supplier'], name: 'editable' },
      ]);
    }else if(!supplier.enabled){
      return ResponseHelper(res, 409, 'supplier is not enabled', [
        { errors: ['supplier is not enabled'], name: 'enabled' },
      ]);
    }

    const result = await updateSupplier(req.body, { id }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success edit supplier', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed edit supplier', error.message);
  }
};

const remove = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    await deleteSupplier({ id });
    return ResponseHelper(res, 201, 'success deleted selected supplier', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected supplier', error.message);
  }
};

const restore = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await restoreSupplier( { id }, req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 201, 'success restored selected supplier', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected supplier', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    await deleteSupplier({ id });
    return ResponseHelper(res, 201, 'success deleted selected category permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected category permanently', error.message);
  }
};


export {  update, create, get, restore, remove, permanentRemove, getById };

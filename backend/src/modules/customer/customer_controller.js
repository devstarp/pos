import { validationResult } from 'express-validator';
import ResponseHelper from '../../helpers/response_helper';
import { createCustomer, deleteCustomer, findCustomerById, updateCustomer, findListCustomer } from './customer_repository';
// Get Customers
const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='user';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES

    const customers = await findListCustomer(query, current, pageSize, includes);

    const meta = {
      page_size: pageSize,
      current,
      total: customers.count,
    };
    return ResponseHelper(res, 200, 'success get list data customer', customers.rows, meta);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get customers', error.message);
  }
};


const getById= async (req, res) => {
  try {
    const product = await findCustomerById(req.params.id, req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get customer', product);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get customer', error.message);
  }
};
// Create new Customer
const create = async (req, res) => {
  try {
    const { employee_id } = req.app.locals;
    const customer = await createCustomer({...req.body, author_id: employee_id}, req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get details customer', customer);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get details customer', error.message);
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 442, 'validation error', errors.array());
  }

  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;

    const customer = await findCustomerById(id);

    // Check customer already exist in database or not
    if (!customer) {
      return ResponseHelper(res, 404, 'customer not found', [
        { message: 'customer not found', param: 'id' },
      ]);
    }
    if (!customer) {
      return ResponseHelper(res, 409, 'customer is not exist', [
        { errors: ['customer is not exist'], name: 'id' },
      ]);
    } else if(!customer.editable){
      return ResponseHelper(res, 409, 'can not edit customer', [
        { errors: ['can not edit customer'], name: 'editable' },
      ]);
    }else if(!customer.enabled){
      return ResponseHelper(res, 409, 'customer is not enabled', [
        { errors: ['customer is not enabled'], name: 'enabled' },
      ]);
    }

    const result = await updateCustomer(req.body, { id }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success edit customer', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed edit customer', error.message);
  }
};

const remove = async (req, res)=>{
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;

    // Check customer is exist
    const customer = await findCustomerById(id);

    if (!customer) {
      return ResponseHelper(res, 409, 'customer is not exist', [
        { errors: ['customer is not exist'], name: 'id' },
      ]);
    } else if(!customer.enabled){
      return ResponseHelper(res, 409, 'customer is already inenabled', [
        { errors: ['customer is already inenabled'], name: 'enabled' },
      ]);
    }

    const result = await updateCustomer(
      {enabled:false, editable:false, new:false, deleted_at:new Date(Date.now())},
       { id:Number(id) }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success deleted selected customer', result);

  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected customer', error.message);
  }
};

const restore = async (req, res)=>{
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;

    // Check customer is exist
    const customer = await findCustomerById(id);

    if (!customer) {
      return ResponseHelper(res, 409, 'customer is not exist', [
        { errors: ['customer is not exist'], name: 'id' },
      ]);
    } else if(customer.enabled){
      return ResponseHelper(res, 409, 'customer is already enabled', [
        { errors: ['customer is enabled'], name: 'enabled' },
      ]);
    }

    const result = await updateCustomer( {enabled:true, editable:true}, { id }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success restored selected customer', result);

  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected customer', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;
    await deleteCustomer({ id });
    return ResponseHelper(res, 201, 'success deleted selected category permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected category permanently', error.message);
  }
};



export { getById, update, create, get, remove, restore, permanentRemove };

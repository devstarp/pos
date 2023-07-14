import { validationResult } from 'express-validator';
import ResponseHelper from '../../helpers/response_helper';
import { deleteEmployee, findListEmployees, createEmployee, findEmployeeById, restoreEmployee, updateEmployee } from './employee_repository';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='department';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES
    const employees = await findListEmployees(query, current, pageSize, includes);
    const meta = {
      page_size: pageSize,
      current,
      total: employees.count,
    };
    return ResponseHelper(res, 200, 'success get list data employee', employees.rows, meta);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get employee', error.message);
  }
};

const getById= async (req, res) => {
  try {
    const employee = await findEmployeeById(Number(req.params.id), req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data employee', employee);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get employee', error.message);
  }
};

const create = async (req, res) => {
  try {
      const { employee_id } = req.app.locals;
      const employee = await createEmployee({...req.body,  author_id: employee_id}, req.query.includes|| DEFAULT_INCLUDES);
      return ResponseHelper(res, 201, 'success create new employee', employee);
    } catch (error) {
    console.error(error);
    return ResponseHelper(res, 430, 'failed create new employee', error.errors);
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
    const result = await updateEmployee(req.body, { id }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success updated selected employee', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated selected employee', error.message);
  }
};

const remove = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await deleteEmployee({ id });
    return ResponseHelper(res, 201, 'success deleted selected employee', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected employee', error.message);
  }
};

const restore = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await restoreEmployee( { id } );
    return ResponseHelper(res, 201, 'success restored selected employee', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected employee', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    await deleteEmployee({ id },true);
    return ResponseHelper(res, 201, 'success deleted selected category permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected category permanently', error.message);
  }
};
export { get, getById, create, update,  remove, restore, permanentRemove };

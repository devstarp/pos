import { validationResult } from 'express-validator';
import ResponseHelper from '../../helpers/response_helper';
import { createDepartment, deleteDepartment, findDepartmentById, findListDepartments, restoreDepartment, updateDepartment } from './department_repository';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='leader';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES
    const departments = await findListDepartments(query, current, pageSize, includes);
    const meta = {
      page_size: pageSize,
      current,
      total: departments.count,
    };
    return ResponseHelper(res, 200, 'success get list data department', departments.rows, meta);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get department', error.message);
  }
};

const getById= async (req, res) => {
  try {
    const department = await findDepartmentById(req.params.id, req.query.includes|| DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data department', department);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get department', error.message);
  }
};

const create = async (req, res) => {
  try {
      const { employee_id } = req.app.locals;
      const department = await createDepartment(req.body, req.query.includes|| DEFAULT_INCLUDES);
      return ResponseHelper(res, 201, 'success create new department', department);
    } catch (error) {
    console.error(error);
    return ResponseHelper(res, 430, 'failed create new department', error.errors);
  }
};

const update = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 422, 'Validation Error', errors.array());
  }
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;
    const result = await updateDepartment(req.body, { id }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success updated selected department', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated selected department', error.message);
  }
};

const remove = async (req, res)=>{
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;
    const result = await deleteDepartment({ id });
    return ResponseHelper(res, 201, 'success deleted selected department', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected department', error.message);
  }
};

const restore = async (req, res)=>{
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;
    const result = await restoreDepartment( { id } );
    return ResponseHelper(res, 201, 'success restored selected department', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected department', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { employee_id } = req.app.locals;
    await deleteDepartment({ id },true);
    return ResponseHelper(res, 201, 'success deleted selected category permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected category permanently', error.message);
  }
};
export { get, getById, create, update,  remove, restore, permanentRemove };

import ResponseHelper from '../../helpers/response_helper';
import {
  createSaleItem,
  findListSaleItem,
  findSaleItemById,
  updateSaleItem,
  deleteSaleItem,
} from './sale_item_repository';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='customer,user,sale,product';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES
    const sales = await findListSaleItem(query, current, pageSize, includes);

    const meta = {
      page_size: pageSize,
      current,
      total: sales.count,
    };

    return ResponseHelper(res, 200, 'success get list data sale', sales.rows, meta);
  } catch (error) {
    console.error('get error===', error);
    return ResponseHelper(res, 500, 'failed get sale', error.message);
  }
};

const getById = async (req, res) => {
  try {
    const sale = await findSaleItemById(req.params.id, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data sale detail', sale);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get sale detail', error.message);
  }
};

const create = async (req, res) => {
  try {
    const { user_id } = req.app.locals;
    const sale = await createSaleItem({...req.body, user_id}, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 500, 'failed create new sale', sale);
  } catch (error) {
    console.error('create error===', error);
    return ResponseHelper(res, 500, 'failed create new sale', error.message);
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
    const result = await updateSaleItem(req.body, { id }, req.query.includes || DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success updated selected sale', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated selected sale', error.message);
  }
};

const remove = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await deletePurchaseItem({ id });
    return ResponseHelper(res, 201, 'success deleted selected product', id);

  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected product', error.message);
  }
};

const restore = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await restoreSaleItem(id, req.query.includes || DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success restored selected saleItem', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected saleItem', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    await deleteSaleItem({ id });
    return ResponseHelper(res, 201, 'success deleted selected saleItem permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected saleItem permanently', error.message);
  }
};

export { get, create, update, remove, restore, permanentRemove };

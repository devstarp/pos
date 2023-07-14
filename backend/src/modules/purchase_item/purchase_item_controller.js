import ResponseHelper from '../../helpers/response_helper';
import {
  createPurchaseItem,
  findListPurchaseItem,
  findPurchaseItemById,
  updatePurchaseItem,
  deletePurchaseItem,
  restorePurchaseItem,
} from './purchase_item_repository';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='supplier,author,purchase,product';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES
    const purchases = await findListPurchaseItem(query, current, pageSize, includes);

    const meta = {
      page_size: pageSize,
      current,
      total: purchases.count,
    };

    return ResponseHelper(res, 200, 'success get list data purchase', purchases.rows, meta);
  } catch (error) {
    console.error('get error===', error);
    return ResponseHelper(res, 500, 'failed get purchase', error.message);
  }
};

const getById = async (req, res) => {
  try {
    const purchase = await findPurchaseItemById(req.params.id, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data purchase detail', purchase);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get purchase detail', error.message);
  }
};

const create = async (req, res) => {
  try {
    const { employee_id } = req.app.locals;
    const purchaseItem = await createPurchaseItem({...req.body, author_id: employee_id}, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success create Purchase', purchaseItem);
  } catch (error) {
    console.error('create error===', error);
    return ResponseHelper(res, 500, 'failed create new purchase', error.message);
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
    const result = await updatePurchaseItem(req.body, { id }, req.query.includes || DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success updated selected purchase', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated selected purchase', error.message);
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
    const result = await restorePurchaseItem(id, req.query.includes || DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success restored selected purchaseItem', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected purchaseItem', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    await deletePurchaseItem({ id }, true);
    return ResponseHelper(res, 201, 'success deleted selected purchaseItem permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected purchaseItem permanently', error.message);
  }
};

export { get, create, update, remove, restore, permanentRemove };

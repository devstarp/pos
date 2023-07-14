import { validationResult } from 'express-validator';
import ResponseHelper from '../../helpers/response_helper';
import {
  createPurchase,
  findListPurchase,
  findPurchaseById,
  updatePurchase,
  updatePurchases,
  findPurchaseFields,
  deletePurchase,
  restorePurchase,
  findOnePurchase,
  getPurchaseStatistics
} from './purchase_repository';
import { createPurchaseItems, findListPurchaseItem, updatePurchaseItems } from '../purchase_item/purchase_item_repository';
import { purchaseProductById } from '../product/product_repository';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='supplier,author,items';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES
    const purchases = await findListPurchase(query, current, pageSize, includes);

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

const getStatistics = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || 'author'
    const purchases = await getPurchaseStatistics(query, current, pageSize, includes);
    return ResponseHelper(res, 200, 'success get list data purchase', purchases);
  } catch (error) {
    console.error('get error===', error);
    return ResponseHelper(res, 500, 'failed get purchase', error.message);
  }
};

const getFields = async (req, res) => {
  try {
    const fields = await findPurchaseFields();
    return ResponseHelper(res, 200, 'success get list data order', fields);
  } catch (error) {
    console.error('get error===', error);
    return ResponseHelper(res, 500, 'failed get order', error.message);
  }
};

const getById = async (req, res) => {
  try {
    const purchase = await findPurchaseById(req.params.id, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data purchase detail', purchase);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get purchase detail', error.message);
  }
};

const getItems = async (req, res) => {
  try {
    const purchaseItems = await findListPurchaseItem({purchase_id:req.params.id},undefined,undefined,'product');
    return ResponseHelper(res, 200, 'success get list data purchase detail', purchaseItems.rows);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get purchase detail', error.message);
  }
};

const getByOrderNumber= async (req, res) => {
  try {
    const product = await findOnePurchase({order_number:req.params.orderNumber}, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data product', product);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get product', error.message);
  }
};

const create = async (req, res) => {
  try {
    const { employee_id } = req.app.locals;
    const purchase = await createPurchase({...req.body, author_id: employee_id}, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 500, 'failed create new purchase', purchase);
  } catch (error) {
    console.error('create error===', error);
    return ResponseHelper(res, 500, 'failed create new purchase', error.message);
  }
};

const createWithItems = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return ResponseHelper(res, 422, 'validation error', errors.array());
  }
    try {
    const { employee_id } = req.app.locals;
    const {items, ...draft}=req.body
    let purchase = await createPurchase({...draft, author_id:employee_id});
    let purchaseItems = items.map(item=>(
      {
        ...item, name:undefined, author_id:purchase.author_id, 
        purchase_id:purchase.id, supplier_id:purchase.supplier_id
      }
    ))
    purchaseItems = await createPurchaseItems(purchaseItems)
    for( const purchaseItem of purchaseItems){
      await purchaseProductById(purchaseItem.product_id, purchaseItem)
    }
    purchase = await findPurchaseById(purchase.id, req.query||DEFAULT_INCLUDES)
    return ResponseHelper(res, 201, 'success create new purchase', purchase);
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
    const result = await updatePurchase(req.body, { id }, req.query.includes|| DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success updated selected purchase', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated selected purchase', error.message);
  }
};

const bulkUpdate = async (req, res) => {
  try {
    const { ids } = req.params;
    const { user_id } = req.app.locals;
    await updatePurchases(req.body, { id:ids, editable:true });
    await updatePurchaseItems(req.body, { purchase_id:ids, editable:true });
    const result = await findListPurchase({id:ids, editable:true}, undefined,undefined,DEFAULT_INCLUDES);
    return ResponseHelper(res, 201, 'success updated purhcases', result.rows);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated purhcases', error.message);
  }
};

const remove = async (req, res)=>{
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    const result = await deletePurchase({ id });
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
    const includes = ['category', 'user']
    const result = await restorePurchase( { id }, includes );
    return ResponseHelper(res, 201, 'success restored selected purchase', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected purchase', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    await deletePurchase({ id });
    return ResponseHelper(res, 201, 'success deleted selected category permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected category permanently', error.message);
  }
};

export { 
  get, getStatistics, getById, getFields, getByOrderNumber, getItems,
  create, createWithItems, update,bulkUpdate,
  remove, restore, permanentRemove 
};

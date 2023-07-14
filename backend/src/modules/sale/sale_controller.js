import ResponseHelper from '../../helpers/response_helper';
import {
  findListSale,
  findSaleById,
  findOneSale,
  createSale,
  updateSale,
  deleteSale,
  restoreSale,
  updateSales,
} from './sale_repository';
import { createSaleItems, createSaleItem, updateSaleItems } from '../sale_item/sale_item_repository';
import { saleProductById } from '../product/product_repository';
import { findListPurchaseItem } from '../purchase_item/purchase_item_repository';
import { createSalePurchaseItem } from '../sale_purchase_item/sale_purchase_item_repository';

const DEFAULT_LIMIT = 50;
const DEFAULT_PAGE = 1;
const DEFAULT_INCLUDES='customer,author,items';

const get = async (req, res) => {
  try {
    let {current, page_size: pageSize, includes, ...query}=req.query
    pageSize = parseInt(pageSize)||DEFAULT_LIMIT;
    current = parseInt(current)||DEFAULT_PAGE;
    includes = includes || DEFAULT_INCLUDES
    const sales = await findListSale(query, current, pageSize, includes);

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
    const sale = await findSaleById(req.params.id, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data sale detail', sale);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get sale detail', error.message);
  }
};

const getByOrderNumber= async (req, res) => {
  try {
    const product = await findOneSale({order_number:req.params.orderNumber}, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 200, 'success get list data product', product);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed get product', error.message);
  }
};

const create = async (req, res) => {
  try {
    const { employee_id } = req.app.locals;
    const sale = await createSale({...req.body, author_id:employee_id}, req.query.includes || DEFAULT_INCLUDES);
    return ResponseHelper(res, 500, 'failed create new sale', sale);
  } catch (error) {
    console.error('create error===', error);
    return ResponseHelper(res, 500, 'failed create new sale', error.message);
  }
};

const createWithItems = async (req, res) => {
  try {
    const { employee_id } = req.app.locals;
    const {items, ...draft}=req.body
    let sale = await createSale({...draft, author_id:employee_id});
    let saleItems = items.map(item=>(
      {
        ...item, name:undefined, author_id:sale.author_id, 
        sale_id:sale.id, customer_id:sale.customer_id
      }
    ))
    // saleItems = await createSaleItems(saleItems)
    for( const saleItem of saleItems){
      await saleProductById(saleItem.product_id, saleItem);
      const resultItem = await createSaleItem(saleItem);
      const {rows:purchaseItems} = await findListPurchaseItem({product_id:resultItem.product_id, remained_quantity_from:1, created_at_order:'asc'});
      let quantity = resultItem.quantity;
      for(const purchaseItem of purchaseItems){
        if(purchaseItem.remained_quantity<=quantity){
          await createSalePurchaseItem({purchase_item_id:purchaseItem.id, sale_item_id: resultItem.id, quantity:purchaseItem.remained_quantity})
          quantity -= purchaseItem.remained_quantity
          purchaseItem.remained_quantity = 0;
          await purchaseItem.save()
        }else{
          await createSalePurchaseItem({purchase_item_id:purchaseItem.id, sale_item_id: resultItem.id, quantity})
          purchaseItem.remained_quantity -= quantity;
          quantity = 0;
          await purchaseItem.save()
        }
        if(quantity===0){
          break;
        }
      }
    }
    sale = await findSaleById(sale.id, req.query||DEFAULT_INCLUDES)
    return ResponseHelper(res, 201, 'success create new purchase', sale);
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
    const result = await updateSale(req.body, { id }, req.query.includes || DEFAULT_INCLUDES );
    return ResponseHelper(res, 201, 'success updated selected sale', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed updated selected sale', error.message);
  }
};

const bulkUpdate = async (req, res) => {
  try {
    const { ids } = req.params;
    const { user_id } = req.app.locals;
    await updateSales(req.body, { id:ids, editable:true });
    await updateSaleItems(req.body, { sale_id:ids, editable:true });
    const result = await findListSale({id:ids, editable:true}, undefined,undefined,DEFAULT_INCLUDES);
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
    const result = await deleteSale({ id });
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
    const result = await restoreSale( { id }, includes );
    return ResponseHelper(res, 201, 'success restored selected sale', result);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed restored selected sale', error.message);
  }
};

const permanentRemove =  async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.app.locals;
    await deleteSale({ id });
    return ResponseHelper(res, 201, 'success deleted selected category permanently', id);
  } catch (error) {
    console.error(error);
    return ResponseHelper(res, 500, 'failed deleted selected category permanently', error.message);
  }
};

export { 
  get, getById, getByOrderNumber, 
  create, createWithItems, update,bulkUpdate,
  remove, restore, permanentRemove 
};

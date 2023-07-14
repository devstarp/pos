import db from '../../database/models';
import { Op } from 'sequelize';
import parse from '../../helpers/parse'
import { getLimit, getOffset, getOrder, getRangeQuery, getStringQuery } from '../../helpers/db_query';

const { Purchases, PurchaseItems, Products, Employees, Suppliers,SaleItems } = db;

export const getWhere=(query)=>{
  const conditions=[]
  if(typeof query !=='object'){
    return undefined
  }

  //author_id, category_id, purchase_currency, sale_currency, barcode, 
  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
  }

  if(query.purchase_id){
    conditions.push(getStringQuery(query.purchase_id, 'purchase_id'))
  }

  if(query.product_id){
    conditions.push(getStringQuery(query.product_id, 'product_id'))
  }

  if(query.author_id){
    conditions.push(getStringQuery(query.author_id, 'author_id'))
  }

  if(query.supplier_id){
    conditions.push(getStringQuery(query.supplier_id, 'supplier_id'))
  }

  if(query.currency){
    conditions.push(getStringQuery(query.currency, 'currency'))
  }

  //created_at, updated_at, deleted_at date from and to 

  const createdAt = getRangeQuery(
      parse.getDateIfValid(query.created_at_from), parse.getDateIfValid(query.created_at_to), 'created_at'
    );

  if(createdAt){
    conditions.push(createdAt)
  }

  const updatedAt = getRangeQuery(
    parse.getDateIfValid(query.updated_at_from), parse.getDateIfValid(query.updated_at_to), 'updated_at'
  );

  if(updatedAt){
    conditions.push(createdAt)
  }
  
  const deletedAt = getRangeQuery(
    parse.getDateIfValid(query.deleted_at_from), parse.getDateIfValid(query.deleted_at_to), 'deleted_at'
  );

  if(deletedAt){
    conditions.push(createdAt)
  }

  //price, quantity, currency_rate, total, number from to 
  const price = getRangeQuery(
    parse.getNumberIfPositive(query.price_from), parse.getNumberIfPositive(query.price_to), 'price'
  );

  if(price){
    conditions.push(price)
  }

  const total = getRangeQuery(
    parse.getNumberIfPositive(query.total_from), parse.getNumberIfPositive(query.total_to), 'total'
  );

  if(total){
    conditions.push(total)
  }

  const quantity = getRangeQuery(
    parse.getNumberIfPositive(query.quantity_from), parse.getNumberIfPositive(query.quantity_to), 'quantity'
  );

  if(quantity){
    conditions.push(quantity)
  }

  
  const remainedQuantity = getRangeQuery(
    parse.getNumberIfPositive(query.remained_quantity_from), parse.getNumberIfPositive(query.remained_quantity_to), 'remained_quantity'
  );

  if(remainedQuantity){
    conditions.push(remainedQuantity)
  }

  const currencyRate = getRangeQuery(
    parse.getNumberIfPositive(query.currency_rate_from), parse.getNumberIfPositive(query.currency_rate_to), 'currency_rate'
  );

  if(currencyRate){
    conditions.push(currencyRate)
  }

  // new, available, editable boolean
  if(query.new){
    conditions.push({new: parse.getBoolNumberIfValid(query.new)})
  }

  if(query.available){
    conditions.push({available: parse.getBoolNumberIfValid(query.available)})
  }

  if(query.editable){
    conditions.push({editable: parse.getBoolNumberIfValid(query.editable)})
  }

  if(conditions.length===0){
    return undefined
  }

  if(query.operation==='OR'){
    return {[Op.or]:conditions}
  }
  return {[Op.and]:conditions}
}

export const getInclude=(_includes)=>{
  if(typeof _includes !=='string'){
    return undefined
  }
  const includes= _includes.split(',')
  const result=[]
  for(const include of includes){
    switch (include) {
      case 'product':
        result.push({
          model:Products,
          as: 'product',
          attributes: ['id', 'name', 'product_code', 'purchase_price', 'sale_price'],
        })
        break;
      case 'supplier':
          result.push({
            model:Suppliers,
            as: 'supplier',
            attributes: ['id', 'name', 'mobile_phone'],
          })
          break;
      case 'author':
            result.push({
              model:Employees,
              as: 'author',
              attributes: ['id', 'username', 'first_name', 'last_name'],
            })
          break;        
      case 'purchase':
        result.push({
          model:Purchases,
          as: 'purchase',
          attributes: ['id', 'order_number', 'author_id'],
        })
        break;
      case 'sales':
        result.push({
          model:SaleItems,
          as: 'sale_items',
        })
        break;  
      default:
        break;
    }
  }
  return result
}

// Find one purchase item by id
const findPurchaseItemById = async (id, includes) => {
  try {
    let result = await PurchaseItems.findByPk(id, {include: getInclude(includes)});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOrderById', error);
    throw error;
  }
};

// Find one purchase item by filter
const findOnePurchaseItem = async (query, includes) => {
  try {
    const result = await Products.findOne({
      where:getWhere(query),
      include:getInclude(includes)
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneOrder', error);
    throw error;
  }
};

// Find list purchase item
const findListPurchaseItem = async (query,  page, limit, includes) => {
  try {
    console.log('getInclude(includes)---', getInclude(includes))
    const result = await PurchaseItems.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order: getOrder(query)
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListPurchaseItem', error);
    throw error;
  }
};

// Create new purchase item
const createPurchaseItem = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await PurchaseItems.create(data, { transaction });
    if(includes){
      result = await findPurchaseItemById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] create purchase item', error);
    throw error;
  }
};

// Create new purchase items
const createPurchaseItems = async (dataArray, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await PurchaseItems.bulkCreate(dataArray, { transaction });
    if(includes){
      const id = result.map(ele=>ele.id).join(',')
      result = await findListPurchaseItem({id}, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] create purchase item', error);
    throw error;
  }
};

// Update purchase item
const updatePurchaseItem = async (data, query, includes, isAdmin, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOnePurchaseItem(query, includes);
    if(isAdmin || result.editable){
      await result.update(data)
    }else {
      throw new Error('can not edit')
    }
    await result.save()
    if (!transaction) t.commit();
    return result
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] updatePurchaseItem', error);
    throw error;
  }
};

// Update purchase Items
const updatePurchaseItems = async (data, query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await PurchaseItems.update(data, { where:getWhere(query), returning:true, transaction });
    if (!transaction) t.commit();
    return result
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] updatePurchaseItems', error);
    throw error;
  }
};

//Permanently Delete Purchase Item from DB
const deletePurchaseItem = async (query, force, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await PurchaseItems.destroy({ where:getWhere(query), force, transaction });
    if(!force){
      result = await findOnePurchaseItem(query, includes, true)
    }else{
      result = query;
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};

//Restore Purchase Item from DB
const restorePurchaseItem = async (query, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await PurchaseItems.restore({ where:getWhere(query), transaction });
    result = await findOnePurchase(query, includes)
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};

export { 
  findPurchaseItemById, deletePurchaseItem, findListPurchaseItem, updatePurchaseItems,
  createPurchaseItem, updatePurchaseItem, findOnePurchaseItem, createPurchaseItems, restorePurchaseItem 
};

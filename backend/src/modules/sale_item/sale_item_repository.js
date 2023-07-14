import db from '../../database/models';
import { Op } from 'sequelize';
import parse from '../../helpers/parse'
import { getLimit, getOffset, getOrder, getRangeQuery, getStringQuery } from '../../helpers/db_query';

const { Sales, SaleItems, Products, Customers, Employees, PurchaseItems } = db;

export const getWhere=(query)=>{
  const conditions=[]
  if(typeof query !=='object'){
    return undefined
  }

  //author_id, category_id, sale_currency, sale_currency, barcode, 
  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
  }

  if(query.sale_id){
    conditions.push(getStringQuery(query.sale_id, 'sale_id'))
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
      case 'customer':
          result.push({
            model:Customers,
            as: 'customer',
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
      case 'sale':
        result.push({
          model:Sales,
          as: 'sale',
          attributes: ['id', 'order_number', 'author_id'],
        })
        break;
      case 'purchases':
        result.push({
          model:PurchaseItems,
          as: 'purchase_items',
        })
        break;    
      default:
        break;
    }
  }
  return result
}

// Find one sale item by id
const findSaleItemById = async (id, includes) => {
  try {
    let result = await SaleItems.findByPk(id, {include: getInclude(includes)});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findSaleItemById', error);
    throw new Error(error);
  }
};

// Find one sale item by filter
const findOneSaleItem = async (query, includes) => {
  try {
    const result = await SaleItems.findOne({
      where:getWhere(query),
      include:getInclude(includes)
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneSaleItem', error);
    throw new Error(error);
  }
};

// Find list sale item
const findListSaleItem = async (query,  page, limit, includes, paranoid) => {
  try {
    console.log('getInclude(includes)---', getInclude(includes))
    const result = await SaleItems.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order: getOrder(query),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListSaleItem', error);
    throw new Error(error);
  }
};

// Create new sale item
const createSaleItem = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await SaleItems.create(data, { transaction });
    if(includes){
      result = await findSaleItemById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createSaleItem', error);
    throw new Error(error);
  }
};

// Create new sale items
const createSaleItems = async (dataArray, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    console.log('dataArray---', dataArray)
    let result = await SaleItems.bulkCreate(dataArray, { transaction });
    if(includes){
      const id = result.map(ele=>ele.id).join(',')
      result = await findListSaleItem({id}, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createSaleItems', error);
    throw new Error(error);
  }
};

// Update sale item
const updateSaleItem = async (data, query, includes, isAdmin, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOneSaleItem(query, includes);
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
    console.error('[EXCEPTION] updateSaleItem', error);
    throw new Error(error);
  }
};

// Update Sale Items
const updateSaleItems = async (data, query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await SaleItems.update(data, { where:getWhere(query), returning:true, transaction });
    if (!transaction) t.commit();
    return result
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] updateSales', error);
    throw error;
  }
};

//Permanently Delete sale Item from DB
const deleteSaleItem = async (query, force, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await SaleItems.destroy({ where:getWhere(query), force, transaction });
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
    throw new Error(error);
  }
};


//Restore Sale Item from DB
const restoreSaleItem = async (query, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await SaleItems.restore({ where:getWhere(query), transaction });
    result = await findOneSaleItem(query, includes)
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};


export { 
  findSaleItemById, deleteSaleItem, findListSaleItem, createSaleItems,
  createSaleItem, updateSaleItem, updateSaleItems, findOneSaleItem, restoreSaleItem 
};

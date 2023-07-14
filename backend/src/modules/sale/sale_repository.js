import db from '../../database/models';
import { Op } from 'sequelize';
import { v1 as uuidv1 } from 'uuid';
import parse from '../../helpers/parse'
import { getRangeQuery, getSearchQuery, getStringQuery, getLimit, getOrder, getOffset } from '../../helpers/db_query';

const { Sales, SaleItems, Customers, Employees } = db;


export const getWhere=(query)=>{
  const conditions=[]
  if(typeof query !=='object'){
    return undefined
  }
  
  if(query.comment){
    conditions.push(getSearchQuery(query.comment, 'comment'))
  }

  //author_id, category_id, same
  
  if(query.order_number){
    conditions.push(getStringQuery(query.order_number, 'order_number'))
  }

  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
  }

  if(query.author_id){
    conditions.push(getStringQuery(query.author_id, 'author_id'))
  }

  if(query.customer_id){
    conditions.push(getStringQuery(query.customer_id, 'customer_id'))
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
  //total_amount, sale_price, subtotal_amount number from to 
  const totalAmount = getRangeQuery(
    parse.getNumberIfPositive(query.total_amount_from), parse.getNumberIfPositive(query.total_amount_to), 'total_amount'
  );

  if(totalAmount){
    conditions.push(totalAmount)
  }

  const subTotalAmount = getRangeQuery(
    parse.getNumberIfPositive(query.subtotal_amount_from), parse.getNumberIfPositive(query.subtotal_amount_to), 'subtotal_amount'
  );

  if(subTotalAmount){
    conditions.push(subTotalAmount)
  }

  const currencyRate = getRangeQuery(
    parse.getNumberIfPositive(query.currency_rate_from), parse.getNumberIfPositive(query.currency_rate_from), 'currency_rate'
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
      case 'author':
        result.push({
          model:Employees,
          as: 'author',
          attributes: ['id', 'first_name', 'last_name'],
        })
        break;
      case 'customer':
        result.push({
          model:Customers,
          as: 'customer',
          attributes: ['id', 'name', 'mobile_phone'],
        })
        break;
      case 'items':
        result.push({
            model:SaleItems,
            as: 'items',
            attributes: ['id', 'price', 'quantity', 'product_id', 'total'],
          })
        break;  
      default:
        break;
    }
  }
  return result
}

// Find one Sale by id
const findSaleById = async (id, includes) => {
  try {
    const result = await Sales.findByPk(id,{include:getInclude(includes)});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findSaleById', error);
    throw new Error(error);
  }
};

// Find one Sale by filter
const findOneSale = async (query, includes) => {
  try {
    const result = await Sales.findOne({
      where:getWhere(query),
      include:getInclude(includes)
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneOrder', error);
    throw new Error(error);
  }
};

// Find list order
const findListSale = async (query,  page, limit, paranoid, includes) => {
  try {
    const result = await Sales.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order: getOrder(query),
      paranoid
    });

    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListSale', error);
    throw new Error(error);
  }
};

// Find  Sale fields
const findSaleFields = async () => {
  try {
    const result = []
    for (const key in Sales.rawAttributes) {
      result.push({[key]:Sales.rawAttributes[key]});
    }
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListCategory', error);
    throw new Error(error);
  }
};

// Create new Sale
const createSale = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Sales.create(data, { transaction });
    if(includes){
      result = await findSaleById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createOrder', error);
    throw error;
  }
};

// Update Sale
const updateSale = async (data, query, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOneSale(query, includes);
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
    console.error('[EXCEPTION] updateProduct', error);
    throw new Error(error);
  }
};

// Update Sales
const updateSales = async (data, query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await Sales.update(data, { where:getWhere(query), returning:true, transaction });
    if (!transaction) t.commit();
    return result
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] updateSales', error);
    throw error;
  }
};

const deleteSale = async (query, force, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await Sales.destroy({ where:getWhere(query), force, transaction });
    if(!force){
      result = await findOneSale(query, includes, true)
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

//Restore Product from DB
const restoreSale = async (query, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Sales.restore({ where:getWhere(query), transaction });
    result = await findOneSale(query, includes)
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};

export { 
  findSaleFields, findSaleById, findOneSale, findListSale, 
  createSale, updateSale, updateSales, deleteSale, restoreSale
};

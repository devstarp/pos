import db from '../../database/models';
import { Op, fn, col } from 'sequelize';
import { v1 as uuidv1 } from 'uuid';
import parse from '../../helpers/parse'
import { getRangeQuery, getSearchQuery, getStringQuery, getLimit, getOrder, getOffset } from '../../helpers/db_query';

const { Purchases, PurchaseItems, Employees, Suppliers } = db;

export const getWhere=(query)=>{
  const conditions=[]
  if(typeof query !=='object'){
    return undefined
  }
  
  if(query.comment){
    conditions.push(getSearchQuery(query.comment, 'comment'))
  }

  //author_id, category_id, purchase_currency, sale_currency, same
  
  if(query.order_number){
    conditions.push(getStringQuery(query.order_number, 'order_number'))
  }

  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
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
      case 'supplier':
        result.push({
          model:Suppliers,
          as: 'supplier',
          attributes: ['id', 'name', 'mobile_phone'],
        })
        break;
      case 'items':
        result.push({
            model:PurchaseItems,
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

// Find one purchase by id
const findPurchaseById = async (id, includes, paranoid) => {
  try {
    const result = await Purchases.findByPk(id,{include:getInclude(includes), paranoid});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findPurchaseById', error);
    throw error;
  }
};

// Find one purchase by filter
const findOnePurchase = async (query, includes, paranoid) => {
  try {
    const result = await Purchases.findOne({
      where:getWhere(query),
      include:getInclude(includes),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneOrder', error);
    throw error;
  }
};

// Find list order
const findListPurchase = async (query,  page, limit, includes, paranoid) => {
  try {
    const result = await Purchases.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order: getOrder(query),
      paranoid
    });

    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListPurchase', error);
    throw error;
  }
};

// Find  Purchase fields
const findPurchaseFields = async () => {
  try {
    const result = []
    for (const key in Purchases.rawAttributes) {
      result.push({[key]:Purchases.rawAttributes[key]});
    }
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListCategory', error);
    throw error;
  }
};

// Create new purchase
const createPurchase = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Purchases.create(data, { transaction });
    if(includes){
      result = await findPurchaseById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createPurchase', error);
    throw error;
  }
};

// Update purchase
const updatePurchase = async (data, query, includes, isAdmin, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOnePurchase(query, includes);
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
    throw error;
  }
};

// Update purchases
const updatePurchases = async (data, query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await Purchases.update(data, { where:getWhere(query), returning:true, transaction });
    if (!transaction) t.commit();
    return result
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] updatePurchases', error);
    throw error;
  }
};

const deletePurchase = async (query, force, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Purchases.destroy({ where:getWhere(query), force, transaction });
    if(!force){
      result = await findOnePurchase(query, includes, true)
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

//Restore Product from DB
const restorePurchase = async (query, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Purchases.restore({ where:getWhere(query), transaction });
    result = await findOnePurchase(query, includes)
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};

// statistics purchase
const getPurchaseStatistics = async (query,  page, limit, includes ) => {
  try {
    const result = await Purchases.findAll({
      where:getWhere(query), 
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      attributes:[
        'author_id',
        [db.sequelize.fn('SUM', db.sequelize.col('total_amount')),'total_amount'],
      ],
      include: getInclude(includes),
      group:['author_id'],
    });

    return result;
  } catch (error) {
    console.error('[EXCEPTION] getPurchaseStatistics', error);
    throw error;
  }
};

export { 
  findPurchaseFields, findPurchaseById, findOnePurchase, findListPurchase, 
  createPurchase, updatePurchase, updatePurchases, deletePurchase, restorePurchase, getPurchaseStatistics
};

import db from '../../database/models';
import policy from '../../config/policy'
import { Op } from 'sequelize';
import {getInclude as getPurchaseItemInclude} from '../purchase_item/purchase_item_repository'
import parse from '../../helpers/parse'
import { getLimit, getOffset, getOrder, getRangeQuery, getSearchQuery, getStringQuery } from '../../helpers/db_query';

const { Products, Categories, PurchaseItems, Employees } = db;

export const getWhere=(query)=>{
  const conditions=[]
  if(typeof query !=='object'){
    return undefined
  }

  if(query.search_key){
    conditions.push(getSearchKeyQuery(query.search_key, ['name', 'description','brand', 'barcode', 'product_code', 'qrcode']))
  }
  
  if(query.name){
    conditions.push(getSearchQuery(query.name, 'name'))
  }

  if(query.description){
    conditions.push(getSearchQuery(query.description, 'description'))
  }

  if(query.brand){
    conditions.push(getSearchQuery(query.brand, 'brand'))
  }

  //author_id, category_id, purchase_currency, sale_currency, barcode, 
  if(query.barcode){
    conditions.push(getStringQuery(query.barcode, 'barcode'))
  }

  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
  }

  if(query.author_id){
    conditions.push(getStringQuery(query.author_id, 'author_id'))
  }

  if(query.category_id){
    conditions.push(getStringQuery(query.category_id, 'category_id'))
  }

  if(query.purchase_currency){
    conditions.push(getStringQuery(query.purchase_currency, 'purchase_currency'))
  }

  if(query.sale_currency){
    conditions.push(getStringQuery(query.sale_currency, 'sale_currency'))
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

  //total_quantity, sale_price, purchase_price number from to 
  const totalQuantity = getRangeQuery(
    parse.getNumberIfPositive(query.total_quantity_from), parse.getNumberIfPositive(query.total_quantity_to), 'total_quantity'
  );

  if(totalQuantity){
    conditions.push(totalQuantity)
  }

  const purchasePrice = getRangeQuery(
    parse.getNumberIfPositive(query.purchase_price_from), parse.getNumberIfPositive(query.purchase_price_to), 'purchase_price'
  );

  if(purchasePrice){
    conditions.push(purchasePrice)
  }

  const salePrice = getRangeQuery(
    parse.getNumberIfPositive(query.sale_price_from), parse.getNumberIfPositive(query.sale_price_to), 'sale_price'
  );

  if(salePrice){
    conditions.push(salePrice)
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
          model: Employees,
          as: 'author',
          attributes: ['id', 'full_name', 'position', 'first_name', 'last_name']
        })
        break;
      case 'category':
        result.push({
          model:Categories,
          as: 'category',
          attributes: ['id', 'name', 'description'],
        })
        break;
      case 'purchases':
          result.push({
            model:PurchaseItems,
            as: 'purchases',
            attributes: ['id', 'price', 'quantity', 'purchase_id'],
            include:getPurchaseItemInclude(['supplier','author'])
          })
        break;  
      default:
        break;
    }
  }
  return result
}

// Create new product
export const createProduct = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Products.create(data, { transaction });
    if(includes){
      result = await findProductById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createProduct', error);
    throw error;
  }
};

// Find one product by id
export const findProductById = async (id, includes, paranoid) => {
  try {
    const result = await Products.findByPk(id, {include:getInclude(includes), paranoid});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findProductById', error);
    throw error;
  }
};

// Find one product by filter
export const findOneProduct = async (query, includes, paranoid) => {
  try {
    const result = await Products.findOne({
      where:getWhere(query),
      include:getInclude(includes),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneProduct', error);
    throw error;
  }
};

// Find list product
export const findListProduct = async (query, page, limit, includes, paranoid) => {
  try {
    let result = await Products.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order:getOrder(query),
      paranoid:parse.getBooleanIfValid(paranoid)
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListProduct', error);
    throw error;
  }
};

// Update product
export const updateProduct = async (data, query, includes, isAdmin, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOneProduct(query, includes);
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


// Update product
export const updateProducts = async (data, query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await Products.update(data, { where:getWhere(query), returning:true, transaction });
    if (!transaction) t.commit();
    return result
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] updateProduct', error);
    throw error;
  }
};

// Increment total quantity
export const purchaseProductById = async (id, data, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await findProductById(id);
    result = await result.increment('total_quantity', {by:data.quantity});
    if(data.currency!==data.paid_currency){
      result.purchase_currency=data.paid_currency
      result.purchase_price = data.price * data.currency_rate
    }else{
      result.purchase_price = data.price;
      result.purchase_currency = data.currency;
    }
    if(!result.sale_price){
      result.sale_price= data.price *  policy.net_profit
      result.sale_currency=data.paid_currency
    }
    result.save()
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] purchaseProductById', error);
    throw error;
  }
};

// Decrement total quantity
export const saleProductById = async (id, data, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await findProductById(id);
    if(result.total_quantity< data.quantity){
      throw new Error('no enough quantity')
    }
    result = await result.decrement('total_quantity', {by:data.quantity});
    if(data.currency!==data.paid_currency){
      result.sale_currency=data.paid_currency
      result.sale_price = data.price * data.currency_rate
    }else{
      result.sale_price = data.price;
      result.sale_currency = data.currency;
    }
    result.save()
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] create purchase item', error);
    throw error;
  }
};

//Permanently Delete Product from DB
export const deleteProduct = async (query, force, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Products.destroy({ where:getWhere(query), force, transaction });
    if(!force){
      result = await findOneProduct(query, includes, true)
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
export const restoreProduct = async (query, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Products.restore({ where:getWhere(query), transaction });
    result = await findOneProduct(query, includes)
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};

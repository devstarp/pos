import db from '../../database/models';
import parse from '../../helpers/parse'
import { Op } from 'sequelize';
import { getSearchQuery, getOrder, getLimit, getOffset, getRangeQuery, getStringQuery, getSearchKeyQuery} from '../../helpers/db_query';
const { Suppliers, Employees, PurchaseItems, Purchases } = db;

export const getWhere=(query)=>{
  const conditions=[]
  if(typeof query !=='object'){
    return undefined
  }
  
  if(query.search_key){
    conditions.push(getSearchKeyQuery(query.search_key, ['name', 'mobile_phone','email', 'home_phone', 'office_phone', 'other_phone', 'address']))
  }
  
  if(query.name){
    conditions.push(getSearchQuery(query.name, 'name'))
  }

  if(query.mobile_phone){
    conditions.push(getSearchQuery(query.mobile_phone, 'mobile_phone'))
  }

  if(query.office_phone){
    conditions.push(getSearchQuery(query.office_phone, 'office_phone'))
  }

  if(query.other_phone){
    conditions.push(getSearchQuery(query.other_phone, 'other_phone'))
  }
  
  if(query.address){
    conditions.push({address:{ [Op.like]: `%${parse.getString(query.address)}%` }})
  }

  //user_id, category_id,   same
  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
  }

  if(query.user_id){
    conditions.push(getStringQuery(query.user_id, 'user_id'))
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


  // new, enabled, editable boolean
  if(query.new){
    conditions.push({new: parse.getBoolNumberIfValid(query.new)})
  }

  if(query.enabled){
    conditions.push({enabled: parse.getBoolNumberIfValid(query.enabled)})
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
          // attributes: ['id', 'employee_id'],
        })
        break;
      case 'purchase':
        result.push({
            model: Purchases,
            as: 'purchases',
            // attributes: ['id', 'employee_id'],
          })
      break;  
      case 'purchase_item':
        result.push({
            model: PurchaseItems,
            as: 'purchase_items',
            // attributes: ['id', 'employee_id'],
          })
      break;  
      default:
        break;
    }
  }
  return result
}

// Find one Supplier by id
const findSupplierById = async (id, includes, paranoid) => {
  try {
    const result = await Suppliers.findByPk(id, {include:getInclude(includes), paranoid});
    console.log('result sec---', result)
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findSupplierById', error);
    throw error;
  }
};

// Find list suppliers
const findListSupplier = async (query, page, limit, includes, paranoid) => {
  try {
    const result = await Suppliers.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order:getOrder(query),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListSupplier', error);
    throw error;
  }
};

// Find One Supplier By Filter
const findOneSupplier = async (query, includes, paranoid) => {
  try {
    const result = await Suppliers.findOne({
      where:getWhere(query),
      include:getInclude(includes),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneSupplier', error);
    throw error;
  }
};

// Update Supplier
const updateSupplier = async (data, query, includes, isAdmin, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOneSupplier(query, includes);
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
    console.error('[EXCEPTION] updateSupplier', error);
    throw error;
  }
};

const createSupplier = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Suppliers.create(data, { transaction: t });
    if(includes){
    console.log('created supplier---', result.toJSON())
    // result= await findSupplierById(result.id, includes)
    }
    // console.log('created supplier---', result.toJSON())
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createSupplier', error);
    throw error;
  }
};

//Permanently Delete Supplier from DB
const deleteSupplier = async (query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await Suppliers.destroy({ where:getWhere(query), force: true, transaction });
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};

//Restore Suppler from DB
const restoreProduct = async (query, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Suppliers.restore({ where:getWhere(query), transaction });
    result = await findOneSupplier(query, includes)
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};


export { findSupplierById, findOneSupplier, updateSupplier, createSupplier, findListSupplier, deleteSupplier, restoreProduct };

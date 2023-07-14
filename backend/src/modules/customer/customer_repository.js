import db from '../../database/models';
import parse from '../../helpers/parse'
import { Op } from 'sequelize';
import { getSearchQuery, getOrder, getLimit, getOffset, getRangeQuery, getStringQuery} from '../../helpers/db_query';

const { Customers, Sales, SaleItems, Employees } = db;

export const getWhere=(query)=>{
  const conditions=[]
  if(typeof query !=='object'){
    return undefined
  }
  
  if(query.search_key){
    const searchConditions = []
    searchConditions.push(getSearchQuery(query.search_key, 'name'))
    searchConditions.push(getSearchQuery(query.search_key, 'mobile_phone'))
    searchConditions.push(getSearchQuery(query.search_key, 'email'))
    searchConditions.push(getSearchQuery(query.search_key, 'home_phone'))
    searchConditions.push(getSearchQuery(query.search_key, 'office_phone'))
    searchConditions.push(getSearchQuery(query.search_key, 'other_phone'))
    searchConditions.push(getSearchQuery(query.search_key, 'address'))
    conditions.push({[Op.or]:searchConditions})
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

  //author_id, category_id,   same
  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
  }

  if(query.author_id){
    conditions.push(getStringQuery(query.author_id, 'author_id'))
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
      case 'sale':
        result.push({
            model: Sales,
            as: 'sale',
            // attributes: ['id', 'employee_id'],
          })
      break;  
      case 'sale_item':
        result.push({
            model: SaleItems,
            as: 'sale_items',
            // attributes: ['id', 'employee_id'],
          })
      break;  
      default:
        break;
    }
  }
  return result
}

// Find one Customer by id
const findCustomerById = async (id, includes) => {
  try {
    const result = await Customers.findByPk(id, {include:getInclude(includes)});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findCustomerById', error);
    throw new Error(error);
  }
};

// Find list Customers
const findListCustomer = async (query, page, limit, includes) => {
  try {
    const result = await Customers.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order:getOrder(query),
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListProduct', error);
    throw new Error(error);
  }
};

// Find One Customer By Filter
const findOneCustomer = async (query, includes) => {
  try {
    const result = await Customers.findOne({
      where:getWhere(query),
      include:getInclude(includes)
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneCustomer', error);
    throw new Error(error);
  }
};

// Update Customer
const updateCustomer = async (data, filter, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Customers.update(data, {
      where: getWhere(query),
      transaction
    })
    result = await findOneCustomer(query, includes)
    if (!transaction) t.commit();
    return result;
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] updateCustomer', error);
    throw new Error(error);
  }
};


const createCustomer = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Customers.create(data, { transaction });
    if(includes){
      result= await findCustomerById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createCustomer', error);
    throw new Error(error);
  }
};


//Permanently Delete Customer from DB
const deleteCustomer = async (query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await Customers.destroy({ where:getWhere(query), force: true, transaction });
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw new Error(error);
  }
};


export { findCustomerById, findOneCustomer, updateCustomer, createCustomer, findListCustomer, deleteCustomer };

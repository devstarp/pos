import db from '../../database/models';
import { Op } from 'sequelize';
import parse from '../../helpers/parse'
import { getLimit, getOffset, getOrder, getRangeQuery, getSearchQuery, getStringQuery } from '../../helpers/db_query';
const { Categories, Employees } = db;

export const getWhere=(query)=>{
  const conditions=[]
  if(typeof query !=='object'){
    return undefined
  }

  if(query.search_key){
    conditions.push(getSearchKeyQuery(query.search_key, ['name', 'description']))
  }

  if(query.name){
    conditions.push(getSearchQuery(query.name, 'name'))
  }

  if(query.description){
    conditions.push(getSearchQuery(query.description, 'description'))
  }

  //id, author_id
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

  // new, available, editable boolean
  if(query.new){
    conditions.push({new:{ [Op.like]: `%${parse.getBoolNumberIfValid(query.new)}%` }})
  }

  if(query.available){
    conditions.push({available:{ [Op.like]: `%${parse.getBoolNumberIfValid(query.available)}%` }})
  }

  if(query.editable){
    conditions.push({editable:{ [Op.like]: `%${parse.getBoolNumberIfValid(query.editable)}%` }})
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
      case 'author':
        result.push({
          model:Employees,
          as: 'author',
          attributes: ['id', 'full_name', 'first_name', 'last_name', 'position'],
        })
        break;
      default:
        break;
    }
  }
  return result
}


// Find one category by id
const findCategoryById = async (id, includes, paranoid) => {
  try {
    let result = await Categories.findByPk(id, {include:getInclude(includes), paranoid});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findCategoryById', error);
    throw new Error(error);
  }
};

// Find one category by filter
const findOneCategory = async (query, includes, paranoid) => {
  try {
    const result = await Categories.findOne({
      where:getWhere(query),
      include:getInclude(includes),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneCategory', error);
    throw new Error(error);
  }
};

// Find list category
const findListCategory = async (query, page, limit, includes, paranoid) => {
  try {
    const result = await Categories.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order: getOrder(query),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListCategory', error);
    throw new Error(error);
  }
};

// Find   category fields
const findCategoryFields = async (query, page, limit, includes) => {
  try {
    const result = []
    for (const key in Categories.rawAttributes) {
      result.push({[key]:Categories.rawAttributes[key].type});
      
    }
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListCategory', error);
    throw new Error(error);
  }
};

// Create new category
const createCategory = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Categories.create(data, { transaction });
    if(includes){
      result = await findCategoryById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createCategory', error.message);
    throw error;
  }
};

// Update category
const updateCategory = async (data, query, includes, isAdmin, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOneCategory(query, includes);
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
    console.error('[EXCEPTION] updateCategory', error);
    throw new Error(error);
  }
};

const deleteCategory = async (query, force, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Categories.destroy({where:getWhere(query), force, transaction});
    if(!force){
      result = await findOneCategory(query, '', true)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteCategory', error);
    throw new Error(error);
  }
};

//Restore Category from DB
const restoreCategory = async (query, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Categories.restore({ where:getWhere(query), transaction });
    result = findOneCategory(query, includes)
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw error;
  }
};


export { 
  findCategoryById, findOneCategory, findListCategory, findCategoryFields, 
  createCategory, updateCategory, deleteCategory, restoreCategory 
};


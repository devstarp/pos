import db from '../../database/models';
import { Op } from 'sequelize';
import parse from '../../helpers/parse'
import { getOrder, getLimit, getOffset, getRangeQuery, getStringQuery} from '../../helpers/db_query';
const { Employees, Departments} = db;

export const getWhere=(query)=>{
  const conditions=[]
  const operation = query.is_search?Op.like:Op.eq
  if(typeof query !=='object'){
    return undefined
  }

  //id, category_id, purchase_currency, sale_currency, same
  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
  }

  if(query.leader_id){
    conditions.push(getStringQuery(query.leader_id, 'leader_id'))
  }

  if(query.role){
    conditions.push(getStringQuery(query.role, 'role'))
  }

  if(query.name){
    conditions.push({name: {[operation]: `%${parse.getString(query.name)}%` }})
  }

  if(query.email){
    conditions.push({email: {[operation]: `%${parse.getString(query.email)}%` }})
  }

  if(query.fax){
    conditions.push({fax: {[operation]: `%${parse.getString(query.fax)}%` }})
  }
  
  if(query.phone){
    conditions.push({fax: {[operation]: `%${parse.getString(query.phone)}%` }})
  }
  
  if(query.address){
    conditions.push({address: {[operation]: `%${parse.getString(query.address)}%` }})
  }

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

export const getInclude=(includes)=>{
  if(!Array.isArray(includes) ){
    return undefined
  }
  const result=[]
  for(const include of includes){
    switch (include) {
      case 'leader':
        result.push({
          model:Employees,
          as: 'leader',
          attributes: ['id', 'first_name', 'last_name', 'position'],
        })
        break;
      case 'members':
          result.push({
            model:Employees,
            as: 'members',
            attributes: ['id', 'name', 'role'],
          })
        break;  
      default:
        break;
    }
  }
  return result
}

// Find one Department by id
const findDepartmentById = async (id, includes, paranoid) => {
  try {
    let result = await Departments.findByPk(id, {include:getInclude(includes), paranoid});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findDepartmentById', error);
    throw new Error(error);
  }
};

// Find One Department By Filter
const findOneDepartment = async (query, includes, paranoid) => {
  try {
    let result = await Departments.findOne({
      where:getWhere(query),
      include:getInclude(includes),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneDepartment', error);
    throw new Error(error);
  }
};

// Find list Departments
const findListDepartments = async (query, page, limit, includes, paranoid) => {
  try {
    const result = await Departments.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order:getOrder(query),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListProduct', error);
    throw new Error(error);
  }
};

//Create Department
const createDepartment = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Departments.create(data, { transaction: t });
    if(includes){
      result = await findDepartmentById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createDepartment', error);
    throw new Error(error);
  }
};

// Update Department
const updateDepartment = async (data, query, includes, isAdmin,transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOneDepartment(query, includes);
    if(isAdmin || result.editable){
      await result.update(data)
    }else {
      throw new Error('can not edit')
    }
    await result.save()
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] updateDepartment', error);
    throw new Error(error);
  }
};

// Delete Department
const deleteDepartment = async (query, force, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Departments.destroy({ where:getWhere(query), force, transaction });
    if(!force){
      result = await findOneDepartment(query, '', true)
    }
    console.log('result----', result)
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw new Error(error);
  }
};

// Restore Department
const restoreDepartment = async (query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Departments.restore({ where:getWhere(query), transaction });
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw new Error(error);
  }
};

export { findDepartmentById, findOneDepartment, updateDepartment, createDepartment, deleteDepartment, restoreDepartment, findListDepartments };

import db from '../../database/models';
import { Op, fn, col } from 'sequelize';
import { generatePassword } from '../../helpers/authentication';
import parse from '../../helpers/parse'
import { getOrder, getLimit, getOffset, getRangeQuery, getStringQuery} from '../../helpers/db_query';
const { Employees, Departments} = db;

export const getWhere=(query)=>{
  const conditions=[]
  const operation = query.is_search?Op.like:Op.eq
  if(typeof query !=='object'){
    return undefined
  }

  //user_id, category_id, purchase_currency, sale_currency, same
  if(query.id){
    conditions.push(getStringQuery(query.id, 'id'))
  }

  if(query.username){
    conditions.push({username: {[operation]: `%${parse.getString(query.username)}%` }})
  }

  if(query.email){
    conditions.push({email: {[operation]: `%${parse.getString(query.email)}%` }})
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
      case 'department':
          result.push({
            model:Departments,
            as: 'department',
            attributes: ['id', 'name', 'role', 'leader_id'],
          })
        break; 
      case 'leader':
          result.push({
            model:Departments,
            as: 'department',
            attributes: ['id', 'name', 'role', 'leader_id'],
          })
      break;   
      default:
        break;
    }
  }
  return result
}

export const getDraft=async(values)=>{
  const draft= values;
  if(values.password){
    const hash = await generatePassword(values.password);
    draft.password=hash
  }

  if(!values.id){
    const maxID = await findListEmployees({},undefined,undefined,undefined,[fn('max', col('id') )])
    console.log('maxID---', maxID)
    // const id = parse.getNumberIdIfValid(new Date(Date.now()).getFullYear() % 100 *1000+ maxID || 0)
    // draft.id = id;
  }

  return draft
}

// Find one Employee by id
const findEmployeeById = async (id, includes, paranoid) => {
  try {
    const result = await Employees.findByPk(id, {include:getInclude(includes), paranoid});
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findEmployeeById', error);
    throw new Error(error);
  }
};

// Find One Employee By Filter
const findOneEmployee = async (query, includes, attributes, paranoid) => {
  try {
    const result = await Employees.findOne({
      where:getWhere(query),
      include:getInclude(includes),
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findOneEmployee', error);
    throw new Error(error);
  }
};

// Find list Employees
const findListEmployees = async (query, page, limit, includes, attributes, paranoid) => {
  try {
    const result = await Employees.findAndCountAll({
      where:getWhere(query), 
      include:getInclude(includes),
      limit:getLimit(limit),
      offset:getOffset(limit, page),
      order:getOrder(query),
      attributes,
      paranoid
    });
    return result;
  } catch (error) {
    console.error('[EXCEPTION] findListProduct', error);
    throw new Error(error);
  }
};

//Create Employee
const createEmployee = async (data, includes, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const draft = await getDraft(data);
    let result = await Employees.create(draft, { transaction});
    if(includes){
      result = await findEmployeeById(result.id, includes)
    }
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] createEmployee', error);
    throw error;
  }
};

// Update Employee
const updateEmployee = async (data, query, includes, isAdmin, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    const result = await findOneEmployee(query, includes);
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
    console.error('[EXCEPTION] updateEmployee', error);
    throw new Error(error);
  }
};

// Delete Employee
const deleteEmployee = async (query, force, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Employees.destroy({ where:getWhere(query), force, transaction });
    if(!force){
      result = await findOneEmployee(query, '', true)
    }else{
      result = query;
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

// Restore Employee
const restoreEmployee = async (query, transaction) => {
  const t = transaction ? transaction : await db.sequelize.transaction();
  try {
    let result = await Employees.restore({ where:getWhere(query), transaction });
    if (!transaction) t.commit();
    return result;
  } catch (error) {
    if (!transaction) t.rollback();
    console.error('[EXCEPTION] deleteProduct', error);
    throw new Error(error);
  }
};

export { findEmployeeById, findOneEmployee, updateEmployee, createEmployee, deleteEmployee, restoreEmployee, findListEmployees };

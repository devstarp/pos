import db from './models'
import policy from '../config/policy'
import { createDepartment } from '../modules/department/department_repository';
import { createEmployee, updateEmployee } from '../modules/employee/employee_repository';

const createTables=async()=>{
    for (const table in db) {
        if(typeof db[table].sync ==='function'){
            await db[table].sync({alter:true})
        }
    }
}
const associateTables=async()=>{
    for (const table in db) {
        if(typeof db[table].associate ==='function'){
            await db[table].associate(db)
        }
    }
}

const createDefaultDepartments= async()=>{
    const departments = policy.departments

    for (const department of departments){
    await createDepartment({name:department, role:department})
    }
}

const createAdmin = async()=>{
    const user = await createEmployee({
        id:220002,
        first_name:'Admin1', 
        last_name:'Admin1',
        position:'MANAGER',
        department_id:6,
        email:'admin1@email.com',
        username: 'mana',
        password:'123qweasd',
    })
}

const run =async()=>{
    await createTables()
    await createDefaultDepartments()
    await createAdmin()
}

run()

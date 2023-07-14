import { jsonQuery, query } from './common';

export const apiCreateEmployee = (data) => jsonQuery('/employee/create', 'POST', data)

export const apiGetEmployees = (searchParams) => query('/employee/list', {searchParams})

export const apiUpdateEmployeeById = (id, data) => jsonQuery(`/employee/${id}`, 'PATCH', data)

export const apiDeleteEmployeeById = (id) => jsonQuery(`/employee/${id}`, 'DELETE')

export const apiRestoreEmployeeById = (id) => jsonQuery(`/employee/${id}/restore`, 'POST')

export const apiPermanentDeleteEmployeeById = (id) => jsonQuery(`/employee/${id}/db`, 'DELETE')

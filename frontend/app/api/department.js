import { jsonQuery, query } from './common';

export const apiCreateDepartment = (data) => jsonQuery('/department/create', 'POST', data)

export const apiGetDepartments = (searchParams) => query('/department/list', {searchParams})

export const apiUpdateDepartmentById = (id, data) => jsonQuery(`/department/${id}`, 'PATCH', data)

export const apiDeleteDepartmentById = (id) => jsonQuery(`/department/${id}`, 'DELETE')

export const apiRestoreDepartmentById = (id) => jsonQuery(`/department/${id}/restore`, 'POST')

export const apiPermanentDeleteDepartmentById = (id) => jsonQuery(`/department/${id}/db`, 'DELETE')

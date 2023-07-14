import { jsonQuery, query } from './common';

export const apiGetSuppliers = (searchParams) => query('/supplier/list', {searchParams})

export const apiGetSupplierById = (id,searchParams) => query(`/supplier/${id}`,{searchParams})

export const apiCreateSupplier = (data) => jsonQuery('/supplier/create', 'POST', data)

export const apiUpdateSupplierById = (id, data) => jsonQuery(`/supplier/${id}`, 'PATCH', data)

export const apiDeleteSupplierById = (id) => jsonQuery(`/supplier/${id}`, 'DELETE')

export const apiRestoreSupplierById = (id) => jsonQuery(`/supplier/${id}/restore`, 'POST')

export const apiPermanentDeleteSupplierById = (id) => jsonQuery(`/supplier/${id}/db`, 'DELETE')
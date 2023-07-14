import { jsonQuery, query } from './common';

export const apiGetCustomers = (searchParams) => query('/customer/list', {searchParams})

export const apiGetCustomerById = (id,searchParams) => query(`/customer/${id}`,{searchParams})

export const apiCreateCustomer = (data) => jsonQuery('/customer/create', 'POST', data)

export const apiUpdateCustomerById = (id, data) => jsonQuery(`/customer/${id}`, 'PATCH', data)

export const apiDeleteCustomerById = (id) => jsonQuery(`/customer/${id}`, 'DELETE')

export const apiRestoreCustomerById = (id) => jsonQuery(`/customer/${id}/restore`, 'POST')

export const apiPermanentDeleteCustomerById = (id) => jsonQuery(`/customer/${id}/db`, 'DELETE')
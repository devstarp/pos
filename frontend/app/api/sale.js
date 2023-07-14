import { jsonQuery, query } from './common';

export const apiCreateSaleWithItems = (data) => jsonQuery('/sale/create_with_items', 'POST', data)

export const apiGetSaleById = (id, searchParams) => query(`/sale/${id}`, {searchParams})

export const apiGetSales = (searchParams) => query(`/sale/list`, {searchParams})

export const apiGetSaleFields = () => query(`/sale/fields`)

export const apiCreateSale = (data) => jsonQuery('/sale/create', 'POST', data)

export const apiUpdateSaleById = (id, data) => jsonQuery(`/sale/${id}`, 'PATCH', data)

export const apiDeleteSaleById = (id) => jsonQuery(`/sale/${id}`, 'DELETE')

export const apiRestoreSaleById = (id) => jsonQuery(`/sale/${id}/restore`, 'POST')

export const apiPermanentDeleteSaleById = (id) => jsonQuery(`/sale/${id}/db`, 'DELETE')

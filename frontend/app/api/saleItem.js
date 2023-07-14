import { jsonQuery, query } from './common';

export const apiGetSaleItemById = (id, searchParams) => query(`/sale_item/${id}`, {searchParams})

export const apiGetSaleItems = (searchParams) => query(`/sale_item/list`, {searchParams})

export const apiGetSaleItemFields = () => query(`/sale_item/fields`)

export const apiCreateSaleItem = (data) => jsonQuery('/sale_item/create', 'POST', data)

export const apiUpdateSaleItemById = (id, data) => jsonQuery(`/sale_item/${id}`, 'PATCH', data)

export const apiDeleteSaleItemById = (id) => jsonQuery(`/sale_item/${id}`, 'DELETE')

export const apiRestoreSaleItemById = (id) => jsonQuery(`/sale_item/${id}/restore`, 'POST')

export const apiPermanentDeleteSaleItemById = (id) => jsonQuery(`/sale_item/${id}/db`, 'DELETE')

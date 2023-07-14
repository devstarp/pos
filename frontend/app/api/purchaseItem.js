import { jsonQuery, query } from './common';

export const apiGetPurchaseItemById = (id, searchParams) => query(`/purchase_item/${id}`, {searchParams})

export const apiGetPurchaseItems = (searchParams) => query(`/purchase_item/list`, {searchParams})

export const apiGetPurchaseItemFields = () => query(`/purchase_item/fields`)

export const apiCreatePurchaseItem = (data) => jsonQuery('/purchase_item/create', 'POST', data)

export const apiUpdatePurchaseItemById = (id, data) => jsonQuery(`/purchase_item/${id}`, 'PATCH', data)

export const apiDeletePurchaseItemById = (id) => jsonQuery(`/purchase_item/${id}`, 'DELETE')

export const apiRestorePurchaseItemById = (id) => jsonQuery(`/purchase_item/${id}/restore`, 'POST')

export const apiPermanentDeletePurchaseItemById = (id) => jsonQuery(`/purchase_item/${id}/db`, 'DELETE')

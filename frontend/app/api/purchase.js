import { jsonQuery, query } from './common';

export const apiCreatePurchaseWithItems = (data) => jsonQuery('/purchase/create_with_items', 'POST', data)

export const apiGetPurchaseById = (id, searchParams) => query(`/purchase/${id}`, {searchParams})

export const apiGetPurchases = (searchParams) => query(`/purchase/list`, {searchParams})

export const apiGetPurchaseStatistics = (searchParams) => query(`/purchase/statistics`, {searchParams})

export const apiGetPurchaseFields = () => query(`/purchase/fields`)

export const apiCreatePurchase = (data) => jsonQuery('/purchase/create', 'POST', data)

export const apiUpdatePurchaseById = (id, data) => jsonQuery(`/purchase/${id}`, 'PATCH', data)

export const apiUpdatePurchasesByIds = (ids, data) => jsonQuery(`/purchase/bulk/${ids}`, 'PATCH', data)

export const apiDeletePurchaseById = (id) => jsonQuery(`/purchase/${id}`, 'DELETE')

export const apiRestorePurchaseById = (id) => jsonQuery(`/purchase/${id}/restore`, 'POST')

export const apiPermanentDeletePurchaseById = (id) => jsonQuery(`/purchase/${id}/db`, 'DELETE')

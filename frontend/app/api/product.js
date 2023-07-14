import { jsonQuery, query } from './common';

export const apiCreateProduct = (data) => jsonQuery('/product/create', 'POST', data)

export const apiGetProducts = (searchParams) => query('/product/list', {searchParams})

export const apiGetProductById = (id, searchParams) => query(`/product/${id}`, {searchParams})

export const apiGetProductByBarcode = (barcode, searchParams) => query(`/product/barcode/${barcode}`, {searchParams})

export const apiUpdateProductById = (id, data) => jsonQuery(`/product/${id}`, 'PATCH', data)

export const apiUpdateProductsByIds = (ids, data) => jsonQuery(`/product/bulk/${ids}`, 'PATCH', data)

export const apiDeleteProductById = (id) => jsonQuery(`/product/${id}`, 'DELETE')

export const apiRestoreProductById = (id) => jsonQuery(`/product/${id}/restore`, 'POST')

export const apiPermanentDeleteProductById = (id) => jsonQuery(`/product/${id}/db`, 'DELETE')

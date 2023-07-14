import { jsonQuery, query } from './common';

export const apiGetCategories = (searchParams) => query('/category/list', {searchParams})

export const apiGetCategoryById = (id) => query(`/category/${id}`)

export const apiCreateCategory = (data) => jsonQuery('/category/create', 'POST', data)

export const apiUpdateCategoryById = (id, data) => jsonQuery(`/category/${id}`, 'PATCH', data)

export const apiDeleteCategoryById = (id) => jsonQuery(`/category/${id}`, 'DELETE')

export const apiRestoreCategoryById = (id) => jsonQuery(`/category/${id}/restore`, 'POST')

export const apiPermanentDeleteCategoryById = (id) => jsonQuery(`/category/${id}`, 'DELETE')

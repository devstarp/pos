import {pHost, host} from './config'
import { jsonQuery, query } from './common';
import axios from 'axios'

export const retrieveCategorysService = (name, barcode) => {
    const config = { headers: { 'Authorization': `Bearer ${  localStorage.getItem('userToken')}` } }
    return axios.get(`${pHost  }/getCategorys?barcode=${barcode || ''}&name=${name}&description=&category=&pageNumber=1&pageSize=&orderBy=&orderAs=`, config)
}

export const createCategoryService = (data) => jsonQuery('/category/add', data)

export const updateCategoryService = (dataToSend) => {
    const config = { headers: { 'Authorization': `Bearer ${  localStorage.getItem('userToken')}` } }
    return axios.post(`${pHost  }/updateCategory`, dataToSend, config)
}
export const deleteCategoryService = (id) => {
    const config = { headers: { 'Authorization': `Bearer ${  localStorage.getItem('userToken')}` } }
    return axios.get(`${pHost  }/deleteCategorys?ids=${id}`, config)
}

export const retrieveCategoryService = (id) => {
    const config = { headers: { 'Authorization': `Bearer ${  localStorage.getItem('userToken')}` } }
    return axios.get(`${pHost  }/getCategoryById?id=${id}`, config)
}

import { createSlice } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
import { isArray } from 'lodash-es';

const INIT_SUPPLIER_STATE = {
  supplier:{},
  suppliers:[]
};

export const categorySlice = createSlice({
  name: 'supplier',
  initialState: fromJS(INIT_SUPPLIER_STATE),
  reducers: {
    clearSupplierState:()=>fromJS(INIT_SUPPLIER_STATE),
    setSupplier:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('supplier', payload)
    }),
    setSuppliers:(state, {payload})=>state.withMutations(mutableState => {
      isArray(payload) && mutableState.set('suppliers', fromJS(payload))
    }),
    addSupplier:(state, {payload})=>state.withMutations(mutableState => {
      const tmpSupplier=typeof payload ==='object'?payload:{id:0}
      mutableState.update('suppliers', data=>data.push(fromJS(tmpSupplier)))
      mutableState.set('supplier', fromJS(tmpSupplier))
    }),
    deleteSupplier:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('suppliers', data=>data.filter(supplier=>supplier.get('id')!==Number(payload)))
    }),
    updateSupplier:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('suppliers').findIndex(supplier=>supplier.get('id')===payload.id);
      index >=0 && mutableState.update('suppliers', data=>data.update(index, ()=>fromJS(payload)))
      mutableState.set('supplier', fromJS(payload))
    })
    
  },
});

export const {
  actions, reducer, name, name: sliceName
} = categorySlice;

export const {
  clearSupplierState,
  setSupplier,
  setSuppliers,
  addSupplier,
  deleteSupplier,
  updateSupplier,
} = actions;

export default reducer;

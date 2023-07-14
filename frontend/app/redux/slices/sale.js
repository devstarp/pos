import { createSlice } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';

const INIT_SALE_STATE = {
  sale:{},
  saleItem:{},
  sales:[],
  saleItems:[],
};

export const saleSlice = createSlice({
  name: 'sale',
  initialState: fromJS(INIT_SALE_STATE),
  reducers: {
    clearSaleState:()=>fromJS(INIT_SALE_STATE),
    setSale:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('sale', fromJS(payload))
    }),
    setSales:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('sales', fromJS(payload))
    }),
    addSale:(state, {payload})=>state.withMutations(mutableState => {
      const tampSale=typeof payload ==='object'?payload:{id:0}
      mutableState.update('sales', data=>data.push(fromJS(tampSale)))
      mutableState.set('saleItem', fromJS(tampSale))
    }),
    deletesale:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('sales', data=>data.filter(sale=>sale.get('id')!==Number(payload)))
    }),
    updateSale:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('sales').findIndex(sale=>sale.get('id')===payload.id);
      index >=0 && mutableState.update('sales', data=>data.update(index, ()=>fromJS(payload)))
      mutableState.set('sale', fromJS(payload))
    }),
    setSaleItem:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('saleItem', fromJS(payload))
    }),
    setsSaleItems:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('saleItems', fromJS(payload))
    }),
    addSaleItem:(state, {payload})=>state.withMutations(mutableState => {
      const tampSaleItem=typeof payload ==='object'?payload:{id:0}
      mutableState.update('saleItems', data=>data.push(fromJS(tampSaleItem)))
      mutableState.set('saleItem', fromJS(tampSaleItem))
    }),
    deleteSaleItem:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('saleItems', data=>data.filter(saleItem=>saleItem.get('id')!==Number(payload)))
    }),
    updateSaleItem:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('saleItems').findIndex(saleItem=>saleItem.get('id')===payload.id);
      index >=0 && mutableState.update('saleItems', data=>data.update(index, ()=>fromJS(payload)))
      mutableState.set('saleItem', fromJS(payload))
    })
  },
});

export const {
  actions, reducer, name, name: sliceName
} = saleSlice;

export const {
  clearSaleState,
  setSales,
  addSale,
  setsSale,
  deleteSale,
  updateSale,
  setSaleItems,
  addSaleItem,
  setSaleItem,
  deleteSaleItem,
  updateSaleItem,
} = actions;

export default reducer;

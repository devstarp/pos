import { createSlice } from '@reduxjs/toolkit';
import { fromJS, List } from 'immutable';

const INIT_PURCHASE_STATE = {
  purchase:{},
  purchaseItem:{},
  purchases:[],
  purchaseItems:[],
};

export const purchaseSlice = createSlice({
  name: 'purchase',
  initialState: fromJS(INIT_PURCHASE_STATE),
  reducers: {
    clearpurchaseState:()=>fromJS(INIT_PURCHASE_STATE),
    setPurchase:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('purchase', fromJS(payload))
    }),
    setPurchases:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('purchases', fromJS(payload))
    }),
    addPurchase:(state, {payload})=>state.withMutations(mutableState => {
      const tmpPurchase=typeof payload ==='object'?payload:{id:0}
      mutableState.update('purchases', data=>data.push(fromJS(tmpPurchase)))
      mutableState.set('purchase', fromJS(tmpPurchase))
    }),
    deletePurchase:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('purchases', data=>data.filter(purchase=>purchase.get('id')!==Number(payload)))
    }),
    updatePurchase:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('purchases').findIndex(purchase=>purchase.get('id')===payload.id);
      index >=0 && mutableState.update('purchases', data=>data.update(index, ()=>fromJS(payload)))
      mutableState.set('purchase', fromJS(payload))
    }),
    updatePurchases:(state, {payload})=>state.withMutations(mutableState=>{
      for(const purchase of payload){
        const index = state.get('purchases').findIndex(_purchase=>_purchase.get('id')===purchase.id);
        index >=0 && mutableState.update('purchases', data=>data.update(index, ()=>fromJS(purchase)))
        mutableState.set('purchase', fromJS(payload))
      }
    }),
    setPurchaseItem:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('purchaseItem', fromJS(payload))
    }),
    setPurchaseItems:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('purchaseItems', fromJS(payload))
    }),
    addPurchaseItem:(state, {payload})=>state.withMutations(mutableState => {
      const tmpPurchaseItem=typeof payload ==='object'?payload:{id:0}
      mutableState.update('purchaseItems', data=>data.push(fromJS(tmpPurchaseItem)))
      mutableState.set('purchaseItem', fromJS(tmpPurchaseItem))
    }),
    deletePurchaseItem:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('purchaseItems', data=>data.filter(purchaseItem=>purchaseItem.get('id')!==Number(payload)))
    }),
    updatePurchaseItem:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('purchaseItems').findIndex(purchaseItem=>purchaseItem.get('id')===payload.id);
      index >=0 && mutableState.update('purchaseItems', data=>data.update(index, ()=>fromJS(payload)))
      mutableState.set('purchaseItem', fromJS(payload))
    })
  },
});

export const {
  actions, reducer, name, name: sliceName
} = purchaseSlice;

export const {
  clearpurchaseState,
  setPurchases,
  addPurchase,
  setPurchase,
  deletePurchase,
  updatePurchase,
  updatePurchases,
  setPurchaseItems,
  addPurchaseItem,
  setPurchaseItem,
  deletePurchaseItem,
  updatePurchaseItem,
} = actions;

export default reducer;

import { createSlice } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';

const INIT_PRODUCT_STATE = {
  product:{},
  products: []
};

export const categorySlice = createSlice({
  name: 'product',
  initialState: fromJS(INIT_PRODUCT_STATE),
  reducers: {
    clearProductState:()=>fromJS(INIT_PRODUCT_STATE),
    setProduct:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('product', fromJS(payload))
    }),
    setProducts:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('products', fromJS(payload))
    }),
    addProduct:(state, {payload})=>state.withMutations(mutableState => {
      const tmpProduct=typeof payload ==='object'?payload:{id:0}
      mutableState.update('products', data=>data.insert(0, fromJS(tmpProduct)))
      mutableState.set('product', fromJS(tmpProduct))
    }),
    deleteProduct:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('products', data=>data.filter(product=>product.get('id')!==Number(payload)))
    }),
    updateProduct:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('products').findIndex(product=>product.get('id')===payload.id);
      index>=0 && mutableState.update('products', data=>data.update(index,()=>fromJS(payload)))
      mutableState.set('product', fromJS(payload))
    }),
    updateProducts:(state, {payload})=>state.withMutations(mutableState=>{
      for(const product of payload){
        const index = state.get('products').findIndex(_product=>_product.get('id')===product.id);
        index>=0 && mutableState.update('products', data=>data.update(index,()=>fromJS(product)))
        mutableState.set('product', fromJS(payload))
      }
    })
  },
});

export const {
  actions, reducer, name, name: sliceName
} = categorySlice;

export const {
  clearProductState,
  setProduct,
  setProducts,
  addProduct,
  deleteProduct,
  updateProduct,
  updateProducts
} = actions;

export default reducer;

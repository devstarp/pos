import { createSlice } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
import { isArray } from 'lodash';

const INIT_CUSTOMER_STATE = {
  customer:{},
  customers:[]
};

export const categorySlice = createSlice({
  name: 'customer',
  initialState: fromJS(INIT_CUSTOMER_STATE),
  reducers: {
    clearcustomerState:()=>fromJS(INIT_CUSTOMER_STATE),
    setCustomer:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('customer', payload)
    }),
    setCustomers:(state, {payload})=>state.withMutations(mutableState => {
      isArray(payload) && mutableState.set('customers', fromJS(payload))
    }),
    addCustomer:(state, {payload})=>state.withMutations(mutableState => {
      const tmpCustomer=typeof payload ==='object'?payload:{id:0}
      mutableState.update('customers', data=>data.push(fromJS(tmpCustomer)))
      mutableState.set('customer', fromJS(tmpCustomer))
    }),
    deleteCustomer:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('customers', data=>data.filter(customer=>customer.get('id')!==Number(payload)))
    }),
    updateCustomer:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('customers').findIndex(customer=>customer.get('id')===payload.id);
      index >=0 && mutableState.update('customers', data=>data.update(index, ()=>fromJS(payload)))
      mutableState.set('customer', fromJS(payload))
    })
    
  },
});

export const {
  actions, reducer, name, name: sliceName
} = categorySlice;

export const {
  clearcustomerState,
  setCustomer,
  setCustomers,
  addCustomer,
  deleteCustomer,
  updateCustomer,
} = actions;

export default reducer;

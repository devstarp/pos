import { createSlice } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
import { isArray } from 'lodash-es';

const INIT_EMPLOYEE_STATE = {
  employee:{},
  employees:[]
};

export const categorySlice = createSlice({
  name: 'employee',
  initialState: fromJS(INIT_EMPLOYEE_STATE),
  reducers: {
    clearEmployeeState:()=>fromJS(INIT_EMPLOYEE_STATE),
    setEmployee:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('employee', payload)
    }),
    setEmployees:(state, {payload})=>state.withMutations(mutableState => {
      isArray(payload) && mutableState.set('employees', fromJS(payload))
    }),
    addEmployee:(state, {payload})=>state.withMutations(mutableState => {
      const tmpEmployee=typeof payload ==='object'?payload:{id:0}
      mutableState.update('employees', data=>data.insert(0, fromJS(tmpEmployee)))
      mutableState.set('employee', fromJS(tmpEmployee))
    }),
    deleteEmployee:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('employees', data=>data.filter(employee=>employee.get('id')!==Number(payload)))
    }),
    updateEmployee:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('employees').findIndex(employee=>employee.get('id')===payload.id);
      index >=0 && mutableState.update('employees', data=>data.update(index, ()=>fromJS(payload)))
      mutableState.set('employee', fromJS(payload))
    })
    
  },
});

export const {
  actions, reducer, name, name: sliceName
} = categorySlice;

export const {
  clearEmployeeState,
  setEmployee,
  setEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
} = actions;

export default reducer;

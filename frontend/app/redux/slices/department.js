import { createSlice } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
import { isArray } from 'lodash-es';

const INIT_DEPARTMENT_STATE = {
  department:{},
  departments:[]
};

export const categorySlice = createSlice({
  name: 'department',
  initialState: fromJS(INIT_DEPARTMENT_STATE),
  reducers: {
    clearDepartmentState:()=>fromJS(INIT_DEPARTMENT_STATE),
    setDepartment:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('department', payload)
    }),
    setDepartments:(state, {payload})=>state.withMutations(mutableState => {
      isArray(payload) && mutableState.set('departments', fromJS(payload))
    }),
    addDepartment:(state, {payload})=>state.withMutations(mutableState => {
      const tmpDepartment=typeof payload ==='object'?payload:{id:0}
      mutableState.update('departments', data=>data.insert(0, fromJS(tmpDepartment)))
      mutableState.set('department', fromJS(tmpDepartment))
    }),
    deleteDepartment:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('departments', data=>data.filter(department=>department.get('id')!==Number(payload)))
    }),
    updateDepartment:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('departments').findIndex(department=>department.get('id')===payload.id);
      index >=0 && mutableState.update('departments', data=>data.update(index, ()=>fromJS(payload)))
      mutableState.set('department', fromJS(payload))
    })
    
  },
});

export const {
  actions, reducer, name, name: sliceName
} = categorySlice;

export const {
  cleardepartmentState,
  setDepartment,
  setDepartments,
  addDepartment,
  deleteDepartment,
  updateDepartment,
} = actions;

export default reducer;

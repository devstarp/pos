import { createSlice } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';

const INIT_CATEGORY_STATE = {
  category:{},
  categories:[]
};

export const categorySlice = createSlice({
  name: 'category',
  initialState: fromJS(INIT_CATEGORY_STATE),
  reducers: {
    clearCategoryState:()=>fromJS(INIT_CATEGORY_STATE),
    setCategory:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('category', payload)
    }),
    setCategories:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.set('categories', fromJS(payload))
    }),
    addCategory:(state, {payload})=>state.withMutations(mutableState => {
      const tmpCategory=typeof payload ==='object'?payload:{id:0}
      mutableState.update('categories', data=>data.insert(0,fromJS(tmpCategory)))
      mutableState.set('category', fromJS(tmpCategory))
    }),
    deleteCategory:(state, {payload})=>state.withMutations(mutableState => {
      mutableState.update('categories', data=>data.filter(cat=>cat.get('id')!==Number(payload)))
    }),
    updateCategory:(state, {payload})=>state.withMutations(mutableState=>{
      const index = state.get('categories').findIndex(cat=>cat.get('id')!==Number(payload.id));
      index>=0 && mutableState.update('categories', data=>data.update(index, fromJS(payload)))
      mutableState.set('category', fromJS(payload))
    })
    
  },
});

export const {
  actions, reducer, name, name: sliceName
} = categorySlice;

export const {
  clearCategoryState,
  setCategories,
  addCategory,
  setCategory,
  deleteCategory,
  updateCategory,
} = actions;

export default reducer;

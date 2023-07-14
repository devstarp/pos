import { createSlice } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
const INIT_AUTH_STATE= {
  token: null,
  user: {},
}

const authSlice = createSlice({
  name: 'auth',
  initialState:INIT_AUTH_STATE,
  reducers: {
    clearAuthState:()=>fromJS(INIT_AUTH_STATE),
    setAuth:(state, {payload})=>fromJS(payload),
  },
});

const { actions, reducer } = authSlice;
export const { setAuth, clearAuthState } = actions;

export default reducer;

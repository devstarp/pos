import { jsonQuery, query } from './common';

export const apiLogin=async (data) =>{
  const res =await  jsonQuery('/login/', 'POST', data, false);
  !res.error && res.data && res.data.token && localStorage.setItem('token',res.data.token )
  return  res
}

export const apiRegister= (data) => jsonQuery('/register/', 'POST', data, false)

export const apiLogout= async (data) => {
  const res = await jsonQuery('/logout/', 'POST', data, false)
  !res.error && localStorage.removeItem('token')
  return res
}

export const apiChangePassword= (data) => jsonQuery('/auth/changePassword/', 'POST', data, false)

export const apiForgotPassword= (data) => jsonQuery('/auth/forget_password/', 'POST', data, false)


export const getLocalToken = () => (localStorage.getItem('userInfo') != null
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null);

export const setLocalToken = (userInfo) => localStorage.setItem('userInfo', userInfo);

export const removeLocalToken = () => {
  localStorage.removeItem('userInfo');
};
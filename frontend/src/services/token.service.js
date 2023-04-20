import Cookies from 'js-cookie';

// const setAccessToken = (token) => {
//   Cookies.set('access_token', token, { expires: 7 });
// };

const getAccessToken = () => {
  const token = Cookies.get('access_token');
  if (token) {
    return `Bearer ${token}`;
  }
  return null;
};

export const tokenService = {
  // setAccessToken,
  getAccessToken,
};

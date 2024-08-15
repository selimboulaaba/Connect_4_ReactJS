export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_USER = 'SET_USER';

export const signIn = (user) => {
  return {
    type: SIGN_IN,
    payload: user,
  };
};

export const signOut = () => {
  return {
    type: SIGN_OUT,
  };
};

export const setUser = (user) => {
  return {
    type: SET_USER,
    payload: user,
  };
};
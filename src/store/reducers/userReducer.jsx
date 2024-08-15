import { SET_USER, SIGN_IN, SIGN_OUT } from '../actions/userActions';

const initialState = {
  user: {},
  signedIn: false,
  token: localStorage.getItem('token'),
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        signedIn: true,
      };
    case SIGN_OUT:
      localStorage.removeItem('token');
      return {
        ...state,
        user: {},
        token: null,
        signedIn: false,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
        signedIn: true,
      };
    default:
      return state;
  }
};

export default userReducer;

import { SIGN_IN, SIGN_OUT } from '../actions/userActions';

const initialState = {
  user: {},
  signedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        user: action.payload,
        signedIn: true
      };
    case SIGN_OUT:
      return {
        ...state,
        user: {},
        signedIn: false
      };
    default:
      return state;
  }
};

export default userReducer;
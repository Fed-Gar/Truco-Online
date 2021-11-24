import { SIGN_UP } from '../actions/index';

const INITIAL_STATE = {
  registered: false,
  validEmail: null,
  message:'',
};

const signUpReducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case SIGN_UP:
      if(payload.registered) {
        return {
          ...state,
          registered: payload.registered,
          validEmail: payload.validEmail,
          message: payload.message,
        };
      } else {
          return {
            ...state,
            registered: payload.registered,
            validEmail: payload.validEmail,
            message: payload.message,
          };
      }
    default:
      return state;    
  };
};

export default signUpReducer;
import { EDIT_PROFILE, PUT_PROFILE, CLEAR_DATA} from '../actions/index';

const INITIAL_STATE = {
    id: '',
    username: '',
    email: '',
    password: '',
    response: false,
    img: null,
    status: null,
    msg: '',
};

const editProfileReducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case EDIT_PROFILE:
      // console.log("console from reducer :", payload)
        return {
          ...state,
          id: payload.id,
          username: payload.username,
          email: payload.email,
          password: payload.password,
          response: true,
          img: payload.image,
        };
    case PUT_PROFILE:
        return {
          ...state,
          status:payload.data.status,
          msg: payload.data.message,
        };
    case CLEAR_DATA:
        return {
          ...state,
          id: '',
          username: '',
          email: '',
          password: '',
          response: false,
          img: null,
          status: null,
        };
    default:
      return state;    
  };
};

export default editProfileReducer;
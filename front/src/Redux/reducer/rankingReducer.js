import { GET_RANKING } from "../actions";

const INITIAL_STATE = {
      ranking : []
  };
  
  const rankingReducer = (state = INITIAL_STATE, {type, payload}) => {
    switch (type) {
      case GET_RANKING:
        return {
          ...state,
          ranking: payload,
        };
      default:
        return state;    
    };
  };
  
  export default rankingReducer;
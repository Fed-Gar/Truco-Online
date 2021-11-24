import { IS_IN_ROOM } from '../actions/index';

const INITIAL_STATE = {
  isInRoom: false,
  roomId: null,
};

const roomsReducer = (state = INITIAL_STATE, {type, payload}) => {
  switch (type) {
    case IS_IN_ROOM:
      window.localStorage.setItem("isInRoom", payload.isInRoom);
      window.localStorage.setItem("roomId", payload.roomId);
      return {
        isInRoom: payload.isInRoom,
        roomId: payload.roomId,
      };
    default:
      return state;    
  };
};

export default roomsReducer;
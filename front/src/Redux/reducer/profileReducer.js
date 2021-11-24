import { GET_PROFILE, GET_FRIENDS, GET_HISTORY, DELETE_FRIEND, PUT_FRIEND_REQUEST } from '../actions/index';

const INITIAL_STATE = {
  userProfile: {},
  userFriends: {
    requested: [],
    sender: []
  },
  userHistory: [],
};

const profileReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        userProfile: {
          id: payload.id,
          username: payload.username,
          email: payload.email,
          image: payload.image,
          gamesPlayed: payload.gamesPlayed,
          gamesWon: payload.gamesWon,
          gamesLost: payload.gamesLost,
          tournamentsPlayed: payload.tournamentsPlayed,
          tournamentsWon: payload.tournamentsWon,
          tournamentsLost: payload.tournamentsLost,
        },
      };
    case GET_FRIENDS:
      const ansFriends = {
        ...state,
        userFriends: {
          requested: payload.userRequested,
          sender: payload.userSender,
        }
      }
      return ansFriends;
    case DELETE_FRIEND:
      const ans = {
        ...state,
        userFriends: {
          ...state.userFriends,
          sender: state.userFriends.sender.filter(f => f.id !== payload),
        }
      }
      return ans;
    case PUT_FRIEND_REQUEST:
      const ansPutRequest = {
        ...state,
        userFriends: {
          ...state.userFriends,
          requested: state.userFriends.requested.filter(f => f.id !== payload),
        }
      }
      return ansPutRequest;
    case GET_HISTORY:
    return {
      ...state,
      userHistory: payload,
    };
    default:
      return state;
  };
};

export default profileReducer;
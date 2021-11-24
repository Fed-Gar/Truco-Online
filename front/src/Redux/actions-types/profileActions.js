import axios from 'axios';
import { GET_PROFILE, GET_FRIENDS, GET_HISTORY, DELETE_FRIEND, PUT_FRIEND_REQUEST } from '../actions/index';

const getProfile = ({token}) => {

  return function(dispatch) {
    return axios.get(`http://localhost:3001/api/user/profile`, {
      headers: {
        "x-access-token": token,
      },
    })
    .then(data => {
      dispatch({ type: GET_PROFILE, payload: data.data[0] });
    })
    .catch((error) => console.error(error));
  };
};

const getFriends = (token) => {
  return function(dispatch) {
    return axios(`http://localhost:3001/api/user/friends`, {
      headers: {
        "x-access-token": token,
      },
    })
    .then(data => {
      console.log(data)
      dispatch({ type: GET_FRIENDS, payload: data.data });
    })
    .catch((error) => console.error(error));
  };
};

const deleteFriends = (id, email) => {
  return function(dispatch) {
    return axios.delete(`http://localhost:3001/api/friends/${id}/${email}`)
      .then(data => {
        dispatch({ type: DELETE_FRIEND, payload: data.data.id });
      })
      .catch((error) => console.error(error));
  };
};

const putFriendRequest = (id, email, response) => {
  return function(dispatch) {
    return axios.put(`http://localhost:3001/api/friends/${id}/${email}?response=${response}`)
      .then(data => {
        dispatch({ type: PUT_FRIEND_REQUEST, payload: data.data.id });
      })
      .catch((error) => console.error(error));
  };
};

const getGames = (token) => {
  return function(dispatch) {
    return axios(`http://localhost:3001/api/games/mygames`, {
      headers: {
        "x-access-token": token,
      }
    })
    .then(data => {
      dispatch({ type: GET_HISTORY, payload: data.data.games});
    })
    .catch((error) => console.error(error));
  };
};

export default {
    getProfile,
    getFriends,
    putFriendRequest,
    deleteFriends,
    getGames,
};
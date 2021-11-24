/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { LOG_IN, LOG_OUT , LOG_IN_FACEBOOK} from '../actions/index';

const logIn = ({emailInput, passwordInput}) => {
  return function(dispatch) {
    return axios(`http://localhost:3001/api/user/login?emailInput=${emailInput}&passwordInput=${passwordInput}`)
      .then(response => {
        dispatch({ type: LOG_IN, payload: response.data });
      })
      .catch(error => console.log(error));
  };
}; 

export const logInFacebook = ({email , name}) => {
  return function(dispatch) {
    return axios(`http://localhost:3001/api/user/login/facebook?emailInput=${email}&usernameInput=${name}`)
      .then(response => {
        dispatch({ type: LOG_IN_FACEBOOK, payload: response.data });
      })
      .catch(error => console.log(error));
  };
}; 

const logOut = () => {
  return function(dispatch) {
    dispatch({type: LOG_OUT});
  };
};

export default {
    logIn,
    logOut,
    logInFacebook,
};
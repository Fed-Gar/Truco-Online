/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import { SIGN_UP } from '../actions/index';

const signUpActions = (data) => {
  return function(dispatch) {
    return axios.post(`http://localhost:3001/api/user`, data)
      .then(response => {
        dispatch({ type: SIGN_UP, payload: response.data });
      })
      .catch(error => console.log(error));
  };
};

export default {
  signUpActions,
};
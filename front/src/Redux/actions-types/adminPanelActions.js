/* eslint-disable import/no-anonymous-default-export */
/* eslint-disable no-unused-vars */
import axios from 'axios';
import {
  GET_USERS, FILTER_BY_EMAIL, FILTER_BY_NAME, FILTER_BY_ID, SET_TOTAL_PAGES,
  ORDER_BY_GAMES_ASC, ORDER_BY_GAMES_DESC, ORDER_BY_WINS_ASC, ORDER_BY_WINS_DESC,
  ORDER_BY_LOST_ASC, ORDER_BY_LOST_DESC, GO_TO_N_PAGE, SET_SELECTED_PAGE, SET_USERS_PER_PAGE,
  ORDER_BY_USER_SINCE_ASC, ORDER_BY_USER_SINCE_DESC, SET_DISPLAYED_ON_PAGE,
  BAN_USER, SUSPEND_USER, ACTIVATE_USER
} from '../actions/index';


function getUsers({ token }) {
  //fetch data from server

  return function (dispatch) {
    return axios.get(`http://localhost:3001/api/user/users`,
      {
        headers: {
          "x-access-token": token,
        }
      }
    )
      .then(data => {
        dispatch({ type: GET_USERS, payload: data.data });
      })
      .catch((error) => console.error(error));
  };
};

function banUser(id, token) {
  alert(`Jugador id ${id}  baneado`);
  return function (dispatch) {
    return axios.put(`http://localhost:3001/api/user/banuser?userId=${id}`,
      {},
      {
        headers: {
          "x-access-token": token,
        }
      }
    )
      .then(r => {
        console.log(r);
        dispatch({ type: BAN_USER, payload: id });
      })
      .catch((error) => console.error(error));
  }
}

function suspendUser(id, token) {
  alert(`Jugador id ${id} suspendido`);
  return function (dispatch) {
    return axios.put(`http://localhost:3001/api/user/suspenduser?userId=${id}`,
      {},
      {
        headers: {
          "x-access-token": token,
        }
      }
    )
      .then(r => {
        console.log(r);
        dispatch({ type: SUSPEND_USER, payload: id });
      })
      .catch((error) => console.error(error));
  }
}

function activateUser(id, token) {
  alert(`Jugador id ${id} reactivado.`)
  return function (dispatch) {
    return axios.put(`http://localhost:3001/api/user/activateuser?userId=${id}`,
      {},
      {
        headers: {
          "x-access-token": token,
        }
      }
    )
      .then(r => {
        console.log(r);
        dispatch({ type: ACTIVATE_USER, payload: id });
      })
      .catch((error) => console.error(error));
  }
}



function filterByName(payload) {
  return function (dispatch) {
    return dispatch({ type: FILTER_BY_NAME, payload })
  }
}

function filterByEmail(payload) {
  return function (dispatch) {
    return dispatch({ type: FILTER_BY_EMAIL, payload })
  }
}

function sortByPlayedAsc() {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_GAMES_ASC })
  }
}

function sortByPlayedDesc() {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_GAMES_DESC })
  }
}

function sortByWonAsc() {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_WINS_ASC })
  }
}

function sortByWonDesc() {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_WINS_DESC })
  }
}

function sortByLostAsc() {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_LOST_ASC })
  }
}

function sortByLostDesc() {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_LOST_DESC })
  }
}

function sortByUserSinceAsc() {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_USER_SINCE_ASC })
  }
}

function sortByUserSinceDesc() {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_USER_SINCE_DESC })
  }
}

function setDisplayedOnPage(payload) {
  return function (dispatch) {
    return dispatch({ type: ORDER_BY_USER_SINCE_DESC, payload })
  }
}

function setResultsPerPage(payload) {
  return function (dispatch) {
    return dispatch({ type: SET_TOTAL_PAGES, payload })
  }
}

function goToPage(payload) {
  return function (dispatch) {
    return dispatch({ type: GO_TO_N_PAGE, payload })
  }
}

function setSelectedPage(payload) {
  return function (dispatch) {
    return dispatch({ type: SET_SELECTED_PAGE, payload })
  }
}

function setUsersPerPage(payload) {
  return function (dispatch) {
    return dispatch({ type: SET_USERS_PER_PAGE, payload })
  }
}

export default {
  getUsers, filterByName, filterByEmail,
  sortByPlayedAsc, sortByPlayedDesc, sortByWonAsc, sortByWonDesc,
  sortByLostAsc, sortByLostDesc, sortByUserSinceAsc, sortByUserSinceDesc,
  setDisplayedOnPage, goToPage, setSelectedPage, setResultsPerPage,
  setUsersPerPage,
  banUser, suspendUser, activateUser
};
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
import { GET_USERS, FILTER_BY_EMAIL, FILTER_BY_NAME, FILTER_BY_ID } from '../actions/index';
import { ORDER_BY_GAMES_ASC, ORDER_BY_GAMES_DESC, ORDER_BY_WINS_ASC, ORDER_BY_WINS_DESC } from '../actions/index';
import {
  ORDER_BY_LOST_ASC, ORDER_BY_LOST_DESC, GO_TO_N_PAGE, SET_SELECTED_PAGE, SET_USERS_PER_PAGE, SET_TOTAL_PAGES, SET_DISPLAYED_ON_PAGE,
  ORDER_BY_USER_SINCE_ASC, ORDER_BY_USER_SINCE_DESC,
  BAN_USER, SUSPEND_USER, ACTIVATE_USER
} from '../actions/index';
import comparers from './helpers/comparers';
import getForPage from './helpers/getForPage';
import arrCreator from './helpers/arrCreator';

const INITIAL_STATE = {
  users: {},
  currentPage: 1,
  selectedPage: 1,
  orderedUsers: [],
  filteredUsers: [], // mejor renombrarlo a filteredUsers --> se ordenan, se filtran y se muestran
  displayedInPage: [],
  filterValue: "",
  emailFilterValue: "",
  pages: [1, 2, 3],
  usersPerPage: 10,

};

//helper function


const adminPanelReducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {

    case GET_USERS:
      var newDisplayedInPage = payload;
      var newDisplayedInPage2 = getForPage(newDisplayedInPage, 1, 10);
      var pagesAmount = payload.length / state.usersPerPage;
      var pagesArr = arrCreator(pagesAmount);

      return {
        ...state,
        orderedUsers: payload,
        filteredUsers: payload,
        displayedInPage: newDisplayedInPage2,
        pages: pagesArr,
      };

    case FILTER_BY_NAME:

      var previousUsers = state.orderedUsers.filter(u => {
        return (
          u.username.toLowerCase().includes(state.filterValue.toLowerCase()) &&
          u.email.toLowerCase().includes(state.emailFilterValue.toLowerCase())
        )
      }
      )
      var newUsers = previousUsers.filter(u => u.username.toLowerCase().includes(payload.toLowerCase()));
      var newDisplayedInPage = newUsers;
      var newDisplayedInPage2 = getForPage(newDisplayedInPage, state.selectedPage, state.usersPerPage);
      var pagesAmount = newUsers.length / state.usersPerPage;
      var pagesArr = arrCreator(pagesAmount);
      return {
        ...state,
        filterValue: payload, // Que raro, hubiera esperado que tengo que concatenarlo pero no... por que será...
        filteredUsers: newUsers,
        displayedInPage: newDisplayedInPage2,
        pages: pagesArr,
        currentPage: 1,
      };

    case FILTER_BY_EMAIL:
      var previousUsers = state.orderedUsers.filter(u => {
        return (
          u.username.toLowerCase().includes(state.filterValue.toLowerCase()) &&
          u.email.toLowerCase().includes(state.emailFilterValue.toLowerCase())
        )
      }
      )
      var newUsers = previousUsers.filter(u => u.email.toLowerCase().includes(payload.toLowerCase()));
      var newDisplayedInPage = newUsers;
      var newDisplayedInPage2 = getForPage(newDisplayedInPage, state.selectedPage, state.usersPerPage);
      var pagesAmount = newUsers.length / state.usersPerPage;
      var pagesArr = arrCreator(pagesAmount);
      return {
        ...state,
        emailFilterValue: payload, // Que raro, hubiera esperado que tengo que concatenarlo pero no... por que será...
        filteredUsers: newUsers,
        displayedInPage: newDisplayedInPage2,
        pages: pagesArr,
        currentPage: 1,
      };

    case ORDER_BY_GAMES_ASC:
      var newOrderedUsers = [...state.orderedUsers];
      var newOrderedUsers2 = newOrderedUsers.sort(comparers.byPlayedAsc)
      return {
        ...state,
        orderedUsers: newOrderedUsers2,
        filteredUsers: newOrderedUsers2,
      };

    case ORDER_BY_GAMES_DESC:
      var newOrderedUsers = [...state.orderedUsers];
      var newOrderedUsers2 = newOrderedUsers.sort(comparers.byPlayedDesc)
      return {
        ...state,
        orderedUsers: newOrderedUsers2,
        filteredUsers: newOrderedUsers2,
      };

    case ORDER_BY_WINS_ASC:
      var newOrderedUsers = [...state.orderedUsers];
      var newOrderedUsers2 = newOrderedUsers.sort(comparers.byWonAsc)
      return {
        ...state,
        orderedUsers: newOrderedUsers2,
        filteredUsers: newOrderedUsers2,
      };

    case ORDER_BY_WINS_DESC:
      var newOrderedUsers = [...state.orderedUsers];
      var newOrderedUsers2 = newOrderedUsers.sort(comparers.byWonDesc)
      return {
        ...state,
        orderedUsers: newOrderedUsers2,
        filteredUsers: newOrderedUsers2,
      };

    case ORDER_BY_LOST_ASC:
      var newOrderedUsers = [...state.orderedUsers];
      var newOrderedUsers2 = newOrderedUsers.sort(comparers.byLostAsc)
      return {
        ...state,
        orderedUsers: newOrderedUsers2,
        filteredUsers: newOrderedUsers2,
      };

    case ORDER_BY_LOST_DESC:
      var newOrderedUsers = [...state.orderedUsers];
      var newOrderedUsers2 = newOrderedUsers.sort(comparers.byLostDesc)
      return {
        ...state,
        orderedUsers: newOrderedUsers2,
        filteredUsers: newOrderedUsers2,
      };

    case ORDER_BY_USER_SINCE_ASC:
      var newOrderedUsers = [...state.orderedUsers];
      var newOrderedUsers2 = newOrderedUsers.sort(comparers.byUserSinceAsc)
      return {
        ...state,
        orderedUsers: newOrderedUsers2,
        filteredUsers: newOrderedUsers2,
      };

    case ORDER_BY_USER_SINCE_DESC:
      var newOrderedUsers = [...state.orderedUsers];
      var newOrderedUsers2 = newOrderedUsers.sort(comparers.byUserSinceDesc)
      return {
        ...state,
        orderedUsers: newOrderedUsers2,
        filteredUsers: newOrderedUsers2,
      };

    case SET_DISPLAYED_ON_PAGE:
      var newDisplayedInPage = [...state.displayedInPage];
      var newDisplayedInPage2 = getForPage(newDisplayedInPage, payload.pageToShow, payload.usersPerPage);
      return {
        ...state,
        displayedInPage: newDisplayedInPage2
      };

    case GO_TO_N_PAGE:
      var newDisplayedInPage = [...state.filteredUsers]
      var newDisplayedInPage2 = getForPage(newDisplayedInPage, state.selectedPage, state.usersPerPage);
      console.log("Usuarios mostrados en esta página:")
      console.log(newDisplayedInPage2);
      return {
        ...state,
        displayedInPage: newDisplayedInPage2,
        currentPage: state.selectedPage,
      };

    case SET_SELECTED_PAGE:
      return {
        ...state,
        selectedPage: payload,
      };

    case SET_USERS_PER_PAGE:
      var newValue = parseInt(payload)
      var pagesAmount = state.filteredUsers.length / newValue;
      var pagesArr = arrCreator(pagesAmount);
      return {
        ...state,
        usersPerPage: newValue,
        pages: pagesArr
      };

    case SET_TOTAL_PAGES:
      var pagesAmount = payload.length / state.resultsPerPage;
      var pagesArr = arrCreator(pagesAmount);
      return {
        ...state,
        pages: pagesArr
      };

    case BAN_USER:
      var newOrderedUsers = [...state.orderedUsers];
      var newFilteredUsers = [...state.filteredUsers]; // mejor renombrarlo a filteredUsers --> se ordenan, se filtran y se muestran
      var newDisplayedInPage = [...state.displayedInPage];
      function changeBan(userId, arr) {
        var user = arr.find(u => u.id === userId);
        user.status = "baneado";
      }
      changeBan(payload, newOrderedUsers);
      changeBan(payload, newFilteredUsers);
      changeBan(payload, newDisplayedInPage);
      return {
        ...state,
        OrderedUsers: newOrderedUsers,
        FilteredUsers: newFilteredUsers,
        DisplayedInPage: newDisplayedInPage
      };

    case SUSPEND_USER:
      var newOrderedUsers = [...state.orderedUsers];
      var newFilteredUsers = [...state.filteredUsers]; // mejor renombrarlo a filteredUsers --> se ordenan, se filtran y se muestran
      var newDisplayedInPage = [...state.displayedInPage];
      function changeSuspend(userId, arr) {
        var user = arr.find(u => u.id === userId);
        user.status = "suspendido";
      }
      changeSuspend(payload, newOrderedUsers);
      changeSuspend(payload, newFilteredUsers);
      changeSuspend(payload, newDisplayedInPage);
      return {
        ...state,
        OrderedUsers: newOrderedUsers,
        FilteredUsers: newFilteredUsers,
        DisplayedInPage: newDisplayedInPage
      };

    case ACTIVATE_USER:
      var newOrderedUsers = [...state.orderedUsers];
      var newFilteredUsers = [...state.filteredUsers]; // mejor renombrarlo a filteredUsers --> se ordenan, se filtran y se muestran
      var newDisplayedInPage = [...state.displayedInPage];
      function changeActivate(userId, arr) {
        var user = arr.find(u => u.id === userId);
        user.status = "activo";
      }
      changeActivate(payload, newOrderedUsers);
      changeActivate(payload, newFilteredUsers);
      changeActivate(payload, newDisplayedInPage);
      return {
        ...state,
        OrderedUsers: newOrderedUsers,
        FilteredUsers: newFilteredUsers,
        DisplayedInPage: newDisplayedInPage
      };

    default:
      return state;

  };

};

export default adminPanelReducer;




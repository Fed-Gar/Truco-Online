import React from 'react';
import { Route, Switch } from "react-router-dom";

import Landing from './components/Landing';
import Welcome from "./components/Welcome";
import Profile from "./components/Profile";
import SignUp from "./components/SignUp";
import Rooms from './components/rooms/Rooms';
import LogIn from './components/LogIn';
import ErrorPage from './components/ErrorPage';
import Game from './components/game';
import Ranking from './components/Ranking';
import PrivateRoute from './components/PrivateRoute';
import AdminPanel from './components/AdminPanel';
import BannedPlayer from './components/BannedPlayer';
import Tournaments from './components/tournaments/Tournaments';
import EditProfile from './components/EditProfile';
import Tutorial from './components/tutorial/Tutorial';

function App() {
  return (
    <div className="App">
      <Switch>

        <Route exact path='/' component={Landing} />
        <Route exact path='/welcome' component={Welcome} />
        <Route exact path='/sign-up' component={SignUp} />
        <Route exact path='/log-in' component={LogIn} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/edit" component={EditProfile} />
        <Route exact path='/rooms' component={Rooms} />
        <Route exact path='/game' component={Game} />
        <PrivateRoute exact path="/tournaments" component={Tournaments} />
        <PrivateRoute exact path="/ranking" component={Ranking} />
        <PrivateRoute exact path='/adminpanel' component={AdminPanel} />
        <Route exact path='/bannedplayer' component={BannedPlayer} />
        <Route exact path='/tutorial' component={Tutorial} />
        <Route path="*" component={ErrorPage} />
      </Switch>
    </div>
  );
};

export default App;

import React from 'react';
import { Redirect, Route } from "react-router";

export default function PrivateRoute({ component: Component, ...rest }) {

    const logged = window.localStorage.getItem("isAuth");

    return (
        <Route {...rest}>
            {logged ? <Component /> : <Redirect to="/" />}
        </Route>
    );
};
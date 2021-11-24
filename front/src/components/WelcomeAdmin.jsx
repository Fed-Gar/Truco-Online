import React from 'react';
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';
import HomeButton from './HomeButton';
import { useDispatch } from "react-redux";
import { logInFacebook } from '../Redux/actions-types/logActions'
// import { useHistory } from 'react-router';


import styles from './styles/Welcome.module.css';

export default function Welcome() {

    const dispatch = useDispatch()
    // const history = useHistory()

    const responseFacebook = (response) => {
        console.log(response)
        dispatch(logInFacebook(response));

        // console.log(response.email)
        // history.push('/rooms');
    }


    return (
        <>
            <HomeButton />
            <section className={styles.mainDiv}>
                <form action="" className={styles.form}>
                    <div className={styles.divButtons}>
                        <Link to='/log-in'>
                            <button className={styles.btnLogIn}>Log In</button>
                        </Link>
                        <FacebookLogin
                            appId="414547080239642"
                            autoLoad={false}
                            fields="name,email,picture"
                            callback={responseFacebook}
                            cssClass={styles.facebook}
                        />,
                    </div>
                </form>
            </section>
        </>
    );
};
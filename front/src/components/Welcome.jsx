import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router';
import FacebookLogin from 'react-facebook-login';

import HomeButton from './HomeButton';

import { logInFacebook  } from '../Redux/actions-types/logActions';

import styles from './styles/Welcome.module.css';

export default function Welcome() {
    
    const dispatch = useDispatch()
    const history = useHistory()

    const responseFacebook = (response) => {
        dispatch(logInFacebook(response));
        setTimeout(() => {
            history.push('/rooms');
          }, 2000);
    };

    return(
        <>
            <HomeButton />
            <section className={styles.mainDiv}>
                <div className={styles.divButtons}>
                    <Link to='/log-in'>
                        <button className={styles.btn}>Ingresar</button>
                    </Link>
                    <FacebookLogin
                        appId="414547080239642"
                        autoLoad={false}
                        fields="name,email,picture"
                        callback={responseFacebook}
                        cssClass={styles.facebook}
                    />,
                    <Link to='/sign-up'>
                        <button className={styles.btn}>Registrarse</button>
                    </Link>
                    <Link to='/rooms'>
                        <button className={styles.btn}>Acceso como Invitado</button>
                    </Link>
                </div>
            </section>
        </>
    );
};
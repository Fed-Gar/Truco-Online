import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../img/logo.png';
import styles from './styles/HomeButton.module.css';

export default function HomeButton() {
    return(
        <div className={styles.container}>
            <Link to="/">
                <img src={logo} alt="Logo Henry Truco" />
            </Link>
        </div>
    );
};
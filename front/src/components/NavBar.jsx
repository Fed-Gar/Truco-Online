/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect }  from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import profileActions from '../Redux/actions-types/profileActions';

import styles from './styles/NavBar.module.css'

import logo from '../img/logo.png';
import profileIcon from '../img/profileIcon.png';

export default function NavBar() {
    
    const { getProfile } = profileActions;

    const { userProfile } = useSelector(state => state.profileReducer);

    const dispatch = useDispatch();

    const [toggleMenu, setToggleMenu] = useState(false);
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    
    const showLogo = toggleMenu ? styles.showLogo : null;

    const [isAuth, setIsAuth] = useState(false); 

    const visible = toggleMenu ? styles.visible : null;

    useEffect(() => {
        const logged = window.localStorage.getItem("isAuth");
        if(logged) {
            setIsAuth(logged);
            dispatch(getProfile({token: localStorage.token}));
        };
    }, []);
    
    useEffect(() => {
        const changeWidth = () => {
            setScreenWidth(window.innerWidth);
        };
        window.addEventListener('resize', changeWidth);
        return () => {
            window.removeEventListener('resize', changeWidth);
        };
    }, []);
    
    const toggleNav = () => {
        setToggleMenu(!toggleMenu);
    };

    return (
        <nav className={styles.nav}>
            <div className={styles.logo + ' ' + showLogo}>
                <Link to='/'>
                        <img src={logo} alt="TrucoHenry" />             
                </Link>
            </div>
            {
                (toggleMenu || screenWidth > 768) && (
                    <>
                        <div className={styles.groupLinks}> 
                            <Link to='/rooms' className={styles.links}>Salas</Link>
                            <Link to='/tutorial' className={styles.links}>Tutorial</Link>
                            {
                                isAuth ? 
                                <>
                                    <Link to='/ranking' className={styles.links}>Ranking</Link>
                                    <Link to='/tournaments' className={styles.links}>Torneos</Link>
                                </>
                                :
                                null
                            }
                        </div>
                        <div className={styles.contProfile}>
                            {
                                isAuth && screenWidth > 1240 ? 
                                <Link to='/profile' className={styles.links}>
                                    <img src={userProfile.image === 'false' ? profileIcon : userProfile.image} alt="profile picture" />
                                    {`Hola, ${userProfile.username}!`}
                                </Link>
                                :
                                isAuth ?
                                <Link to='/profile' className={styles.links}>
                                    <img src={userProfile.image === 'false' ? profileIcon : userProfile.image} alt="profile picture" />
                                </Link>
                                :
                                null
                            }
                        </div>
                    </>
                )
            }
            <p className={styles.menuOn + ' ' + visible} onClick={toggleNav}>
                <span></span>
                <span></span>
                <span></span>
            </p>
        </nav>
    );
};
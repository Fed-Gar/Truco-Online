/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch , useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { useModal } from '../hooks/useModal';

import Modal from './Modal';
/* Los dos siguientes imports agregados por guille */
import Friend from './Friend';
import AddFriend from './addFriend';
import Match from './Match';
// nav
import NavBar from './NavBar';
// request de partida amigos
import GameRequest from './GameRequest';

import log from '../Redux/actions-types/logActions';
import profileActions from '../Redux/actions-types/profileActions';

import styles from './styles/Profile.module.css';
import profileIcon from '../img/profileIcon.png';

export default function Profile(props) {

    const history = useHistory();
    const { logOut } = log;
    const [isOpenModal, openModal, closeModal] = useModal();

    //Estados del profileReducer
    const [friends, setFriends] = useState({
        sender: [],
        requested: []
    });
    const [removeSuccess, setRemoveSuccess] = useState(false)
    const [isDelete, setIsDelete] = useState("delete")
    const [deleteFriend, setDeleteFriend] = useState("");

    //userProfile: es el estado del usuario logeado

    const { userProfile, userFriends, userHistory  } = useSelector(state => state.profileReducer);
    const {getProfile, getFriends, deleteFriends, putFriendRequest, getGames} = profileActions;

    const dispatch = useDispatch();

    const games = userHistory.length > 5 ? userHistory.slice(0, 5) : userHistory;

    //Trae primeramente los datos del usuario y sus amigos
    useEffect(() => {
        //informacion del usuario logeado
        dispatch(getProfile({token: localStorage.token}));
        //todos los amigos (pendientes y aceptados) del usuario
        dispatch(getFriends(localStorage.token));
        //todas las partidas del usuario
        dispatch(getGames(localStorage.token));
    }, []);

    // Esto es para que se actualice el estado una vez que se elimina
    useEffect(() => {
        setFriends({
            sender: userFriends.sender,
            requested: userFriends.requested
        })
        if(removeSuccess){
            setIsDelete("success")
            openModal()
            setRemoveSuccess(false)
        }
    }, [userFriends]);

    //funcionque luego de la confirmacion del modal hace el dispatch y elimina al amigo de la base de datos
    const removeFriend = (flag) => {
        if(flag){
            dispatch(deleteFriends(userProfile.id, deleteFriend));
            setRemoveSuccess(true)
        };
        // setDeleteFriend({
        //     flag:false,
        //     email: ""
        // });
    };

    // Funcion para eliminar un amigo que se pasa a cada componente de amigos
    const deleteFriendFunction = (email) => {
        setDeleteFriend({
            flag:false,
            email: ""
        });
        setDeleteFriend(email);
        setIsDelete("delete")
        openModal();
    };

    //Funcion para responder a una solicitud
    const respondFriendFunction = (email, response) => {
        dispatch(putFriendRequest(userProfile.id, email, response));
        window.location.reload();
    };

    //Funcion para hacer log out
    const logout = () => {
        dispatch(logOut()); 
        history.push("/");
    };

    const editProfile = () => {
        history.push("/edit");
    };

    //Confirmacion para el modal
    const confirmation = (flag) => {
        removeFriend(flag);
        closeModal();
    };

    return (
        <>
            <NavBar />
            <Modal isOpen={isOpenModal} closeModal={closeModal} removeFriend={removeFriend} deleteButtons={isDelete} friend={deleteFriend}>
                {
                    // Esto confirma la eliminacion de un amigo
                    isDelete === "delete" ?
                    <div className={styles.modalTextCont}>
                        <p>¿Estas seguro de que deseas eliminar esta amistad?</p> 
                        <div className={styles.btnDiv}>
                            <button className={styles.leftBtn} onClick={() => confirmation(true)}>
                                Si
                            </button>
                            <button className={styles.rightBtn} onClick={() => confirmation(false)}>
                                No
                            </button>
                        </div>
                    </div> 
                    : 
                    //Comunica que efectivamente se elimino el usuario
                    isDelete === "success" ?
                        <div className={styles.successDiv}>
                            <p>Se ha eliminado con exito a {deleteFriend}</p>
                        </div>
                    : 
                    null
                }
            </Modal>
            <GameRequest/>
            <button className={styles.logoutBtn} onClick={logout}></button>
            <div className={styles.mainDiv}>
                <div className={styles.subMainDiv}>
                    <div className={styles.player}>
                        <div className={styles.playerName}>
                            <img 
                                src={userProfile.image === 'false' ? profileIcon : userProfile.image} 
                                alt="Image User" 
                                className={styles.profileIcon} />
                        </div>
                        <div className={styles.playerInfo}>
                            <button className={styles.editBtn} onClick={editProfile}>Editar</button>
                            <h2 className={styles.statsTitle}>Estadisticas</h2>
                            <div className={styles.gamesAndTournamentsStats}>
                                <div className={styles.games}>
                                    <div className={styles.infoGames}>
                                        <p>{userProfile?.gamesPlayed}</p>
                                        <p>Partidas Jugadas</p>
                                    </div>
                                    <div className={styles.playerInfo_Games}>
                                        <div className={styles.infoGames}>
                                            <p style={{color:"#228B22"}}>{userProfile?.gamesWon}</p>
                                            <p>Ganadas</p>
                                        </div>
                                        <div className={styles.infoGames}>
                                            <p style={{color:"#ff0000"}}>{userProfile?.gamesLost}</p>
                                            <p>Perdidas</p>
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className={styles.games}>
                                    <div className={styles.infoGames}>
                                        <p>{userProfile?.tournamentsPlayed}</p>
                                        <p>Torneos jugados</p>
                                    </div>
                                    <div className={styles.playerInfo_Games}>
                                        <div className={styles.infoGames}>
                                            <p style={{color:"#228B22"}}>{userProfile?.tournamentsWon}</p>
                                            <p>Ganados</p>
                                        </div>
                                        <div className={styles.infoGames}>
                                            <p style={{color:"#ff0000"}}>{userProfile?.tournamentsLost}</p>
                                            <p>Perdidos</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div className={styles.friends}>
                        <div className={styles.friendsDiv}>
                            <h3 className={styles.title}>Amigos</h3>
                            <div className={styles.friendsList}>
                                {
                                    !friends.sender.length ? <p className={styles.text}>No tienes amigos</p> : friends.sender.map(f => <Friend
                                        key={f?.id}
                                        email={f?.email}
                                        image={f?.image}
                                        deleteId={deleteFriendFunction}
                                        profileId={userProfile?.id}
                                        id={f?.id}
                                        name={f?.username}
                                        date={f.Friends?.createdAt}
                                        status = {f.Friends.status}
                                    />)
                                }
                            </div>
                        </div>
                        <div className={styles.friendsDiv}>
                            <h3 className={styles.title}>Solicitudes pendientes</h3>
                            <div className={styles.friendsList}>
                                {
                                    !friends.requested.length 
                                        ? 
                                        <p className={styles.text}>Sin solicitudes pendientes</p> 
                                        : 
                                        friends.requested.map(f => <AddFriend
                                            key={f.username}
                                            username={f.username}
                                            respond={respondFriendFunction}
                                            email={f.email}
                                    />)
                                }
                            </div>
                        </div>
                    </div>
                    <div className={styles.lastResults}>
                        <h3 classname={styles.title}>Últimos resultados</h3>
                        <div className={styles.history}>
                            {
                                !games?.length ? null : games.map(m => <Match
                                    key={m?.id}
                                    id={m?.id}
                                    result={m?.winner === userProfile.username ? "Ganaste" : "Perdiste"}
                                    j1={m?.winner}
                                    j2={m?.loser}
                                    date={m?.createdAt}
                                />)
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
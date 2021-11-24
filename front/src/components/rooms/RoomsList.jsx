import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import socket from '../socket';

import { setIsInRoom } from '../../Redux/actions-types/roomsActions';

import GameRequest from '../GameRequest';

import styles from './styles/RoomsList.module.css';

export default function RoomsList(){
    const [allRooms, setAllRooms] = useState([])
    const [roomWithPassword, setRoomWithPassword] = useState(false)
    const [roomData, setRoomData] = useState({})
    const [userRoomTest, setUserRoomTest] = useState("")

    // const [roomId, setRoomId] = useState('')
    const dispatch = useDispatch();

    useEffect(() => {
        socket.on('showActiveRooms', (rooms) => {
            setAllRooms([rooms]);
        });
        // socket.emit('bringActiveRooms') //automaticamente hacer update de rooms cuando hay cambios en allRooms?

        return () => {socket.off()}
    }, [allRooms]);

    useEffect(()=>{
        socket.emit('bringActiveRooms')  // traer todas las rooms disponibles al entrar
    }, []);

    useEffect(()=>{
        socket.on("newRoomCreated", () => {socket.emit('bringActiveRooms')}) //actualizar en tiempo real rooms disponibles
        return ()=>{
            socket.off("newRoomCreated");
        };
    });

    const joinRoom = async (event) => {
        event.preventDefault();
        //  En caso de existir contraseña
        if(event.target[0].attributes[3]){
            setRoomData({idRoom: event.target[0].value, password: event.target[0].attributes[3].nodeValue})
            setRoomWithPassword(true)
        }
        else{
            socket.emit('joinRoom', (parseInt(event.target[0].value)), localStorage.user, localStorage.token)
            dispatch(setIsInRoom({isInRoom: true, roomId: parseInt(event.target[0].value)}))
        }
    }

    const joinRoomPassword = async (event) => {
        event.preventDefault();
        console.log(event.target[0].value)
        if(event.target[0].value === roomData.password){
            socket.emit('joinRoom', (parseInt(roomData.idRoom)), localStorage.user, localStorage.token)
            dispatch(setIsInRoom({isInRoom: true, roomId: parseInt(roomData.idRoom)}))
        } 
    }

    return (
        <>
            <GameRequest/>
            <div className={styles.roomsList}>
                {
                allRooms.length > 0
                ?   
                    allRooms[0].activeRooms.map(room => 
                    <div key={room.id}>
                        <form onSubmit={joinRoom}>
                            <button type='submit' value={room.id} className={styles.roomBtn} password={room.password ? room.password : null}>
                                <p>Room Id: {room.id} | </p>
                                <p>Host: {room.host} | </p>
                                {
                                    room.password
                                    ? <p>Status: Private</p>
                                    : <p>Status: Public</p>
                                }
                            </button>
                        </form>
                    </div>
                    )
                :
                    <p>No hay rooms...</p>
                }
            </div>
            <div>
                {
                    roomWithPassword
                    ? 
                    <div>
                        <h6>Ingresa la contraseña</h6>
                        <form onSubmit={joinRoomPassword}>
                            <input type="text" placeholder={'Contraseña...'} />
                        </form>
                    </div>
                    : null
                }
            </div>
        </>
    );
};
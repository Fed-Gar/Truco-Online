import React, {useState} from 'react';
import {useDispatch} from 'react-redux'

import { setIsInRoom } from '../../Redux/actions-types/roomsActions';
import socket from '../socket';
import styles from './styles/JoinRoomForm.module.css'

export default function JoinRoomForm (){
    const [roomPassword, setRoomPassword] = useState("")

    const dispatch = useDispatch()
    console.log(typeof localStorage.token)

    const joinRoom = async (event) => {
      if(localStorage.isAuth){
      event.preventDefault();
      let idGenerator = Math.floor(Math.random()*100000)
      socket.emit('joinRoom', (idGenerator), localStorage.user, localStorage.token, roomPassword)
      socket.on("fullRoom", (bool)=>setIsInRoom(bool))
      dispatch(setIsInRoom({isInRoom: true, roomId: idGenerator}))
      }
      else alert("Tienes que estar registrado para crear salas, pero puedes unirte a las de otros usuarios");
    }
 
    return(
      <div>
        <form onSubmit={joinRoom}>
          <button type='submit' className={styles.btn}>Crear nueva sala</button>
        </form>
        <input type="text" placeholder={'Contraseña (opcional)...'} onChange={(event) => setRoomPassword(event.target.value)} />
      </div>
    )

}
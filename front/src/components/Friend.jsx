import React from "react";
import { useModal } from '../hooks/useModal';

import FriendInfo from './FriendInfo';

import styles from './styles/Friend.module.css'
import profileIcon from '../img/profileIcon.png'

export default function Friend({ name, date, id, deleteId, email, status , image}) {
  
  const [isOpen, open, close] = useModal();

  const deleteFriend = () => {
    deleteId(email);
  };

  return (
    <div className={styles.mainDiv}>
      <img src={image === "false" ? profileIcon : image } alt="Avatar" className={styles.profileIconSmall} />
      <div className={styles.status}> 
        <h3 className={styles.name} onClick={open}>{name}</h3>
        {/* {status === "accepted" ? null : <p>Status:</p>} */}
        {/* {status === "accepted" ? null : <p>{status}</p>} */}
        
      </div>
      { 
        status === "pending" ? 
        <p className={styles.pendingRequest}>{status}</p>
        : 
        <button className={styles.btn} onClick={() => deleteFriend()}>Eliminar</button>
      }
      {/* Desplegar info detallada */}
      <FriendInfo isOpen={isOpen} close={close} name={name} date={date} email={email} id={id} image={image  } />
    </div>
  );
};
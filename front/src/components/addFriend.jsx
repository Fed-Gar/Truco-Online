import React from "react";

import styles from './styles/Friend.module.css'
import profileIcon from '../img/profileIcon.png'

export default function AddFriend({username, respond, email}) {

  const handleAcceptClick = (e) => {
    e.preventDefault();
    respond(email, "accepted");
  };

  const handleRejectClick = (e) => {
    e.preventDefault();
    respond(email, "rejected");
  };
  
  return (
    <div className={styles.mainDiv}>
      <img src={profileIcon} alt="" className={styles.profileIconSmall} />
      <h3 className={styles.name + ' ' + styles.friendReq}>De: {username}</h3>
      <button className={styles.btn + ' ' + styles.btnAccept} onClick={handleAcceptClick}>
        Aceptar
      </button>
      <button className={styles.btn} onClick={handleRejectClick}>
        Rechazar
      </button>
    </div>
  );
};
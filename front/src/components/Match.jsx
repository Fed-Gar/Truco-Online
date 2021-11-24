import React from "react";

import styles from './styles/Match.module.css'

export default function Match({ result, j1, j2, date }) {
  return (
    <div className={styles.mainDiv}>
      <div className={styles.div1 + ' ' + styles.div}>
        <p>Fecha:</p>
        <p>{date?.split("T")[0]}</p>
      </div>
      <div className={styles.div2 + ' ' + styles.div}>
        <p>Jugadores:</p>
        <p>{j1} vs {j2}</p>
      </div>
      <div className={styles.div3 + ' ' + styles.div}>
        <p>Resultado</p>
        <p>{result}</p>
      </div>
    </div>
  );
};
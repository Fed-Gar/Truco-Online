import React from 'react';

import game from '../../img/game.webp'

import styles from './styles/Comienzo.module.css'

export default function Comienzo() {
    const intro = 'En el “truco”, hay dos formas de jugarse los puntos: al envido y/o al truco_ Cada uno de estos te dara puntos dependiendo lo apostado en cada mano_ El objetivo del juego es llegar a los 15 o 30 puntos.'    
    
    return (
        <div className={styles.board}>
            <div className={styles.title}>
                <p>{intro}</p>
            </div>  
            <img src={game} className={styles.game} alt=''/>
        </div>
    );
};
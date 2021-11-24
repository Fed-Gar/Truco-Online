import React from 'react';
import styles from './styles/cup.module.css'

const Cup = ({username , pos , won }) => {

    return (
        <div className={styles.cupCard}>
            <div className={styles.name}>
                <p className={styles.username}>{username} </p>
                <p className={styles.title}>Ganados:</p>
                <p className={styles.won}>{won}</p>
            </div>
            <h3 className={styles.pos}>{pos}</h3>
        </div>
    );
};

export default Cup;

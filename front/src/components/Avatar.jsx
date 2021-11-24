import React from 'react';

import styles from './styles/Avatar.module.css';

export default function Avatar({name, image, set}) {
    return (
        <div className={styles.avatarContainer} onClick={() => set(image)}>
            <img src={image} alt={`Imagen de Avatar ${name}.`} />
            <p>{name}</p>
        </div>
    );
};
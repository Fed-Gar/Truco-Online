import React from 'react';

import Avatar from './Avatar';

import styles from './styles/Avatars.module.css';
import profileIcon from '../img/profileIcon.png';
import avatar1 from '../img/avatar1.png';
import avatar2 from '../img/avatar2.png';

const avatars = [
    {
        name: 'Default',
        image: profileIcon,
    },
    {
        name: 'Avatar1',
        image: avatar1,
    },
    {
        name: 'Avatar2',
        image: avatar2,
    },
];

export default function Avatars({set}) {
    return (
        <>
            <h4 className={styles.title}> Elegí tu Avatar: </h4>
            <div className={styles.avatarsContainer}>
                {
                    avatars && avatars.map(avatar => {
                        return <Avatar 
                                    key={avatar.name}
                                    name={avatar.name} 
                                    image={avatar.image} 
                                    set={set}
                                />
                    })
                }
            </div>
        </>
    );
};
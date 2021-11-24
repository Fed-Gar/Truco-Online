import React from 'react';

import { useModal } from '../hooks/useModal';

import Modal from './Modal';

import styles from './styles/DeleteFriendButton.module.css';

export default function DeleteFriendButton(props) {

    const [isOpen, open, close] = useModal();

    return (
        <>
            <button className={styles.delButton} onClick={open}> Eliminar de amigos </button>
            <Modal isOpen={isOpen} closeModal={close}>
                <p>Deseas eliminar a {props.name} de tus amigos?</p>
                <button className={styles.confirmButton} onClick={props.delete}>Si</button>
                <button className={styles.confirmButton} onClick={close}>No</button>
            </Modal> 
        </>      
    );
};
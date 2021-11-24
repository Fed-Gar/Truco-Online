/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import socket from '../socket';

import styles from './styles/Chat.module.css';

export default function ChatLobby ({name, roomId, typeofChat}) {
    const [msg, setMsg] = useState('');
    const [msgs, setMsgs] = useState([]);

    useEffect(() => {
        socket.emit('joinToGlobalChat', "lobby");
    }, []);

    useEffect(() => {
        socket.on('lobbyMessages', (data) => {
            setMsgs([...msgs, `${data.name}: ${data.msg}`]);
        })

        return () => {socket.off("lobbyMessages")};
    });

    const divRef = useRef(null);

    useEffect(() => {
        divRef.current.scrollIntoView({behavior: 'smooth'});
    });

    const submit = (event) => {
        event.preventDefault();
        socket.emit('lobbyMessage', ({name, msg, roomId}), localStorage.isAuth);
        setMsg("");
    };

    return (
        <div className={styles.contChat}>
            <div className={typeofChat==='chatLobby' ? styles.chatLobby : styles.chatGame}>
                {msgs.map((element, i) => ( <div key={i}><div>{element}</div><div>{element.msg}</div></div> ))}
                <div ref={divRef}></div>
            </div>
            <form onSubmit={submit} className={styles.writeMessage}>
                {
                    typeofChat==='chatLobby'
                    ? 
                    <>
                        <textarea 
                            placeholder={'Escribe tu mensaje...'} 
                            name="" 
                            id="" 
                            cols="95" 
                            rows="1" 
                            value={msg} 
                            onChange={event => setMsg(event.target.value)}>
                        </textarea>
                        <button className={styles.btn}>Enviar</button>
                        {/* <input placeholder='Message...' type="text" id="" cols="95" rows="1" value={msg} onChange={event => setMsg(event.target.value)}></input> */}
                    </>
                    : 
                    <input type="text" id="" cols="31" rows="1" value={msg} onChange={event => setMsg(event.target.value)} className={styles.writeMessageGame}></input>
                }
            </form>
        </div>
    );
};
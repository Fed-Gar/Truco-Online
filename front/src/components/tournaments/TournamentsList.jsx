import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux'
import { setIsInTournament } from '../../Redux/actions-types/tournamentsActions';

import socket from '../socket';
import styles from './styles/TournamentsList.module.css'

export default function TournamentsList(){
    const [allTournaments, setAllTournaments] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        socket.on('showActiveTournaments', (tournamentsList) => {
            setAllTournaments(tournamentsList);
        })
        return () => {socket.off()}
    }, [allTournaments])

    useEffect(()=>{
        socket.emit('bringActiveTournaments');  
    }, [])

    useEffect(() => {
        socket.on("newTournamentCreated",()=> {socket.emit('bringActiveTournaments');})
        return () => {socket.off("newTournamentCreated")}
    })

    const joinTournament = async (event) => {
        event.preventDefault();
        socket.emit('joinTournament', ({tournamentId: parseInt(event.target[0].value), user: localStorage.user, userId: parseInt(localStorage.id)}))
        dispatch(setIsInTournament({isInTournament: true, tournamentId: parseInt(event.target[0].value)}))
    }

    return(
        <div>
            <div className={styles.tournamentsList}>
                {
                    allTournaments.length > 0
                ? 
                allTournaments.map(t => 
                    <div key={t.tournamentId}>
                        <form onSubmit={joinTournament}>
                            <button type='submit' value={t.tournamentId} className={styles.tournamentBtn} >
                                <p>Id de torneo: {t.tournamentId}</p>
                                <p>Jugadores actuales:</p>
                                <div className={styles.playersWaiting}>
                                    {
                                        t.players.map(p => <p key={p.userId}>{p.user}</p> )
                                    }
                                </div>
                            </button>
                        </form>
                    </div>)
                :
                    <></>
                }
            </div>
        </div>
    )
}
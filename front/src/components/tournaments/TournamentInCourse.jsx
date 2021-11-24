import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux'

import styles from './styles/TournamentInCourse.module.css'
import socket from '../socket';
import TournamentGames from './TournamentGames';



export default function TournamentInCourse(){
    const[tournamentData, setTournamentData] = useState([]);
    const[savedData, setSavedData] = useState([]);  // Clon del objeto tournament eliminado al conseguir 4 jugadores
    const[isFull, setisFull] = useState(false);
    const[matchesList, setMatchesList] = useState([])
    
    const tournamentId = useSelector(store => store.tournamentsReducer.tournamentId)
    
    useEffect(() => {
        socket.on('sendTournamentData', (data) => {
            // console.log('SENDTOURNAMENTDATA: ', data)
            setTournamentData([data]);
        })
        return () => {socket.off()}
    }, [tournamentData])

    useEffect(() => {
        socket.on("newPlayerInside", () => {
            socket.emit('bringTournamentData', (tournamentId));
        })
        return () => {socket.off()}
    })

    useEffect(() => {
        socket.on("tournamentFull", (dataObject) => {
            socket.emit('matchesList', (dataObject))
            setSavedData([dataObject])            
            setisFull(true)
        })
        return () => {socket.off()}
    })

    useEffect(() => {
        socket.on("matches", (list) => {
            setMatchesList(list)
        })
        return () => {socket.off()}
    })

    return(
        <div className={styles.mainDiv}>
            <h1 className={styles.h1_TournamentId}>Tournament Id: {tournamentId}</h1>
            {
                isFull ?
                    <div>
                        <TournamentGames matchesList={matchesList} savedData={savedData}/>
                    </div>
                :
                <div className={styles.players}>
                    <h3>Actual players: </h3>
                    <div className={styles.playersList}>
                        {
                        tournamentData.length > 0 ?
                            !tournamentData[0] ? null
                                // : console.log('LISTA DE JUGADORES:', tournamentData[0].players)
                                // : tournamentData[0].players.map(p => console.log(p) )
                                : tournamentData[0].players.map(p => <h4 key={p.userId} className={styles.playerName}>{p.user}</h4> )
                        : null
                        }
                    </div>
                </div>
            }
        </div>
    )
}

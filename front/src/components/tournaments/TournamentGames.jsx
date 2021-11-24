// /* eslint-disable array-callback-return */
// /* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable no-unused-vars */

import React, {useEffect, useState} from 'react';
import { useDispatch} from 'react-redux'
import { setLeftTournament } from '../../Redux/actions-types/tournamentsActions';

import styles from './styles/TournamentGames.module.css'

import socket from '../socket';
import Game from '../game';

export default function TournamentGames ({matchesList, savedData}){
    const [showGame, setShowGame] = useState(false)
    const [actualIdGame, setActualIdGame] = useState('')
    const [wins, setWins] = useState([])
    const [allPlayersWins, setAllPlayersWins] = useState([])
    const [showWinner, setShowWinner] = useState(false)
    const [matches, setMatches] = useState([])
    ////////////// Activadores para iniciar las partidas //////////////
    const [firstMatch, setFirstMatch] = useState(false)
    const [secondMatch, setSecondMatch] = useState(false)
    const [thirdMatch, setThirdMatch] = useState(false)

    const [showFirstMatch, setShowFirstMatch] = useState(false)
    const [showSecondMatch, setShowSecondMatch] = useState(false)
    const [showThirdMatch, setShowThirdMatch] = useState(false)

    const [finishedFirstMatch, setFinishedFirstMatch] = useState(false)
    const [finishedSecondMatch, setFinishedSecondMatch] = useState(false)
    const [finishedThirdMatch, setFinishedThirdMatch] = useState(false)
    //////////////////////////////////////////////////////////////////
    const [next, setNext] = useState(0)

    const dispatch = useDispatch()

    useEffect(() => {
        if(matchesList) socket.emit('addMatchesList', ({matchesList, savedData}));
    }, [matchesList, savedData])

    useEffect(() => {
        socket.on('setMatchesList', (list) => {
            setMatches(list)
            setFirstMatch(true);
        })
        // return () => {socket.off()}
    })

    useEffect(() => {
        if(finishedFirstMatch===false && finishedSecondMatch===false && finishedThirdMatch===false){
            if(matches.length>0){
                if(matches[0].participants[0] === localStorage.user || (matches[0].participants[1] === localStorage.user)){
                    console.log('EN CASO DE QUE SE REPITA ARRIBA')
                    socket.emit('tournamentGame', ({tournamentId: savedData[0].tournamentId, matchId: matches[0].matchId}));
                }
                else if(matches[matches.length-1].participants[0] === localStorage.user || (matches[matches.length-1].participants[1] === localStorage.user)){
                    console.log('EN CASO DE QUE SE REPITA ABAJO')
                    socket.emit('tournamentGame', ({tournamentId: savedData[0].tournamentId, matchId: matches[matches.length-1].matchId}));
                }
            }
        }
        else if(finishedFirstMatch===true && finishedSecondMatch===false && finishedThirdMatch===false ){
            // console.log(secondMatch, 'ENTRAMOSSSSSSS USEEFFECT SECONDMATCH')
            if(matches.length>0){
                if(matches[1].participants[0] === localStorage.user || (matches[1].participants[1] === localStorage.user)){
                    console.log(localStorage.user, 'HA ENTRADO A SEGUNDA PARTIDA ARRIBA')
                    socket.emit('tournamentGame', ({tournamentId: savedData[0].tournamentId, matchId: matches[1].matchId, matchNumber: 2}));
                }
                else if(matches[matches.length-2].participants[0] === localStorage.user || (matches[matches.length-2].participants[1] === localStorage.user)){
                    console.log(localStorage.user, 'HA ENTRADO A SEGUNDA PARTIDA ABAJO')
                    socket.emit('tournamentGame', ({tournamentId: savedData[0].tournamentId, matchId: matches[matches.length-2].matchId, matchNumber: 2}));
                }
            }
        }
        else  if(finishedFirstMatch===true && finishedSecondMatch===true && finishedThirdMatch===false){
            // console.log(secondMatch, 'ENTRAMOSSSSSSS USEEFFECT SECONDMATCH')
            if(matches.length>0){
                if(matches[2].participants[0] === localStorage.user || (matches[2].participants[1] === localStorage.user)){
                    console.log(localStorage.user, 'HA ENTRADO A TERCERA PARTIDA ARRIBA')
                    socket.emit('tournamentGame', ({tournamentId: savedData[0].tournamentId, matchId: matches[2].matchId, matchNumber: 3}));
                }
                else if(matches[matches.length-3].participants[0] === localStorage.user || (matches[matches.length-3].participants[1] === localStorage.user)){
                    console.log(localStorage.user, 'HA ENTRADO A TERCERA PARTIDA ABAJO')
                    socket.emit('tournamentGame', ({tournamentId: savedData[0].tournamentId, matchId: matches[matches.length-3].matchId, matchNumber: 3}));

                }
            }
        }
        // return () => {socket.off()}
    }, [firstMatch, secondMatch, thirdMatch])
    

    useEffect(() => {
        socket.on('showGame', (matchId) => {
            setShowFirstMatch(true);
            setActualIdGame(matchId)
        })
        socket.on('showGameTwo', (matchId) => {
            console.log('EL ID DE LA SEGUNDA PARTIDA ES: ', matchId)
            setShowSecondMatch(true);
            setActualIdGame(matchId)
        })
        socket.on('showGameThree', (matchId) => {
            console.log('EL ID DE LA SEGUNDA PARTIDA ES: ', matchId)
            setShowThirdMatch(true);
            setActualIdGame(matchId)
        })
        socket.on('showWinner', (results) => {
            setAllPlayersWins(results)
            setShowWinner(true)
        })
    })

    useEffect(() => {
        if(finishedFirstMatch===true){
            console.log('PRIMERA PARTIDA TERMINADA')
            setSecondMatch(true)
        }
    }, [finishedFirstMatch])

    useEffect(() => {
        if(finishedSecondMatch===true){
            console.log('SEGUNDA PARTIDA TERMINADA')
            setThirdMatch(true)
        }
    }, [finishedSecondMatch])

    useEffect(() => {
        if(finishedFirstMatch===true && finishedSecondMatch===true && finishedThirdMatch===true){
            socket.emit('setWinner', ({tournamentId: savedData[0].tournamentId, playerWins: wins, savedData}))
        }
    }, [finishedFirstMatch, finishedSecondMatch, finishedThirdMatch])

    const leave = () => {
        dispatch(setLeftTournament())
    }

    return(
        <div>
            {matches.length > 0 ? console.log(matches) : null}

            <div style={{display: showFirstMatch || showSecondMatch || showThirdMatch ? "none" : null}}>
                <div className={styles.matchesListDiv}>
                    <h5>Matches:</h5>
                    <div className={styles.matchesList}>
                        {
                            matches.length > 0 ?
                                matches.map(m => {
                                    return (
                                    <div key={m.matchId} className={styles.match}>
                                        <h6>{m.participants[0]} vs {m.participants[1]}.</h6>
                                        <h6>Match ID: {m.matchId}</h6>
                                    </div>)
                            } )
                            : null
                        }
                    </div>
                </div>
            </div>
            {/*///////////// PRIMERA PARTIDA /////////////*/}
            <div className={showFirstMatch || showSecondMatch || showThirdMatch ? styles.game : null}>
                {
                    showFirstMatch ?
                    <Game 
                        tournamentMatchId={actualIdGame} 
                        setShowFirstMatch={setShowFirstMatch}
                        setFinishedFirstMatch={setFinishedFirstMatch}

                        wins={wins}
                        setWins={setWins}
                        
                        finishedFirstMatch={finishedFirstMatch}
                        finishedSecondMatch={finishedSecondMatch}
                        finishedThirdMatch={finishedThirdMatch}
                    /> 
                    : null
                }
            </div>
            
            {/*///////////// SEGUNDA PARTIDA /////////////*/}
            <div className={showFirstMatch || showSecondMatch || showThirdMatch ? styles.game : null}>
                {
                    showSecondMatch ?
                    <div>
                        <Game 
                            tournamentMatchId={actualIdGame}
                            setShowSecondMatch={setShowSecondMatch} 
                            setFinishedSecondMatch={setFinishedSecondMatch}

                            wins={wins}
                            setWins={setWins}

                            finishedFirstMatch={finishedFirstMatch}
                            finishedSecondMatch={finishedSecondMatch}
                            finishedThirdMatch={finishedThirdMatch}
                        /> 
                    </div>
                    : null
                }
            </div>

             {/*///////////// TERCERA PARTIDA /////////////*/}
             <div className={showFirstMatch || showSecondMatch || showThirdMatch ? styles.game : null}>
                {
                    showThirdMatch ? 
                    <div>
                        <Game 
                            tournamentMatchId={actualIdGame} 
                            setShowThirdMatch={setShowThirdMatch}
                            setFinishedThirdMatch={setFinishedThirdMatch}

                            wins={wins}
                            setWins={setWins}

                            finishedFirstMatch={finishedFirstMatch}
                            finishedSecondMatch={finishedSecondMatch}
                            finishedThirdMatch={finishedThirdMatch} 
                        /> 
                    </div>
                    : null
                }
             </div>
            {
            finishedFirstMatch && finishedSecondMatch && finishedThirdMatch 
            ? 
                <div className={styles.endStatsDiv}>
                    <h1>EL TORNEO HA TERMINADO</h1>
                    <h3 className={styles.h3_results}>Resultados:</h3>
                    <div className={styles.generalStats}>
                        {
                            allPlayersWins.length > 0
                            ?
                            <div>
                            {   allPlayersWins.map(w => {
                                    if(w.length > 0){
                                        return(
                                            <div className={styles.stats} key={w[0]}>
                                                <h4>{`${w[0]}:`}</h4>
                                                <h4>{`${w.length} puntos.`}</h4>
                                            </div>
                                        )
                                    }
                                })}
                                <button onClick={leave}>Salir</button>
                            </div> 
                            : null
                        }
                    </div> 
                </div>
            : null}
        </div>
    )
}
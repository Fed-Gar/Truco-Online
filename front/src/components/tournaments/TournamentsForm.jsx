import React from 'react';
import {useDispatch} from 'react-redux'
import { setIsInTournament } from '../../Redux/actions-types/tournamentsActions';

import socket from '../socket';
import styles from './styles/TournamentsForm.module.css'

export default function TournamentsForm(){
    const dispatch = useDispatch()

    const createTournament = async (event) => {
        event.preventDefault();
        let idGenerator = Math.floor(Math.random()*1000000)
        socket.emit('createTournament', ({tournamentId: idGenerator, user: localStorage.user, userId: parseInt(localStorage.id)}))
        dispatch(setIsInTournament({isInTournament: true, tournamentId: idGenerator}))
    }
    
    return(
        <div>
            <div>
                <form onSubmit={createTournament}>
                    <button type='submit' className={styles.btn}>{'Create new tournament'}</button>
                </form>
            </div>
        </div>
    )
}
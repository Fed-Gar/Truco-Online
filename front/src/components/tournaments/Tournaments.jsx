import React from 'react';
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router';

import styles from './styles/Tournaments.module.css'
import NavBar from '../NavBar';
import TournamentsForm from './TournamentsForm';
import TournamentsList from './TournamentsList';
import TournamentInCourse from './TournamentInCourse';

export default function Tournaments() {
    const isinTournament = useSelector(store => store.tournamentsReducer.isInTournament);

    //Agregado por guille, para verificar si el jugador no está baneado.
    const isActive = window.localStorage.getItem("isActive");
    const history = useHistory();

    if (isActive === "baneado" || isActive === "suspendido") {
        history.push('/bannedplayer');
    }
    /*
    useEffect(() => {
      if (isActive === "baneado" || isActive === "suspendido") {
        setTimeout(() => {
          history.push('/bannedplayer');
        }, 2000);
      }
    }, [isActive]);
    */
    // Fin de verificación si el jugador está activo.

    return (
        <div>
            <NavBar />
            <div className={styles.submainDiv}>
                {
                    isinTournament
                        ?
                        <TournamentInCourse />
                    :
                        <div className={styles.formAndList}>

                            <TournamentsForm />
                            <TournamentsList />
                        </div>
                }
            </div>
        </div>
    )
}
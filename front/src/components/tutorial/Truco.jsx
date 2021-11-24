import React from 'react';
import { useState } from 'react';

import styles from './styles/Truco.module.css';

import imgTruco from '../../img/truco.webp';
import logo from '../../img/Logo1.webp'

export default function Truco() {

    const [part, setPart] = useState(1);

    // const touch = part === 3  ? touch : null;
    
    const inicio = 'Como dijimos antes, nosotros tenemos 3 cartas, por lo que para ganar la jugada, debemos ganar 2 de las 3 manos que se disputaran_ Cualquiera de los jugadores puede proponer truco a los rivales y el que gane se llevará dos puntos_ Si los rivales no quieren apostar al truco, el que lo cantó se lleva un punto. Quien recibe la apuesta de truco puede a su vez cantar retruco en cualquier momento,';
    const inicio2 = 'lo que implica, si se acepta, que quien gane el truco se llevará 3 puntos_ Si no se acepta el retruco, quienes lo cantaron ganarán dos puntos_ Una vez apostado este ultimo, la persona que acepto, puede proponer "Quiero vale Cuatro", llevando la cantidad de puntos a 4 para el ganador';
    const [state, setState] = useState({
       text: inicio,
       siguiente: true,
       img: false,
    });
    
    const truco = 'Veamos un caso particular: Cuando hay un empate (mismo valor de cartas) el ganador del Truco se define en la siguiente mano, resultando el ganador de la partida_ En la siguiente imágen, quien pensas que ganará...';

    const Siguiente = () => {
        if(part === 1) {
            setPart(2);
            setState({
                text: inicio2,
                siguiente: true,
                img: false,
            });
        };
        if(part === 2) {
            setPart(3);
            setState({
                text: truco,
                siguiente: false,
                img: imgTruco,
                img1: true,
            });
        }; 
    };
    
    const correct = 'Felicitaciones! has dominado los conceptos básicos del Truco! Ahora empieza a jugar partidas para aumentar tus partidos ganados y subir en el ranking!'
    const correcto = () => {
        setState({
            text: correct,
            siguiente: false,
            img: logo,
            img1: false,
        });
    };

    const handleTouch = () => {

    };
    
    return (
        <div className={styles.board}>
            <div className={styles.title}>{state.text}</div>
            <div className={styles.imgBot} >
                {
                    state.img ? 
                    <img className={styles.truco + ' ' + styles.touch} src={state.img} onClick={handleTouch} alt=''/> 
                    : 
                    null
                } 
                {
                    state.img1  && 
                    <div className={styles.opciones}>
                        <button className={styles.boton} onClick='' >Gana el Jugador A con el 11 de Espada</button>
                        <button className={styles.boton} onClick={correcto} >Gana el Jugador B con el 12 de Oro</button>
                    </div>
                }  
            </div>
            {
                state.siguiente && 
                <div className={styles.botones}>
                    <button className={styles.boton + ' ' + styles.next} onClick={Siguiente}>Siguiente...</button>
                </div>
            }  
        </div>
    );
};
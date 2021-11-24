import React from 'react';
import { useState } from 'react';

import styles from './styles/Envido.module.css';

import imgEnvido from '../../img/envido.png'

export default function Envido() {
    
    const intro = 'Cada jugador puede cantar envido en su primer turno durante la mano, siempre que sea antes de la propuesta del truco ya que una vez abierto el envido el truco queda aplazado hasta resolver el envido. El envido es una apuesta en la que se pone en juego cuál es el jugador que tiene una puntuación más elevada según las siguientes reglas: Se debe tener dos cartas del mismo palo, se suman sus numeros y al resultado se le suman 20 puntos más.'; 
    const intro2 = 'Si no tiene dos cartas del mismo palo se tendrá en cuenta el valor de la carta mayor (en índice numeral). Si tuviera tres cartas del mismo palo solo se sumarán los valores de las dos cartas más altas y le deben sumar 20 puntas más. A estos efectos, el valor de las figuras es cero.';
    
    const cards = [
        {   id: 1,
            img : '/cards/39.webp',
            txt: 'Tres de Oro'},
        {   id: 4,
           img : '/cards/43.webp',
            txt: 'el Siete de Oro'},
        {   id: 3,
           img : '/cards/46.webp',
           txt: 'Todos los 10'},
    ];

    const [state, setState] = useState({
        text : intro,
        cards : [],
        page: 0,
        botones: true,
        respuestas: false,
    });
    
    const siguiente = () => {
        if(state.page === 0) {
            setState({
                ...state,
                page: state.page+1,
                text: intro2,
            });
        };
        if(state.page === 1) {
            setState({
                text : ejemplo,
                page: state.page+1,
                botones:false,
                cards: cards,
                respuestas:true,
                atras:false,
            });
        };
    };

    const correct = 'Excelente respuesta! Al tener 3 cartas iguales, se suman las dos mas altas, en este caso el 7 y el 3, lo que da un Envido de 30 puntos! A continuación te mostramos las apuestas y sus valores en puntos :'

    const correcta = () => {
        setState({
            text : correct,
            page: state.page+1,
            botones:false,
            cards: false,
            respuestas:false,
            img: imgEnvido,
        });
    };

    const incorrect = 'Lamentablemente no es la respuesta correcta! Por favor vuelve atras e intentalo nuevamente.'
    
    const incorrecta = () => {
        setState({
            text : incorrect,
            botones:false,
            cards: false,
            respuestas:false,
            atras: true,
        });
    };

    const ejemplo = 'En este ejemplo tenemos nuestras 3 cartas.¿Cuantos puntos tenemos de Envido?';
    
    return (
        <div className={styles.board}>
            <div className={styles.title}>{state.text}</div>
            <div className={styles.cartas}>
                {
                    state.cards ? 
                    state.cards.map(c => 
                        <img className={styles.card} src={process.env.PUBLIC_URL + c.img} alt={c.txt} ></img>) 
                    : 
                    null
                } 
            </div>
            <div >
                {
                    state.img &&  <img className={styles.envido} src={imgEnvido} alt=''/>   
                } 
            </div>
            {
                state.atras && 
                <div className={styles.botones}>
                    <button className={styles.boton} onClick={siguiente} >Volver a intentarlo!</button>
                </div>
            }
            {   
                state.botones && 
                <div className={styles.botones}>
                    <button className={styles.boton + ' ' + styles.next} onClick={siguiente} >Siguiente</button>
                </div> 
            }
            { 
                state.respuestas &&  
                <div className={styles.botones}>
                    <button className={styles.boton} onClick={incorrecta}> A) 20 Puntos</button>
                    <button className={styles.boton} onClick={incorrecta}> B) 23 Puntos</button>
                    <button className={styles.boton} onClick={incorrecta}> C) 27 Puntos</button>
                    <button className={styles.boton} onClick={correcta}> D) 30 Puntos</button>
                </div>
            }
        </div>
    );
};
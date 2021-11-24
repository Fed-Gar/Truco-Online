import React from 'react';
import { useState } from 'react';

import styles from './styles/Cartas.module.css';

function Cartas() {
      const cards = [
        {   id: 1,
            img : '/cards/25.webp',
            txt: 'el Ancho de Espada'},
        {   id: 2,
            img : '/cards/13.webp',
            txt: 'el Ancho de Basto'},
        {   id: 3,
            img : '/cards/31.webp',
            txt: 'el Siete de Espada'},
        {   id: 4,
            img : '/cards/43.webp',
            txt: 'el Siete de Oro'},
    ];
    
    const [state, setState] = useState(cards);
   
    const cards2 = [
        {   id: 1,
            img : '/cards/39.webp',
            txt: 'Todos los Tres'},
        {   id: 2,
            img : '/cards/38.webp',
            txt: 'Todos los Dos'},
        {   id: 3,
            img : '/cards/37.webp',
            txt: 'Uno Oro y Copa'},
    ];

    const cards3 = [
        {   id: 1,
            img : '/cards/48.webp',
            txt: 'Todos los 12'},
        {   id: 2,
            img : '/cards/47.webp',
            txt: 'Todos los 11'},
        {   id: 3,
            img : '/cards/46.webp',
            txt: 'Todos los 10'},
    ];

    const cards4 = [
        {   id: 1,
            img : '/cards/7.webp',
            txt: 'Siete Copa y Basto'},
        {   id: 2,
            img : '/cards/6.webp',
            txt: 'Todos los Seis'},
        {   id: 3,
            img : '/cards/5.webp',
            txt: 'Todos los Cincos'},
        {   id: 4,
            img : '/cards/4.webp',
            txt: 'Todos los Cuatros'},
    ];

    const mejores = () => {
        setState(cards)
    };  

    const salvan = () => {
        setState(cards2)
    }; 

    const defensa = () => {
        setState(cards3)
    }; 

    const malas = () => {
        setState(cards4)
    }; 
    
    return (
        <div className={styles.board}>
          <div className={styles.title}>
           <p>En el truco se utiliza la baraja española y su valores son diferentes. En cada mano del truco, se repartiran 3 cartas por jugador en cada mano del partido. A continuacion podras ver como es su orden de importancia.</p>
           </div>
           <div className={styles.cartas}>
            {
                state ? state.map(c => 
                    <div className={styles.cardCont} key={c.txt}>
                        <img className={styles.card} src={process.env.PUBLIC_URL + c.img} alt={c.txt} ></img>
                        <p className={styles.epigrafe}>{c.txt}</p>
                    </div>
                    ) 
                   : 
                   null
            } 
           </div>
           <div className={styles.botones}>
             <button className={styles.boton} onClick={mejores} >Las mejores</button>
             <button className={styles.boton} onClick={salvan} >Las que te salvan</button>
             <button className={styles.boton} onClick={defensa} >las defensivas</button>
             <button className={styles.boton} onClick={malas} >las malas</button>
           </div>
        </div>
    );
};

export default Cartas;
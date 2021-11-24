const axios = require("axios");

function getCard(deck) {
    return deck.pop();
}

module.exports = {
    table: {
        //estas son las propiedades que son comunes a todos los juegos
        trucoValue: {truco: 2, retruco: 3, valeCuatro: 4}, //lista valor de trucos
        envidoValue: {envido: 2, realEnvido: 3},  //lista valor envido individual
        players: [],
        turn: 1,
        betsList: {firstTurn: ["truco", "envido1", "realEnvido", "faltaEnvido", "ir al mazo"],
                    otherTurn: ["truco", "ir al mazo"],
                    noTruco: [],
                    firstTurnFlor: ["truco", "envido1", "realEnvido", "faltaEnvido", "ir al mazo", "flor"],
                    flor: ["con flor me achico", "con flor quiero", "contraFlorAlResto", "contraFlor"],
                    contraFlorAlResto: ["con flor me achico", "con flor quiero"],
                    contraFlor: ["con flor me achico", "con flor quiero"],
                    truco: ["no quiero truco", "quiero truco", "retruco",],
                    retruco: ["no quiero retruco", "quiero retruco", "valeCuatro",],
                    valeCuatro: ["no quiero valeCuatro", "quiero valeCuatro"],
                    envido1: ["no quiero envido1", "quiero envido1", "envido2", "realEnvido", "faltaEnvido"],
                    envido2: ["no quiero envido2", "quiero envido2", "realEnvido", "faltaEnvido"],
                    realEnvido: ["no quiero realEnvido", "quiero realEnvido", "faltaEnvido"],
                    faltaEnvido: ["no quiero faltaEnvido", "quiero faltaEnvido"],
    
                    }, //la lista de apuestas posibles la idea es que es un objeto con propiedades de apuestas posibles y un array con cada posible respuesta
        games: {}, //objeto que contiene todas las partidas jugandose, la propiedad es el id de cada Rooom
      },
    buildDeck: () => {
        let deck = [{ id: 1, suit: 'copas', number: 1, truco: 7},
            { id: 2, suit: 'copas', number: 2, truco: 6 },
            { id: 3, suit: 'copas', number: 3, truco: 5},
            { id: 4, suit: 'copas', number: 4, truco: 14 },
            { id: 5, suit: 'copas', number: 5, truco: 13 },
            { id: 6, suit: 'copas', number: 6, truco: 12 },
            { id: 7, suit: 'copas', number: 7, truco: 11},
            { id: 10, suit: 'copas', number: 10, truco: 10 },
            { id: 11, suit: 'copas', number: 11, truco: 9 },
            { id: 12, suit: 'copas', number: 12, truco: 8},
            { id: 13, suit: 'bastos', number: 1, truco: 2},
            { id: 14, suit: 'bastos', number: 2, truco: 6 },
            { id: 15, suit: 'bastos', number: 3, truco: 5},
            { id: 16, suit: 'bastos', number: 4, truco: 14 },
            { id: 17, suit: 'bastos', number: 5, truco: 13 },
            { id: 18, suit: 'bastos', number: 6, truco: 12 },
            { id: 19, suit: 'bastos', number: 7, truco: 11},
            { id: 22, suit: 'bastos', number: 10, truco: 10 },
            { id: 23, suit: 'bastos', number: 11, truco: 9 },
            { id: 24, suit: 'bastos', number: 12, truco: 8 },
            { id: 25, suit: 'espadas', number: 1, truco: 1},
            { id: 26, suit: 'espadas', number: 2, truco: 6,  },
            { id: 27, suit: 'espadas', number: 3, truco: 5},
            { id: 28, suit: 'espadas', number: 4, truco: 14 },
            { id: 29, suit: 'espadas', number: 5, truco: 13 },
            { id: 30, suit: 'espadas', number: 6, truco: 12 },
            { id: 31, suit: 'espadas', number: 7, truco: 3},
            { id: 34, suit: 'espadas', number: 10, truco: 10 },
            { id: 35, suit: 'espadas', number: 11, truco: 9 },
            { id: 36, suit: 'espadas', number: 12, truco: 8 },
            { id: 37, suit: 'oros', number: 1, truco: 7},
            { id: 38, suit: 'oros', number: 2, truco: 6 },
            { id: 39, suit: 'oros', number: 3, truco: 5},
            { id: 40, suit: 'oros', number: 4, truco: 14 },
            { id: 41, suit: 'oros', number: 5, truco: 13 },
            { id: 42, suit: 'oros', number: 6, truco: 12 },
            { id: 43, suit: 'oros', number: 7 , truco: 4},
            { id: 46, suit: 'oros', number: 10, truco: 10 },
            { id: 47, suit: 'oros', number: 11, truco: 9 },
            { id: 48, suit: 'oros', number: 12, truco: 8 }
        ]
    return deck
    },
    shuffleDeck: (deck) => {
        let currentIndex = deck.length;
        let randomIndex;
        while(currentIndex != 0){
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [deck[currentIndex], deck[randomIndex]] = [deck[randomIndex], deck[currentIndex]];
        }
        return deck;
    },
    getHands: (deck) => {
        const playerAhand = [];
        const playerBhand = [];
        playerAhand.push(getCard(deck));
        playerBhand.push(getCard(deck));
        playerAhand.push(getCard(deck));
        playerBhand.push(getCard(deck));
        playerAhand.push(getCard(deck));
        playerBhand.push(getCard(deck));
        return [playerAhand, playerBhand]
    },
    envidoCount: (hand) => {
        let envido1 = new Set();
        hand.forEach(card => {if(card.number < 10)return card;else card.number = 0; return card});
        hand.forEach(card => envido1.add(card.suit));
        console.log(envido1)
        if(envido1.size === 3){
            hand = hand.sort((a, b)=> (a.number > b.number) ? 1 : -1);
            console.log(hand)
            const cardEnvido = hand.pop();
            return cardEnvido.number;
        }
        else if(envido1.size === 2){
            hand.sort((a, b)=> (a.suit > b.suit)? 1: -1);
            console.log(hand);
            if(hand[0].suit === hand[1].suit) return(hand[0].number + hand[1].number + 20);
            else return (hand[1].number + hand[2].number + 20);
        }
        else if(envido1.size === 1){
            hand = hand.sort((a, b)=> (a.number < b.number) ? 1 : -1);
            return (hand[0].number + hand[1].number + 20);
        }
    },
}
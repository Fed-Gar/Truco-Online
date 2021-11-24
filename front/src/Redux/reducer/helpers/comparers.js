function comparerCreator(prop, direction) {
    // Crea funciones comparadoras para valores tipos String,
    // Toma como parámetros el nombre de la propiedad a comparar y "asc" o "desc"
    // Según se desee ordenar ascendente o descentemente.
    // La función resultante se usa como callback en el primer parámetro del método .sort() de un array.
    if (direction === "asc") {
        return function (a, b) {
            if (a[prop] < b[prop]) return -1;
            if (a[prop] > b[prop]) return 1;
            return 0;
        }
    }
    if (direction === "desc") {
        return function (a, b) {
            if (a[prop] > b[prop]) return -1;
            if (a[prop] < b[prop]) return 1;
            return 0;
        }
    }
}

function numComparerCreator(prop, direction) {
    // Crea funciones comparadoras para valores tipo Number,
    // Toma como parámetros el nombre de la propiedad a comparar y "asc" o "desc"
    // Según se desee ordenar ascendente o descentemente.
    // La función resultante se usa como callback en el primer parámetro del método .sort() de un array.
    if (direction === "asc") {
        return function (a, b) {
            if (Number(a[prop]) < Number(b[prop])) return -1;
            if (Number(a[prop]) > Number(b[prop])) return 1;
            return 0;
        }
    }
    if (direction === "desc") {
        return function (a, b) {
            if (Number(a[prop]) > Number(b[prop])) return -1;
            if (Number(a[prop]) < Number(b[prop])) return 1;
            return 0;
        }
    }
}

var byPlayedAsc = numComparerCreator("gamesPlayed", "asc");

var byPlayedDesc = numComparerCreator("gamesPlayed", "desc");

var byWonAsc = numComparerCreator("gamesWon", "asc");

var byWonDesc = numComparerCreator("gamesWon", "desc");

var byLostAsc = numComparerCreator("gamesLost", "asc");

var byLostDesc = numComparerCreator("gamesLost", "desc");

var byUserSinceAsc = comparerCreator("createdAt", "asc");

var byUserSinceDesc = comparerCreator("createdAt", "desc");

const comparers = {
    byPlayedAsc, byPlayedDesc, byWonAsc, byWonDesc,
    byLostAsc, byLostDesc, byUserSinceAsc, byUserSinceDesc
}

export default comparers;
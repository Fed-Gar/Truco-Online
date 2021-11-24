// arr debería ser tableStatus.DisplayedUsers.

export default function getForPage(arr = [], pageToShow, resultsPerPage) {
  // Dado un Array de usuarios, la página a mostrar y la cantidad de usuarios por página, define
  // el total de páginas y los índices del array que deben mostrarse en la página actual.
  // Devuelve: array con elementos para mostrar en la página solicitada.
  // Implementado para usar en el componente AdminPanel.
  if (arr.length === 0) { return [] };
  if (arr.length > (pageToShow * resultsPerPage)) {
    var displayedInPage = arr.slice((pageToShow * resultsPerPage - (resultsPerPage)), (pageToShow * resultsPerPage));
  } else {
    // eslint-disable-next-line no-redeclare
    var displayedInPage = arr.slice(pageToShow * resultsPerPage - (resultsPerPage));
  }

  return displayedInPage;

}

//Test
/*
var arr1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

console.log(getForPage(arr1, 2, 5)); // debería devolver [6, 7, 8, 9, 10]
console.log(getForPage(arr1, 4, 5)); // debería devolver [16, 17, 18]
*/


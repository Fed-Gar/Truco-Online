function createPaginator(currentPage, pagesArr) {
  // Crea un paginador según el array de páginas ingresados y la página actual.
  // Devuelve un objeto con valores true o false para botones para ir a las páginas:
  // primera y anterior (si no estamos en la página 1) y siguiente y última (si no estamos en 
  // la última página). También devuelve la página actual en el objeto.

  var first = true;
  var previous = true;
  var next = true;
  var last = true;
  if (currentPage === pagesArr[0]) {
    first = false;
    previous = false;
  }
  if (currentPage === pagesArr[pagesArr.length - 1]) {
    next = false;
    last = false;
  }
  return {
    first,
    previous,
    currentPage,
    next,
    last
  }
}
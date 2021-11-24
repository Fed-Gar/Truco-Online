export default function arrCreator(pagesNumber) {
  // Función creadora de array con números de página.
  // Toma como argumentto un número n, devuelve un array con números,
  // desde 1 hasta n.
  if (pagesNumber < 0) return []
  var arr = [];
  for (let i = 0; i < pagesNumber; i++) {
    arr.push(i + 1);
  }
  return arr;
}
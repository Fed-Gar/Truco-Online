// En este archivo se hacen las importaciones de todos los actions types
// Definir el nomnre de los archivos como: nombre/funcion + Actions

import signUpActions from "./signUpActions";
import logActions from "./logActions";
import profileActions from "./profileActions";
import adminPanelActions from "./adminPanelActions";
import editProfileActions from "./editProfileActions";

const allActions = {
  signUpActions,
  logActions,
  profileActions,
  adminPanelActions,
  editProfileActions,
};

export default allActions;
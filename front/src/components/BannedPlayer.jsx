import styles from "./styles/BannedPlayer.module.css";
import log from '../Redux/actions-types/logActions';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';


export default function BannedPlayer() {

  const { logOut } = log;
  const dispatch = useDispatch();
  const history = useHistory();

  const logout = () => {
    dispatch(logOut());
    history.push("/");
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.advice}>
        <div>
          <h2> Esta cuenta ha sido suspendida temporalmente </h2>
          <br />
          <p>Esto ha ocurrido debido a que has presentado mal comportamiento
            durante las partidas (por ejemplo, has hecho comentarios inapropiados en
            el chat o has insultado a otros jugadores).</p>
          <p>Aún puedes jugar como jugador invitado. No tendrás acceso a tu perfil
            ni se registarán los resultados de las partidas que juegues. Para
            ello, debes cerrar sesión haciendo click en el botón "Cerrar Sesión" que
            figura aquí abajo, y luego elegir "Entrar como invitado" en la página de
            inicio.</p>
          <p>Te recordamos que debes mantener el respeto a otros jugadores en todo
            momento.</p>
          <p>Para mayor información, escribir a&nbsp;
            <a href="mailto:consultas@trucohenry.com">consultas@trucohenry.com.</a>
          </p>
        </div>
        <div>
          <br />
          <button className={styles.logoutBtn} onClick={logout}>Cerrar sesión</button>
        </div>
      </div>
    </div >
  )
}
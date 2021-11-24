import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import adminPanelActions from '../Redux/actions-types/adminPanelActions';
import styles from './styles/FilaDeTabla.module.css'
import { createSemanticDiagnosticsBuilderProgram } from "typescript";

// import styles from "./styles/FilaDeTabla.module.css"
import profileIcon from '../img/profileIcon.png';

export default function FilaDeTabla({ username, id, email, gamesPlayed, gamesWon, gamesLost,
    createdAt, reportedUser, status }) {

    /*
function banUser() {
    fetch(
        `http://localhost:3001/api/user/banuser?userId=${id}`,
        {
            method: "PUT",
            headers: {
                "x-access-token": localStorage.token,
                'Content-Type': 'application/json'
            }
        })
        .then(
            r => {
                console.log(r)
                //dispatch(getUsers({ token: localStorage.token }))
            }
        )
}*/
    const dispatch = useDispatch();
    const { banUser } = adminPanelActions;
    const { suspendUser } = adminPanelActions;
    const { activateUser } = adminPanelActions;


    return (
        <tr>
            <td><img src={profileIcon} alt="Imagen de bandera" height="20"></img></td>
            <td>{id}</td>
            <td>
                {username ? <p>{username}</p> : <p>{username}</p>}
            </td>
            <td>{email}</td>
            <td>{gamesPlayed}</td>
            <td>{gamesWon}</td>
            <td>{gamesLost}</td>
            <td>{createdAt.split("T")[0]}</td>
            <td>{status}</td>
            <td width="170">
                <div className="buttonContainer">
                    {
                        status === "activo" ?
                            (<div><button onClick={() => dispatch(suspendUser(id))}>Suspender</button> <button onClick={() => dispatch(banUser(id, localStorage.token))}>Banear</button></div>) :
                            <button onClick={() => dispatch(activateUser(id))}>Re-activar</button>
                    }
                </div>

            </td>
            <td>
                {
                    reportedUser.length > 0 ?
                        reportedUser.map(r => <button className={styles.reportButton}> ! </button>) :
                        ""
                }
            </td>



        </tr>
    )

}


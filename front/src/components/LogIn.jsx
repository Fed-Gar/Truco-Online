import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../hooks/useModal';

import HomeButton from './HomeButton';
import Modal from "./Modal";

import log from '../Redux/actions-types/logActions';

import styles from './styles/LogIn.module.css';

const EMAIL = /^[^@]+@[^@]+\.[^@]+$/;

function validate(state) {
  let errors = {};
  if (!state.emailInput) {
    errors.emailInput = 'Ingresa tu email...';
  } else if (!EMAIL.test(state.emailInput)) {
    errors.emailInput = 'El email es inválido...';
  };
  if (!state.passwordInput) {
    errors.passwordInput = 'Contraseña inválida...';
  }
  return errors;
};

const initialState = {
  emailInput: '',
  passwordInput: '',
};

export default function LogIn() {

  const dispatch = useDispatch();

  const history = useHistory();

  const { message } = useSelector(state => state.logReducer);

  const { logIn } = log;

  const logged = window.localStorage.getItem("isAuth");
  const active = window.localStorage.getItem("status")

  const [isAuth, setIsAuth] = useState(false);
  const [isActive, setIsActive] = useState("");
  const [state, setState] = useState(initialState);
  const [errors, setErrors] = useState(initialState);

  const [isOpenModal, openModal, closeModal] = useModal();

  function handleChange(event) {
    const { name, value } = event.target;
    setErrors(validate({
      ...state,
      [name]: value
    }));
    setState({
      ...state,
      [name]: value,
    });
  };

  function handleSubmit(event) {
    event.preventDefault();
    openModal();
    dispatch(logIn(state));
    setState(initialState);
    setErrors(initialState);
  };

  useEffect(() => {
    if (logged) {
      setIsAuth(logged);
      setIsActive(active);
    };
  }, [logged]);

  useEffect(() => {
    if (isAuth) {
      console.log(isActive)
      if (isActive !== "baneado" && isActive !== "suspendido") {
        console.log("Entro acá1");
        setTimeout(() => {
          history.push('/rooms');
        }, 3000);
      } else {
        console.log("Entro acá2");
        setTimeout(() => {
          history.push('/bannedPlayer');
        }, 3000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuth]);

  return (
    <>
      <HomeButton />
      <section className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label} htmlFor="emailInput" > Email: </label>
          <input
            type="text"
            id="emailInput"
            name="emailInput"
            value={state.emailInput}
            placeholder="Ingresa tu email"
            autoComplete="off"
            className={styles.input}
            onChange={handleChange}
          />
          {errors.emailInput && (<p className={styles.danger}> {errors.emailInput} </p>)}
          <label className={styles.label} htmlFor="passwordInput"> Contraseña: </label>
          <input
            type='password'
            id='passwordInput'
            name="passwordInput"
            value={state.passwordInput}
            placeholder="Ingresa tu contraseña"
            autoComplete="off"
            className={styles.input}
            onChange={handleChange}
          />
          {errors.passwordInput && (<p className={styles.danger}> {errors.passwordInput} </p>)}
          {((!errors.emailInput && !errors.passwordInput)
            &&
            (errors.emailInput !== '' && errors.passwordInput !== ''))
            ?
            (<button type="submit" className={styles.button}>Entrar</button>)
            :
            <button type="submit" className={styles.disabled} disabled>Entrar</button>}
        </form>
      </section>
      <Modal isOpen={isOpenModal} closeModal={closeModal}>
        <h3>Status:</h3>
        <p>{message}</p>
        {
          isAuth ?
            <p>Redireccionando...</p>
            :
            null
        }
      </Modal>
    </>
  );
};

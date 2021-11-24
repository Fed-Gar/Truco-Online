/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router';
import { useModal } from '../hooks/useModal';

import HomeButton from './HomeButton';
import Modal from "./Modal";

import signUpActions from '../Redux/actions-types/signUpActions';

import styles from './styles/SignUp.module.css';
import profileIcon from '../img/profileIcon.png';

const ALPHA = /^[a-zA-Z\s]+$/;
const EMAIL = /^[^@]+@[^@]+\.[^@]+$/;

function validate(state) {
  let errors = {};
  if(!state.username) {
    errors.username = 'Ingresa tu nombre de usuario...';
  } else if (state.username.length < 4) {
      errors.username = 'Nombre inválido. Debe contener más de 3 caracteres...';
  } else if(!ALPHA.test(state.username)) {
      errors.username = 'Solo se aceptan letras...'
  };
  if(!state.email) {
    errors.email = 'Ingresa tu email...';
  } else if(!EMAIL.test(state.email)) {
      errors.email = 'El email es inválido...';
  };
  if(!state.password) {
    errors.password = 'Ingresa un contraseña...';
  } else if (state.password.length < 4) {
      errors.password = 'Contraseña inválida. Debe contener más de 3 caracteres...';
  };
  return errors;
};

const initialState = {
    username: '',
    email: '',
    password: '',
    profile_image: '',
    image: profileIcon,
};

export default function SignUp() {
    const logged = window.localStorage.getItem("isAuth");

    const history = useHistory();

    const { registered, message } = useSelector(state => state.signUpReducer);
    
    const dispatch = useDispatch();

    const [state, setState] = useState(initialState);
    
    const [errors, setErrors] = useState(initialState);

    const [isOpenModal, openModal, closeModal] = useModal();

    const handleFileChange = (e) => {
        //Funcion para subir una imagen
        const file = e.target.files[0]
        previewFile(file)
    }

    const previewFile = (file) => {
        const reader = new FileReader()
        //Convierte la imagen en url
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setState({
                ...state,
                profile_image: reader.result
            })
            // console.log(state.profile_image)
        }
    }

    const removeImage = () => {
        setState({
            ...state,
            profile_image: '',
        })
    }


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
        dispatch(signUpActions.signUpActions(state));
        openModal();
        setState(initialState);
        setErrors(initialState);
    };

    useEffect(() => {
        // para saber si el usuario se registro con exito
        if(logged) {
            setTimeout(() => {
                history.push('rooms');
            }, 0);
        };
        if(registered) {
            setTimeout(() => {
                history.push('log-in');
            }, 3000);
        };
    }, [registered]);


    return (
        <>
            <HomeButton />
            <section className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.label} htmlFor="username" > Usuario: </label>
                <input
                    type="text"
                    id="username"
                    name = "username"
                    value={state.username}
                    placeholder="Nombre de usuario"
                    autoComplete="off"
                    className={styles.input}
                    onChange={handleChange}
                />
                {errors.username && (<p className={styles.danger}> {errors.username} </p>)}
                <label className={styles.label} htmlFor="email"> Email: </label>
                <input 
                    type="email"
                    id='email'
                    name="email"
                    value={state.email}
                    placeholder="Email a registrar"
                    autoComplete="off"
                    className={styles.input}
                    onChange={handleChange}
                />
                {errors.email && (<p className={styles.danger}> {errors.email} </p>)}
                <label className={styles.label} htmlFor="password"> Contraseña: </label>
                <input 
                    type='password'
                    id='password'
                    name="password"
                    value={state.password}
                    placeholder="Contraseña de la cuenta"
                    autoComplete="off"
                    className={styles.input}
                    onChange={handleChange}
                />
                {errors.password && (<p className={styles.danger}> {errors.password} </p>)}

                {/* Input para subir una imagen */}
                <label for="file" className={styles.uploadFileBtn}>Imagen de perfil</label>
                <input 
                    id="file"
                    type="file"     
                    name="image"
                    onChange={handleFileChange} 
                />
                {state.profile_image ? <p className={styles.deleteImg} onClick={removeImage}>Eliminar Imagen</p> : <p className={styles.uploadImgMsg}>Carga Una foto de perfil!</p>}


                {((!errors.username && !errors.email && !errors.password) 
                    && 
                    (errors.username !== '' && errors.email !== '' && errors.password !== '')) 
                    ? 
                    (<button type="submit" className={styles.button}> Crear Usuario </button>) 
                    : 
                    <button type="submit" className={styles.disabled} disabled> Crear Usuario </button>}
                </form> 
            </section>
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
              <h3>Status:</h3>
              <p>{message}</p>
              {
                registered ? 
                <p>Redireccionando...</p>
                :
                null
              }
            </Modal> 
        </>
    );
};
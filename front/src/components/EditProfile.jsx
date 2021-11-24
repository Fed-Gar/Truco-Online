/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from 'react-router';
import { useModal } from '../hooks/useModal';

import editProfileActions from '../Redux/actions-types/editProfileActions';

import Modal from "./Modal";
import Avatars from './Avatars';
import Loading from './Loading';

import styles from './styles/EditProfile.module.css';

const ALPHA = /^[a-zA-Z\s]+$/;
const EMAIL = /^[^@]+@[^@]+\.[^@]+$/;

function validate(newData) {
  let errors = {};
  if(newData.username.length > 0 && newData.username.length < 4) {
      errors.username = 'Nombre inválido. Debe contener más de 3 caracteres...';
  } else if(newData.username.length > 0 && !ALPHA.test(newData.username)) {
      errors.username = 'Solo se aceptan letras...';
  };
  if(newData.email.length > 0 && !EMAIL.test(newData.email)) {
      errors.email = 'El email es inválido...';
  };
  if(newData.password.length > 0 && newData.password.length < 4) {
      errors.password = 'Contraseña inválida. Debe contener más de 3 caracteres...';
    } ;
  return errors;
};

function doPackage(oldData, newData, img) {
    const data = {};
    newData.username.length === 0 ? data.username = oldData.username : data.username = newData.username;
    newData.email.length === 0 ? data.email = oldData.email : data.email = newData.email;
    newData.password.length === 0 ? data.password = oldData.password : data.password = newData.password;
    img ? data.image = img : data.image = oldData.image;
    return data;
};

const initialState = {
    username: '',
    email: '',
    password: '',
    image: null,
};

export default function EditProfile() {

    const history = useHistory();

    const { getEditProfile, putEditProfile, clearData } = editProfileActions;

    const editProfileReducer = useSelector(state => state.editProfileReducer);
    
    const dispatch = useDispatch();

    const [newData, setNewData] = useState(initialState);
    const [oldData, setOldData] = useState(initialState);

    //Aca se debe almacenar la nueva imagen ingresada por el usuario
    const [img, setImg] = useState(null);

    const [errors, setErrors] = useState(initialState);

    const [isOpenModal, openModal, closeModal] = useModal();

    //Funcion para manejar el cambio de imagen
    const handleFileChange = (e) => {
        //Funcion para subir una imagen
        const file = e.target.files[0]
        previewFile(file)
    }
    //La funcion handleFileChange llama a esta apra convertir la imagen a url
    const previewFile = (file) => {
        const reader = new FileReader()
        //Convierte la imagen en url
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            setImg(reader.result)
            console.log(img)
        }
    }

    //Trae primeramente los datos del usuario
    useEffect(() => {
        //informacion del usuario
        dispatch(getEditProfile({token: localStorage.token}));
    }, []);

    useEffect(() => {
        setOldData({
            username: editProfileReducer.username,
            email: editProfileReducer.email,
            password: editProfileReducer.password,
            image: editProfileReducer.img,
        });
        if(editProfileReducer.status) {
            openModal();
            dispatch(clearData());
            setNewData(initialState);
            setErrors(initialState);
            setTimeout(() => {
                history.push("/profile");
            }, 5000);
        } else if(editProfileReducer.status === false) {
            openModal();
        }
    }, [editProfileReducer]);

    function handleChange(event) {
        const { name, value } = event.target;
        setErrors(validate({
          ...newData,
          [name]: value,
        }));
        setNewData({
          ...newData,
          [name]: value,
        });
    };

    function handleSubmit(event) {
        event.preventDefault();
        dispatch(putEditProfile(doPackage(oldData, newData, img), localStorage.token));
    };

    return (
        <>
            <section className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    {
                        editProfileReducer.response ? 
                        <>
                            <h3> Edita el campo que quieras cambiar* </h3>
                            <label className={styles.label} htmlFor="username" > Usuario: </label>
                            <p className={styles.old}>{oldData.username}</p>
                            <input
                                type="text"
                                id="username"
                                name = "username"
                                value={newData.username}
                                placeholder="Nuevo nombre de usurario"
                                autoComplete="off"
                                className={styles.input}
                                onChange={handleChange}
                            />
                            {errors.username && (<p className={styles.danger}> {errors.username} </p>)}
                            <label className={styles.label} htmlFor="email"> Email: </label>
                            <p className={styles.old}>{oldData.email}</p>
                            <input 
                                type="email"
                                id='email'
                                name="email"
                                value={newData.email}
                                placeholder="Nuevo email"
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
                                value={newData.password}
                                placeholder="Nueva contraseña"
                                autoComplete="off"
                                className={styles.input}
                                onChange={handleChange}
                            />
                            {errors.password && (<p className={styles.danger}> {errors.password} </p>)}
                            {/* <Avatars set={setImg}/> */}
                            <label className={styles.labelFile} htmlFor="image"> Subir Imagen: </label>
                            <input 
                                type='file'
                                id='image'
                                name="image"
                                accept="image/png, image/jpeg"
                                value={""}
                                className={styles.inputFile}
                                onChange={handleFileChange}
                            />
                            <div className={styles.buttons}>
                                {
                                    ((!errors.username && !errors.email && !errors.password) 
                                    && 
                                    (errors.username !== '' && errors.email !== '' && errors.password !== '')) 
                                    ? 
                                    (<button type="submit" className={styles.button}> Guardar </button>) 
                                    : 
                                    <button type="submit" className={styles.disabled} disabled> Guardar </button>
                                }
                                <button className={styles.button} onClick={() => history.push('profile')}> Cancelar </button>
                            </div>
                        </>
                        :
                        <Loading />
                    }
                </form> 
            </section>
            <Modal isOpen={isOpenModal} closeModal={closeModal}>
              <h3>Status:</h3>
              <p>{editProfileReducer.msg}</p>
              {
                editProfileReducer.status ? 
                <p>Redireccionando...</p>
                :
                null
              }
            </Modal> 
        </>
    );
};
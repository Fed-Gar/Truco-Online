import NavBar from './NavBar';

import style from './styles/ErrorPage.module.css';

export default function ErrorPage() {
    return (
        <>
            <NavBar />
            <section className={style.contError}>
                <div className={style.error}>
                    <h2> Error 404: Not Found </h2>
                    <p> This page doesn't exist... </p>
                </div>
            </section>
        </>
    );
};
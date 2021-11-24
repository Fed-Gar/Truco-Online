import styles from './styles/Loading.module.css';
import { VscLoading } from "react-icons/vsc";

export default function Loading() {
    return (
        <>
            <VscLoading className={styles.load} />
        </>
    );
};
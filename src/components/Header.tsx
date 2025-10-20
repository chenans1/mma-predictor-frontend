import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
    return (
     <header className = {styles.header}>
        <div className={styles.brand}>UFC Fight AI Predictor</div>
        <nav className={styles.nav}>
            <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                }
            >
            Upcoming Fights
            </NavLink>
        </nav>
     </header>
    );
}
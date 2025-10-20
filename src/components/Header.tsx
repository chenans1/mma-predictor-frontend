import { NavLink } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
    return (
     <header className = {styles.header}>
        <div className={styles.brand}>UFC Fight AI Predictor</div>
        <nav className={styles.nav}>
            <NavLink to="/"
                end
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Upcoming Predictions
            </NavLink>
            
            <NavLink to="/past" 
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Past Predictions
            </NavLink>
            
            <NavLink to="/model"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link}>
            Model
            </NavLink>

            <NavLink to="/About"
                className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link}>
            About
            </NavLink>
        </nav>
     </header>
    );
}
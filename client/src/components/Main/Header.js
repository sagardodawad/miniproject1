import React from 'react';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';

const Header = () => {
 
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };
  return (
    <>
    <div className={styles.main_container} >
      <nav className={styles.navbar}>  
      <div className={styles.navbar_container}>
        <Link to="/home">Home</Link>
        {/* <Link to="/reports">Reports</Link> */}
        {/* <Link to="/calculate">CO2 emission</Link> */}
        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact Us</Link>   
      </div>
        
        <button className={styles.white_btn} onClick={handleLogout}>
          Logout
        </button>
      </nav>
    
    </div>
    </>
  );
};

export default Header;
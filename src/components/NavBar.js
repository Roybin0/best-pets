import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";

const NavBar = () => {
    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container>
                <NavLink to='/'>
                    <Navbar.Brand href="#home">
                        <img src={logo} alt="logo" className={styles.Img} />
                    </Navbar.Brand>
                </NavLink>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto text-left">
                        <NavLink
                            exact
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/'
                        >
                            <i className="fas fa-house"></i> Home
                        </NavLink>
                        <NavLink
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/'
                        >
                            <i className="fas fa-user"></i> Owners
                        </NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/'><i className="fas fa-paw"></i> Pets</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/'><i className="fas fa-image"></i> Pics</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/'><i className="fas fa-book"></i> Tales</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/'>Profile</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/'><i className="fas fa-sign-out-alt"></i> Sign Out</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/signin'><i className="fas fa-sign-in-alt"></i> Sign In</NavLink>
                        <NavLink className={styles.NavLink} activeClassName={styles.Active} to='/signup'><i className="fas fa-plus"></i> Sign Up</NavLink>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar
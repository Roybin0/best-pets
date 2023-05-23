import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const NavBar = () => {

    const currentUser = useCurrentUser();

    const addContentIcon = (
        <NavLink
            className={styles.NavLink}
            activeClassName={styles.Active}
            to='/add-content'
        >
            <i className="fas fa-plus"></i> Add Content
        </NavLink>
    )

    const loggedOutIcons = (
        <>
            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to='/signin'
            >
                <i className="fas fa-sign-in-alt"></i> Sign In
            </NavLink>

            <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active} to='/signup'
            >
                <i className="fas fa-plus"></i> Sign Up
            </NavLink>
        </>
    )

    const loggedInIcons = (
        <>
            <NavDropdown title="Avatar" id="basic-nav-dropdown">
                <NavLink
                    className={styles.NavLink}
                    activeClassName={styles.Active}
                    to='/'
                >
                    <i className="far fa-face-awesome"></i> My Profile
                </NavLink>
                <NavDropdown.Divider />
                <NavLink
                    className={styles.NavLink}
                    to='/'
                >
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                </NavLink>
            </NavDropdown>
        </>
    )

    const myFeedIcon = (
        <NavLink
                className={styles.NavLink}
                activeClassName={styles.Active}
                to='/liked'
            >
                <i className="fas fa-rss"></i> My Feed
            </NavLink>
    )

    return (
        <Navbar className={styles.NavBar} expand="md" fixed="top">
            <Container>
                <NavLink to='/'>
                    <Navbar.Brand href="#home">
                        <img src={logo} alt="logo" className={styles.Img} />
                    </Navbar.Brand>
                </NavLink>
                {currentUser && addContentIcon}
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
                        {currentUser && myFeedIcon}
                        <NavLink
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/'
                        >
                            <i className="fas fa-user"></i> Owners
                        </NavLink>
                        <NavLink
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/'
                        >
                            <i className="fas fa-paw"></i> Pets
                        </NavLink>
                        <NavLink
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/'
                        >
                            <i className="fas fa-image"></i> Pics
                        </NavLink>
                        <NavLink
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/'
                        >
                            <i className="fas fa-book"></i> Tales
                        </NavLink>
                        {currentUser ? loggedInIcons : loggedOutIcons}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar
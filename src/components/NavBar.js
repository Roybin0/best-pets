import React, { useRef } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import { removeTokenTimestamp } from "../utils/utils";

const NavBar = () => {

    const currentUser = useCurrentUser();
    const setCurrentUser = useSetCurrentUser();

    const avatarDropdownRef = useRef(null);
    const { expanded, setExpanded, ref } = useClickOutsideToggle([avatarDropdownRef]);

    const handleSignOut = async () => {
        try {
            await axios.post("dj-rest-auth/logout/");
            setCurrentUser(null);
            removeTokenTimestamp();
        } catch (err) {
            // console.log(err);
        }
    };

    const addContentIcon = (

        <NavDropdown
            title="New"
            id="content-dropdown"
            className={styles.DropdownContainer}
        >
            <NavDropdown.Item
                className={`${styles.NavLink} ${styles.DropdownLink}`}
                as={NavLink}
                to="/pets/new"
            >
                <i className="fas fa-plus"></i> Add a Pet
            </NavDropdown.Item>
            <NavDropdown.Item
                className={`${styles.NavLink} ${styles.DropdownLink}`}
                as={NavLink}
                to="/pics/new"
            >
                <i className="fas fa-plus"></i> Add a Pic
            </NavDropdown.Item>
            <NavDropdown.Item
                className={`${styles.NavLink} ${styles.DropdownLink}`}
                as={NavLink}
                to="/tales/new"
            >
                <i className="fas fa-plus"></i> Add a Tale
            </NavDropdown.Item>
        </NavDropdown>

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
                activeClassName={styles.Active}
                to='/signup'
            >
                <i className="fas fa-plus"></i> Sign Up
            </NavLink>
        </>
    )

    const loggedInIcons = (
        <>
            <NavDropdown
                title={<Avatar src={currentUser?.profile_image} height={40} />}
                id="profile-dropdown"
                ref={avatarDropdownRef}
                className={styles.DropdownContainer}
            >
                <NavDropdown.Item
                    className={`${styles.NavLink} ${styles.DropdownLink}`}
                    as={NavLink}
                    to={`/owners/${currentUser?.owner_id}`}
                >
                    <i className="fas fa-user"></i> My Profile
                </NavDropdown.Item>
                <NavDropdown.Item
                    className={`${styles.NavLink} ${styles.DropdownLink}`}
                    as={NavLink}
                    to="/"
                    onClick={handleSignOut}
                >
                    <i className="fas fa-sign-out-alt"></i> Sign Out
                </NavDropdown.Item>
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
        <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
            <Container>
                <NavLink to='/'>
                    <Navbar.Brand>
                        <img src={logo} alt="logo" className={styles.Img} />
                    </Navbar.Brand>
                </NavLink>
                {currentUser && addContentIcon}
                <Navbar.Toggle
                    className={styles.Hamburger}
                    ref={ref}
                    onClick={() => setExpanded(!expanded)}
                    aria-controls="basic-navbar-nav"

                />
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
                            to='/pets'
                        >
                            <i className="fas fa-paw"></i> Pets
                        </NavLink>
                        <NavLink
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/pics'
                        >
                            <i className="fas fa-image"></i> Pics
                        </NavLink>
                        <NavLink
                            className={styles.NavLink}
                            activeClassName={styles.Active}
                            to='/tales'
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
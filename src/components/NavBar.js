import React from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";

const NavBar = () => {
    return (
        <Navbar className={styles.NavBar} expand="lg" fixed="top">
            <Container>
                <Navbar.Brand href="#home">
                    <img src={logo} alt="logo" className={styles.Img} />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto text-left">
                        <Nav.Link><i className="fas fa-house"></i> Home</Nav.Link>
                        <Nav.Link><i className="fas fa-user"></i> Owners</Nav.Link>
                        <Nav.Link><i className="fas fa-paw"></i> Pets</Nav.Link>
                        <Nav.Link><i className="fas fa-image"></i> Pics</Nav.Link>
                        <Nav.Link><i className="fas fa-book"></i> Tales</Nav.Link> 
                        <Nav.Link>Profile</Nav.Link>
                        <Nav.Link><i className="fas fa-sign-out-alt"></i> Sign Out</Nav.Link>
                        <Nav.Link><i className="fas fa-sign-in-alt"></i> Sign In</Nav.Link>
                        <Nav.Link><i className="fas fa-plus"></i> Sign Up</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default NavBar
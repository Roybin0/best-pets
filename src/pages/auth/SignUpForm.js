import React from "react";
import { Link } from "react-router-dom";

import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import dog from "../../assets/dog-on-yellow-background.jpeg";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import axios from "axios";

const SignUpForm = () => {
    return (
        <Row className={styles.Row}>
            <Col
                md={6}
                className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}
            >
                <Image
                    className={`${appStyles.FillerImage}`}
                    src={dog}
                />
            </Col>
            <Col className="my-auto py-2 p-md-2" md={6}>
                <Container className={`${appStyles.Content} p-4 `}>
                    <h1 className={styles.Header}>sign up</h1>

                    <Form>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label className="d-none">Username</Form.Label>
                            <Form.Control 
                                className={styles.Input}
                                type="text" 
                                placeholder="Enter a username" 
                                name="username"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password1">
                            <Form.Label className="d-none">Password</Form.Label>
                            <Form.Control 
                                className={styles.Input}
                                type="password" 
                                placeholder="Password" 
                                name="password1"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="password2">
                            <Form.Label className="d-none">Confirm password</Form.Label>
                            <Form.Control 
                                className={styles.Input}
                                type="password" 
                                placeholder="Confirm password" 
                                name="password2" 
                            />
                        </Form.Group>

                        <Button className={`${btnStyles.Button} ${btnStyles.Wide}`} type="submit">
                            Sign up
                        </Button>
                    </Form>

                </Container>
                <Container className={`mt-3 ${appStyles.Content}`}>
                    <Link className={styles.Link} to="/signin">
                        Already have an account? <span>Sign in</span>
                    </Link>
                </Container>
            </Col>
        </Row>
    );
};

export default SignUpForm;
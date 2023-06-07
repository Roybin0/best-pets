import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { Link } from "react-router-dom";
import appStyles from "../App.module.css";
import styles from "../styles/Footer.module.css";

const Footer = () => {
  return (
    <>
      <Row className="pt-3">
        <Col >
          <Container className={`${appStyles.TextCenter}`}>
            <Link className={styles.NavLink} exact="true" to="/">
              Home
            </Link>
            <Link className={styles.NavLink} exact="true" to="/pets">
              Pets
            </Link>
            <Link className={styles.NavLink} exact="true" to="/pics">
              Pics
            </Link>
            <Link className={styles.NavLink} exact="true" to="/tales">
              Tales
            </Link>
          </Container>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className={appStyles.TextCenter}>
            <p>
              &copy; 2023 Best Pets | All Rights Reserved <br />
              Designed by Roybin
            </p>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Footer;

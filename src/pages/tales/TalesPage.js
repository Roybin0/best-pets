import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Tale from "./Tale";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import styles from "../../styles/TalesPage.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/noresultsfound.jpeg";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
// import PopularProfiles from "../profiles/PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function TalesPage({ message, filter = "" }) {
  const [tales, setTales] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchTales = async () => {
      try {
        const { data } = await axiosReq.get(`/pettales/?${filter}search=${query}`);
        setTales(data);
        setHasLoaded(true);
      } catch (err) {
        console.log(err);
      }
    };

    setHasLoaded(false);

    const timer = setTimeout(() => {
        fetchTales();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* <PopularProfiles mobile /> */}

        <i className={`fas fa-search ${styles.SearchIcon}`} />
        <Form 
            className={styles.SearchBar}
            onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search tales" 
          />

        </Form>

        {hasLoaded ? (
          <>
            {tales.results.length ? (
              <InfiniteScroll
                children={
                  tales.results.map((tale) => (
                    <Tale key={tale.id} {...tale} setTales={setTales} />
                  ))
                }

                dataLength={tales.results.length}
                loader={<Asset spinner />}
                hasMore={!!tales.next}
                next={() => fetchMoreData(tales, setTales)}
              />
  
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message={message} />
              </Container>
            )}
          </>
        ) : (
          <Container className={appStyles.Content}>
            <Asset spinner />
          </Container> 
        )}
      </Col>
      <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* <PopularProfiles /> */}
      </Col>
    </Row>
  );
}

export default TalesPage;
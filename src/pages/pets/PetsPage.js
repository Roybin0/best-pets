import React, { useEffect, useState } from "react";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";

import Pet from "./Pet";
import Asset from "../../components/Asset";

import appStyles from "../../App.module.css";
import { useLocation } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import NoResults from "../../assets/noresults.png";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import PopularOwners from "../owners/PopularOwners";
import PopularPets from "./PopularPets";
import { useCurrentUser } from "../../contexts/CurrentUserContext";


function PetsPage({ filter = "" }) {
  const [pets, setPets] = useState({ results: [] });
  const [hasLoaded, setHasLoaded] = useState(false);
  const { pathname } = useLocation();

  const [query, setQuery] = useState("");
  const currentUser = useCurrentUser(); 

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const { data } = await axiosReq.get(`/pets/?${filter}search=${query}`);
        setPets(data);
        setHasLoaded(true);
      } catch (err) {
        // console.log(err);
      }
    };

    setHasLoaded(false);

    const timer = setTimeout(() => {
      fetchPets();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
    
  }, [filter, query, pathname, currentUser]);

  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        <h1 className="text-uppercase text-center pb-2">all the pets </h1>
        <PopularPets mobile />
        <i className={`fas fa-search ${appStyles.SearchIcon}`} />
        <Form 
          className={appStyles.SearchBar}
          onSubmit={(event) => event.preventDefault()}
        >
          <Form.Control
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="text"
            className="mr-sm-2"
            placeholder="Search pets" 
          />

        </Form>

        {hasLoaded ? (
          <>
            {pets.results.length ? (
              <InfiniteScroll
                children={
                  pets.results.map((pet) => (
                    <Pet key={pet.id} {...pet}/>
                  ))
                }

                dataLength={pets.results.length}
                loader={<Asset spinner />}
                hasMore={!!pets.next}
                next={() => fetchMoreData(pets, setPets)}
              />
  
            ) : (
              <Container className={appStyles.Content}>
                <Asset src={NoResults} message="No pets found, try again!" />
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
        <PopularOwners />
        <br></br>
        <PopularPets />
      </Col>
    </Row>
  );
}

export default PetsPage;
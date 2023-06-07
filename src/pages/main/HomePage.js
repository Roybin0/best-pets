import React, { useCallback, useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import PopularPet from "../pets/PopularPet";
import Tale from "../tales/Tale";
import Pic from "../pics/Pic";
import InfiniteScroll from "react-infinite-scroll-component";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import appStyles from "../../App.module.css";
import styles from "../../styles/HomeLikedPage.module.css";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";

const HomePage = () => {
  // const [combinedData, setCombinedData] = useState({ results: [] });
  const [pets, setPets] = useState({ results: [] });
  const [pics, setPics] = useState({ results: [] });
  const [tales, setTales] = useState({ results: [] });
  const [hasMorePets, setHasMorePets] = useState(true);
  const [hasMorePics, setHasMorePics] = useState(true);
  const [hasMoreTales, setHasMoreTales] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  // const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const [petsData, picsData, talesData] = await Promise.all([
          axiosReq.get("/pets/?ordering=-created_at"),
          axiosReq.get("/petpics/?ordering=-created_at"),
          axiosReq.get("/pettales/?ordering=-created_at"),
        ]);

        setPets(petsData.data);
        setPics(picsData.data);
        setTales(talesData.data);
        setHasMorePets(!!petsData.data.next);
        setHasMorePics(!!picsData.data.next);
        setHasMoreTales(!!talesData.data.next);
      } catch (err) {
        console.log("Fetch inital data error:", err);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [hasMorePics, hasMorePets, hasMoreTales]);

  // const fetchData = useCallback(async () => {
  //     if (isLoading) {
  //         return;
  //     }

  //     setIsLoading(true);

  //     try {
  //         let newData = [];

  //         // Fetch pets data if hasMorePets is true
  //         if (hasMorePets) {
  //             const pets = await axiosReq.get(`/pets?page=${page}`)
  //             if (pets && pets.data && pets.data.results) {
  //                 // Add 'type' property to each pet object for rendering
  //                 const petsWithTypes = pets.data.results.map((pet) => ({ ...pet, type: 'Pet' }));
  //                 newData = [...newData, ...petsWithTypes];
  //                 setHasMorePets(!!pets.data.next);
  //             } else if (pets && pets.error) {
  //                 console.log('Error in pets request:', pets.error.message);
  //                 setHasMorePets(false);
  //             }
  //         }

  //         // Fetch pics data if hasMorePics is true
  //         if (hasMorePics) {
  //             const pics = await axiosReq.get(`/petpics?page=${page}`).catch(handleError);
  //             if (pics && pics.data && pics.data.results) {
  //                 // Add 'type' property to each pic object for rendering
  //                 const picsWithTypes = pics.data.results.map((pic) => ({ ...pic, type: 'Pic' }));
  //                 newData = [...newData, ...picsWithTypes];
  //                 setHasMorePics(!!pics.data.next);
  //             } else if (pics && pics.error) {
  //                 console.log('Error in pics request:', pics.error.message);
  //                 setHasMorePics(false);
  //             }
  //         }

  //         // Fetch tales data if hasMoreTales is true
  //         if (hasMoreTales) {
  //             const tales = await axiosReq.get(`/pettales?page=${page}`).catch(handleError);
  //             if (tales && tales.data && tales.data.results) {
  //                 // Add 'type' property to each tale object for rendering
  //                 const talesWithTypes = tales.data.results.map((tale) => ({ ...tale, type: 'Tale' }));
  //                 newData = [...newData, ...talesWithTypes];
  //                 setHasMoreTales(!!tales.data.next);
  //             } else if (tales && tales.error) {
  //                 console.log('Error in tales request:', tales.error.message);
  //                 setHasMoreTales(false);
  //             }
  //         }

  //         //  Sort new data by timestamp
  //         newData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  //         setCombinedData((prevData) => [...prevData, ...newData]);
  //         setPage((prevPage) => prevPage + 1);
  //     } catch (err) {
  //         console.log('Error in fetchData:', err.message);
  //     } finally {
  //         setIsLoading(false);
  //     }
  // }, [isLoading, page, hasMorePets, hasMorePics, hasMoreTales]);

  // useEffect(() => {
  //     fetchData();
  // }, []);

  // const loadMoreData = () => {
  //     fetchData();
  // };

  // // Add a useEffect to log the combinedData whenever it changes
  // useEffect(() => {
  //     console.log('combinedData:', combinedData);
  // }, [combinedData]);

  return (
    <div style={{ height: "100%", overflow: "auto" }}>
      {isLoading ? (
        <Container className={appStyles.Content}>
          <Asset spinner />
        </Container>
      ) : (
        <>
          <div>
            <h2>Pets</h2>
            <Container fluid>
              <InfiniteScroll
                className={styles.PetsContainer}
                dataLength={pets.results.length}
                next={() => fetchMoreData(pets, setPets)}
                hasMore={hasMorePets}
                loader={<Asset spinner />}
              >
                <Row xs={4} md={6} lg={9} className="g-4">
                  {pets.results.map((pet) => (
                    <Col key={pet.id}>
                      <PopularPet profile={pet} mobile />
                    </Col>
                  ))}
                </Row>
              </InfiniteScroll>
            </Container>
          </div>

          <Row>
            <Col md={6}>
              <div>
                <h2>Pics</h2>
                <Container fluid>
                  <InfiniteScroll
                    dataLength={pics.results.length}
                    next={() => fetchMoreData(pics, setPics)}
                    hasMore={hasMorePics}
                    loader={<Asset spinner />}
                  >
                    <Row xs={1} className="g-4">
                      {pics.results.map((pic) => (
                        <Col key={pic.pic_id}>
                          <Pic {...pic} />
                        </Col>
                      ))}
                    </Row>
                  </InfiniteScroll>
                </Container>
              </div>
            </Col>
            <Col md={6}>
              <div>
                <h2>Tales</h2>
                <Container fluid>
                  <InfiniteScroll
                    dataLength={tales.results.length}
                    next={() => fetchMoreData(tales, setTales)}
                    hasMore={hasMoreTales}
                    loader={<Asset spinner />}
                  >
                    <Row xs={1} className="g-4">
                      {tales.results.map((tale) => (
                        <Col key={tale.tale_id}>
                          <Tale {...tale} />
                        </Col>
                      ))}
                    </Row>
                  </InfiniteScroll>
                </Container>
              </div>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default HomePage;

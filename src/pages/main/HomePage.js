import React, { useEffect, useState } from "react";
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
import Footer from "../../components/Footer";

const HomePage = () => {
  const [pets, setPets] = useState({ results: [] });
  const [pics, setPics] = useState({ results: [] });
  const [tales, setTales] = useState({ results: [] });
  const [isLoading, setIsLoading] = useState(false);

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
      } catch (err) {
        // console.log("Fetch inital data error:", err);
      }
    };

    const timer = setTimeout(() => {
      fetchData();
      setIsLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // For generating unique keys for Pic components
  const generatePicKey = (pic, index) => `${pic.pic_id}_${index}`;

  // For generating unique keys for Tale components
  const generateTaleKey = (tale, index) => `${tale.tale_id}_${index}`;

  const scrollToTop = (event, targetId) => {
    event.preventDefault();
    const targetElement = document.getElementById(targetId);
    const firstChild = targetElement.querySelector(".g-4 > :first-child");
    if (firstChild) {
      firstChild.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div>
      {isLoading ? (
        <Container className={appStyles.Content}>
          <Asset spinner />
        </Container>
      ) : (
        <>
          <div className={appStyles.TextCenter}>
            <h2>Pets</h2>
            <Container fluid>
              <InfiniteScroll
                className={styles.PetsContainer}
                dataLength={pets.results.length}
                next={() => fetchMoreData(pets, setPets)}
                hasMore={!!pets.next}
                loader={<Asset spinner />}
              >
                <Row
                  xs={4}
                  md={6}
                  lg={9}
                  className="g-4 justify-content-between"
                >
                  {pets.results.map((pet) => (
                    <Col key={pet.id}>
                      <PopularPet key={pet.id} profile={pet} mobile />
                    </Col>
                  ))}
                </Row>
              </InfiniteScroll>
            </Container>
          </div>

          <Row>
            <Col md={6} className="mb-4 mb-md-0">
              <div className={`${appStyles.TextCenter} ${styles.Border}`} id="pics-top">
                <h2>Pics</h2>
                <Container fluid>
                  <InfiniteScroll
                    className={styles.ContentContainer}
                    dataLength={pics.results.length}
                    next={() => fetchMoreData(pics, setPics)}
                    hasMore={!!pics.next}
                    loader={<Asset spinner />}
                  >
                    <Row xs={1} className="g-4">
                      {pics.results.map((pic, index) => (
                        <Col key={generatePicKey(pic, index)}>
                          <Pic {...pic} />
                        </Col>
                      ))}
                      {!pics.next && (
                        <div className={styles.EndMessage}>
                          <p>No more pics!</p>
                          <a
                            href="#pics-top"
                            onClick={(event) => scrollToTop(event, "pics-top")}
                          >
                            Back to top
                          </a>
                        </div>
                      )}
                    </Row>
                  </InfiniteScroll>
                </Container>
              </div>
            </Col>
            
            

            <Col md={6}>
              <div className={`${appStyles.TextCenter} ${styles.Border}`} id="tales-top">
                <h2>Tales</h2>
                <Container fluid>
                  <InfiniteScroll
                    className={styles.ContentContainer}
                    dataLength={tales.results.length}
                    next={() => fetchMoreData(tales, setTales)}
                    hasMore={!!tales.next}
                    loader={<Asset spinner />}
                  >
                    <Row xs={1} className="g-4">
                      {tales.results.map((tale, index) => (
                        <Col key={generateTaleKey(tale, index)}>
                          <Tale {...tale} />
                        </Col>
                      ))}
                      {!tales.next && (
                        <div className={styles.EndMessage}>
                          <p>No more tales!</p>
                          <a
                            href="#tales-top"
                            onClick={(event) => scrollToTop(event, "tales-top")}
                          >
                            Back to top
                          </a>
                        </div>
                      )}
                    </Row>
                  </InfiniteScroll>
                </Container>
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <Footer />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default HomePage;

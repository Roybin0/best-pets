import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import NoResults from "../../assets/noresultsfound.jpeg";
import Asset from "../../components/Asset";
import PopularPet from "../pets/PopularPet";
import Tale from "../tales/Tale";
import Pic from "../pics/Pic";
import appStyles from "../../App.module.css";
import styles from "../../styles/HomeLikedPage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";

const LikedPageSorted = ({ message, filter = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [likedPets, setLikedPets] = useState({ results: [] });
  const [likedData, setLikedData] = useState([]);
  const [isCurrentUserLoaded, setIsCurrentUserLoaded] = useState(false);
  const [page, setPage] = useState(1);
//   const [hasMorePets, setHasMorePets] = useState(true);
  const [hasMorePics, setHasMorePics] = useState(true);
  const [hasMoreTales, setHasMoreTales] = useState(true);
  const currentUser = useCurrentUser();
  const id = currentUser?.owner_id;

  useEffect(() => {
    //    Fetch and set liked pets
    const fetchPetData = async () => {
      try {
        const { data } = await axiosReq.get(
          `/pets/?followed_pet__owner=${id}&ordering=-likes__created_at`
        );
        setLikedPets(data);
        // setHasMorePets(!!data.data.next);
      } catch (err) {
        console.log("Fetch Pet Data error:", err);
      }
    };

    setIsCurrentUserLoaded(!!currentUser);
    setIsLoading(false);
    fetchPetData();
  }, [currentUser, id]);

  useEffect(() => {
    //    Fetch and set liked content
    const fetchLikedContent = async () => {
      try {
        let newData = [];

        // Fetch pics data if hasMorePics is true
        if (hasMorePics) {
            try {
                const pics = await axiosReq.get(`/petpics/?likes__owner=${id}&ordering=-likes__created_at&page=${page}`)
                if (pics) {
                    // Add 'type' property to each pic object for rendering
                    const picsWithTypes = pics.data.results.map((pic) => ({ ...pic, type: 'Pic' }));
                    newData = [...newData, ...picsWithTypes];
                    setHasMorePics(!!pics.data.next);
                    setPage((prevPage) => prevPage + 1);
                } else if (pics && pics.error) {
                    console.log('Error in pics request:', pics.error.message);
                    setHasMorePics(false);
            }
            } catch (err) {
                console.log("Error fetching pics:", err)
            }
            
        }

        // Fetch tales data if hasMoreTales is true
        if (hasMoreTales) {
            try {
                const tales = await axiosReq.get(`/pettales/?likes__owner=${id}&ordering=-likes__created_at`)
                if (tales && tales.data && tales.data.results) {
                    // Add 'type' property to each pic object for rendering
                    const talesWithTypes = tales.data.results.map((tale) => ({ ...tale, type: 'Tale' }));
                    newData = [...newData, ...talesWithTypes];
                    setHasMoreTales(!!tales.data.next);
                    setPage((prevPage) => prevPage + 1);
                } else if (tales && tales.error) {
                    console.log('Error in tales request:', tales.error.message);
                    setHasMoreTales(false);
            }
            } catch (err) {
                console.log("Error fetching tales:", err)
            }
            
        }
        
        setLikedData(combinedData);
        console.log(combinedData);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLikedContent();
  }, [id, page, hasMorePics, hasMoreTales]);

  useEffect (() => {
    //  Sort by most recent
    const combinedData = likedData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
  })

    const timer = setTimeout(() => {
      setIsCurrentUserLoaded(!!currentUser);
      setIsLoading(false);
      fetchPetData();
      fetchLikedContent();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };

  return (
    <>
      <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2" lg={8}>
          {/* <i className={`fas fa-search ${styles.SearchIcon}`} />
            <Form
            className={styles.SearchBar}
            onSubmit={(event) => event.preventDefault()}
            >
            <Form.Control
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                className="mr-sm-2"
                placeholder="Search pics"
            />
            </Form> */}

          {isLoading ? (
            <Container className={appStyles.Content}>
              <Asset spinner />
            </Container>
          ) : likedPets.results ? (
            <>
              <div className="d-flex justify-content-around">
                {likedPets.results.map((pet) => (
                  <PopularPet rowkey={pet.id} profile={pet} key={pet.id} />
                ))}
              </div>
            </>
          ) : (
            <Asset
              src={NoResults}
              message="No liked pets found! Like some pets to see them here."
            />
          )}
        </Col>
      </Row>

      <Row>
        <Col>
          {
            isLoading ? (
              <Container className={appStyles.Content}>
                <Asset spinner />
              </Container>
            ) : likedData.results ? (
                <InfiniteScroll
                    children={likedData.results.map((item) => {
                        if (item.type === 'pic') {
                        return (
                            <Pic key={item.id} {...item} />
                        );
                        } else if (item.type === 'tale') {
                        return (
                            <Tale key={item.id} {...item} />
                        );
                        } else {
                        return null; // or handle other types if necessary
                        }
                    })}
                    dataLength={likedData.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!likedData.next}
                    next={() => fetchMoreData(likedData, setLikedData)}
                />
            ) : (
              <Container className={appStyles.Content}>
                <Asset
                  src={NoResults}
                  message="No liked items found! Like some content to see it in your feed."
                />
              </Container>
            )

            //     <div className="d-flex justify-content-around">
            //       {likedPets.results.map((pet) => (
            //         <PopularPet rowkey={pet.id} profile={pet} mobile key={pet.id} />
            //       ))}
            //     </div>

            //     <Container
            //       className={`${appStyles.Content} ${
            //         mobile && "d-lg-none text-center mb-3"
            //       }`}
            //     >
            //       {likedPets.results.length ? (
            //         <>
            //           <p>Most followed Pets:</p>
            //           {mobile ? (
            //             <div className="d-flex justify-content-around">
            //               {likedPets.results.map((pet) => (
            //                 <PopularPet
            //                   rowkey={pet.id}
            //                   profile={pet}
            //                   mobile
            //                   key={pet.id}
            //                 />
            //               ))}
            //             </div>
            //           ) : (
            //             likedPets.results.map((pet) => (
            //               <PopularPet rowkey={pet.id} profile={pet} key={pet.id} />
            //             ))
            //           )}
            //         </>
          }
        </Col>
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
          {/* <PopularProfiles /> */}
        </Col>
      </Row>
    </>
  );
};

export default LikedPageSorted;

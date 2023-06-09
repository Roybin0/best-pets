import React, { useEffect, useState } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import NoResults from "../../assets/noresults.png";
import Asset from "../../components/Asset";
import Tale from "../tales/Tale";
import Pic from "../pics/Pic";
import appStyles from "../../App.module.css";
import styles from "../../styles/HomeLikedPage.module.css";
import InfiniteScroll from "react-infinite-scroll-component";
import { fetchMoreData } from "../../utils/utils";
import { useRedirect } from "../../hooks/useRedirect";
import PopularOwners from "../owners/PopularOwners";
import PopularPets from "../pets/PopularPets";
import OwnerProfilePet from "../owners/OwnerProfilePet";

const LikedPageSorted = () => {
  useRedirect("loggedOut");
  const [isLoading, setIsLoading] = useState(true);
  const [likedPets, setLikedPets] = useState({ results: [] });
  const [likedData, setLikedData] = useState({ results: [] });
  const [page, setPage] = useState(1);
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
      } catch (err) {
        // console.log("Fetch Pet Data error:", err);
      }
    };

    const timer = setTimeout(() => {
      setIsLoading(false);
      fetchPetData();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [currentUser, id]);

  useEffect(() => {
    //    Fetch and set liked content
    const fetchLikedContent = async () => {
      try {
        let newData = { ...likedData };

        // Fetch pics data if hasMorePics is true
        if (hasMorePics) {
          try {
            const pics = await axiosReq.get(
              `/petpics/?likes__owner=${id}&ordering=-likes__created_at&page=${page}`
            );
            if (pics) {
              // Add 'type' property to each pic object for rendering
              const picsWithTypes = pics.data.results.map((pic, index) => ({
                ...pic,
                type: "Pic",
                pic_id: `pic${index + 1}`,
              }));
              newData.results.push(...picsWithTypes);
              setHasMorePics(!!pics.data.next);
              setPage((prevPage) => prevPage + 1);
            } 
          } catch (err) {
            // console.log("Error fetching pics:", err);
            setHasMorePics(false);
          }
        }

        // Fetch tales data if hasMoreTales is true
        if (hasMoreTales) {
          try {
            const tales = await axiosReq.get(
              `/pettales/?likes__owner=${id}&ordering=-likes__created_at&page=${page}`
            );
            if (tales) {
              // Add 'type' property to each tale object for rendering
              const talesWithTypes = tales.data.results.map((tale, index) => ({
                ...tale,
                type: "Tale",
                tale_id: `tale${index + 1}`,
              }));
              newData.results.push(...talesWithTypes);
              setHasMoreTales(!!tales.data.next);
              setPage((prevPage) => prevPage + 1);
            } 
          } catch (err) {
            // console.log("Error fetching tales:", err);
            setHasMoreTales(false);
          }
        }

        //  Sort by most recent
        newData.results.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setLikedData(newData);
      } catch (err) {
        // console.log(err);
      }
    };

    const timer = setTimeout(() => {
      fetchLikedContent();
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, page, hasMorePics, hasMoreTales, likedData]);

  return (
    <>
      <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2">
          <h1 className="text-uppercase text-center pb-2">all my liked </h1>
          {isLoading ? (
            <Container className={appStyles.Content}>
              <Asset spinner />
            </Container>
          ) : likedPets.results ? (
            <>
              <div className={`d-flex align-items-center ${styles.Border} ${styles.Rounded}`}>
                <h3>Followed <br /> pets:</h3>
                <div className="d-flex flex-wrap">
                  {likedPets.results.map((pet) => (
                    <OwnerProfilePet
                      rowkey={pet.id}
                      profile={pet}
                      key={pet.id}
                    />
                  ))}
                </div>
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
                  if (item.type === "Pic") {
                    return <Pic key={item.pic_id} {...item} />;
                  } else if (item.type === "Tale") {
                    return <Tale key={item.tale_id} {...item} />;
                  } else {
                    return null;
                  }
                })}
                dataLength={likedData.results.length}
                loader={<Asset spinner />}
                hasMore={hasMorePics || hasMoreTales}
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
          }
        </Col>
        <Col md={4} className="d-none d-lg-block p-0 p-lg-2">
          <PopularOwners />
          <br />
          <PopularPets />
        </Col>
      </Row>
    </>
  );
};

export default LikedPageSorted;

import React, { useEffect, useState } from "react";

import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import Asset from "../../components/Asset";

import styles from "../../styles/OwnerProfilePage.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";

import PopularOwners from "./PopularOwners";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import {
    useOwnerData,
    useSetOwnerData,
} from "../../contexts/OwnerDataContext";

import InfiniteScroll from "react-infinite-scroll-component";
import Tale from "../tales/Tale"
import Pic from "../pics/Pic"
import { fetchMoreData } from "../../utils/utils";
import NoResults from "../../assets/noresults.png";
import { ProfileEditDropdown } from "../../components/MoreDropdown";
import OwnerProfilePet from "./OwnerProfilePet";

function OwnerProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [ownerPets, setOwnerPets] = useState({ results: [] });
    const [ownerTales, setOwnerTales] = useState({ results: [] });
    const [ownerPics, setOwnerPics] = useState({ results: [] });
    const [activeOption, setActiveOption] = useState("pets");

    const currentUser = useCurrentUser();
    const { id } = useParams();

    const { setOwnerData, handleFollow, handleUnfollow } = useSetOwnerData();
    const { pageOwner } = useOwnerData();

    const [owner] = pageOwner.results;
    const is_owner = currentUser?.username === owner?.owner;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: pageOwner }, { data: ownerPets }, { data: ownerTales }, { data: ownerPics }] =
                    await Promise.all([
                        axiosReq.get(`/owners/${id}`),
                        axiosReq.get(`/pets/?owner=${id}`),
                        axiosReq.get(`/pettales/?owner=${id}`),
                        axiosReq.get(`/petpics/?owner=${id}`),
                    ]);
                    setOwnerData((prevState) => ({
                        ...prevState,
                        pageOwner: { results: [pageOwner] },
                      }));
                setOwnerPets((ownerPets));
                setOwnerPics(ownerPics);
                setOwnerTales(ownerTales);
                setHasLoaded(true);
            } catch (err) {
                // console.log(err);
            }
        };
        fetchData();
    }, [id, setOwnerData]);

    const mainProfile = (
        <>
            <Row noGutters className="px-3 text-center">
                <Col xs={12} md={3} className="text-lg-left">
                    <Image
                        className={styles.ProfileImage}
                        roundedCircle
                        src={owner?.image}
                    />
                </Col>
                <Col xs={12} md={6}>
                    <h1 className={`${styles.Header} m-2`}>{owner?.owner}</h1>
                    <Row className="justify-content-center no-gutters">
                        <Col xs={4} className="my-2">
                            <div>{owner?.pets_count}</div>
                            <div>{owner?.pets_count === 1 ? 'pet' : 'pets'}</div>
                        </Col>
                        <Col xs={4} className="my-2">
                            <div>{owner?.petpics_count}</div>
                            <div>{owner?.petpics_count === 1 ? 'pic' : 'pics'}</div>
                        </Col>
                        <Col xs={4} className="my-2">
                            <div>{owner?.pettales_count}</div>
                            <div>{owner?.pettales_count === 1 ? 'tale' : 'tales'}</div>
                        </Col>
                        <Col xs={4} className="my-2">
                            <div>{owner?.followers_count}</div>
                            <div>{owner?.followers_count === 1 ? 'follower' : 'followers'}</div>
                        </Col>
                        <Col xs={4} className="my-2">
                            <div>{owner?.following_count_owners}</div>
                            <div>{owner?.following_count_owners === 1 ? 'owner followed' : 'owners followed'}</div>
                        </Col>
                        <Col xs={4} className="my-2">
                            <div>{owner?.following_count_pets}</div>
                            <div>{owner?.following_count_pets === 1 ? 'pet followed' : 'pets followed'}</div>
                        </Col>
                    </Row>
                </Col>

                <Col md={3} >
                    {owner?.is_owner && owner?.id && <ProfileEditDropdown id={owner?.id} className={styles.Dark} />}
                    {currentUser &&
                        !is_owner &&
                        (owner?.following_id ? (
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.Dark}`}
                                onClick={() => handleUnfollow(owner)}
                            >
                                unfollow
                            </Button>
                        ) : (
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.DarkOutline}`}
                                onClick={() => handleFollow(owner)}
                            >
                                follow
                            </Button>
                        ))}
                </Col>
            </Row>
            <Row className="text-center">
                {owner?.about && <Col className="p-3">{owner.about}</Col>}
            </Row>
        </>
    );

    const mainOwnerPets = (
        <>
            <hr />
            <Row className="d-flex align-items-center">
                <Col>
                    <p className="text-center">{owner?.owner}'s Pets</p>
                </Col>
                </Row>
                
            <Row className="d-flex justify-content-center">
                {ownerPets.results.length ? (
                    ownerPets.results.map((pet) => (
                        <Col key={pet.id}>
                            <OwnerProfilePet rowkey={pet.id} profile={pet} />
                        </Col>
                    ))
                ) : (
                    <Asset
                        src={NoResults}
                        message={`No results found, ${owner?.owner} hasn't added any pets yet.`}
                    />
                )}
            </Row>
            <hr />
        </>
    )

    const mainOwnerPics = (
        <>
            <hr />
            <p className="text-center">{owner?.owner}'s Pet Pics</p>
            <hr />
            {ownerPics.results.length ? (
                <InfiniteScroll
                    className={styles.LightText}
                    children={ownerPics.results.map((pic) => (
                        <Pic key={pic.id} {...pic} />
                    ))}
                    dataLength={ownerPics.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!ownerPics.next}
                    next={() => fetchMoreData(ownerPics, setOwnerPics)}
                />
            ) : (
                <Asset
                    src={NoResults}
                    message={`No results found, ${owner?.owner} hasn't uploaded any pet pics yet.`}
                />
            )}
        </>
    )

    const mainOwnerTales = (
        <>
            <hr />
            <p className="text-center">{owner?.owner}'s Pet Tales</p>
            <hr />
            {ownerTales.results.length ? (
                <InfiniteScroll
                    className={styles.LightText}
                    children={ownerTales.results.map((tale) => (
                        <Tale key={tale.id} {...tale}/>
                    ))}
                    dataLength={ownerTales.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!ownerTales.next}
                    next={() => fetchMoreData(ownerTales, setOwnerTales)}
                />
            ) : (
                <Asset
                    src={NoResults}
                    message={`No results found, ${owner?.owner} hasn't told any pet tales yet.`}
                />
            )}
        </>
    );

    const handleOptionClick = (option) => {
        setActiveOption(option);
    };

    const renderActiveContent = () => {
        switch (activeOption) {
            case "pics":
                return (
                    <>
                        {mainOwnerPics}
                    </>
                );
            case "tales":
                return (
                    <>
                        {mainOwnerTales}
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Row>
            <Col className="py-2 p-0 p-lg-2" lg={8}>
                <PopularOwners mobile />
                <Container className={appStyles.Content}>
                    {hasLoaded ? (
                        <>
                            {mainProfile}
                            <div className={styles.OwnerStats}>
                            {mainOwnerPets}
                                <Button
                                    className={`${styles.OwnerStatsButton} ${btnStyles.Button} ${btnStyles.Wide} ${activeOption === "pics" && styles.ActiveOption
                                        }`}
                                    onClick={() => handleOptionClick("pics")}
                                >
                                    Pet Pics
                                </Button>
                                <Button
                                    className={`${styles.OwnerStatsButton} ${btnStyles.Button} ${btnStyles.Wide} ${activeOption === "tales" && styles.ActiveOption
                                        }`}
                                    onClick={() => handleOptionClick("tales")}
                                >
                                    Pet Tales
                                </Button>
                            </div>
                            {renderActiveContent()}
                        </>
                    ) : (
                        <Asset spinner />
                    )}
                </Container>
            </Col>
            <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                <PopularOwners />
            </Col>
        </Row>
    );
}

export default OwnerProfilePage;
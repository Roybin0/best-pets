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
                console.log(err);
            }
        };
        fetchData();
    }, [id, setOwnerData]);

    const mainProfile = (
        <>
            <Row noGutters className="px-3 text-center">
                <Col lg={3} className="text-lg-left">
                    <Image
                        className={styles.ProfileImage}
                        roundedCircle
                        src={owner?.image}
                    />
                </Col>
                <Col lg={6}>
                    <h3 className="m-2">{owner?.owner}</h3>
                    <Row className="justify-content-center no-gutters">
                        <Col xs={3} className="my-2">
                            <div>{owner?.pets_count}</div>
                            <div>{owner?.pets_count === 1 ? 'pet' : 'pets'}</div>
                        </Col>
                        <Col xs={3} className="my-2">
                            <div>{owner?.followers_count}</div>
                            <div>{owner?.followers_count === 1 ? 'follower' : 'followers'}</div>
                        </Col>
                        <Col xs={3} className="my-2">
                            <div>following</div>
                            <div>{owner?.following_count_owners}</div>
                            <div>{owner?.following_count_owners === 1 ? 'owner' : 'owners'}</div>
                        </Col>
                        <Col xs={3} className="my-2">
                            <div>following</div>
                            <div>{owner?.following_count_pets}</div>
                            <div>{owner?.following_count_pets === 1 ? 'pet' : 'pets'}</div>
                        </Col>
                    </Row>
                </Col>

                <Col lg={3} className="text-lg-right">
                    {owner?.is_owner && <ProfileEditDropdown id={owner?.id} />}
                    {currentUser &&
                        !is_owner &&
                        (owner?.following_id ? (
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.BlackOutline}`}
                                onClick={() => handleUnfollow(owner)}
                            >
                                unfollow
                            </Button>
                        ) : (
                            <Button
                                className={`${btnStyles.Button} ${btnStyles.Black}`}
                                onClick={() => handleFollow(owner)}
                            >
                                follow
                            </Button>
                        ))}
                </Col>
                {owner?.about && <Col className="p-3">{owner.about}</Col>}
            </Row>
        </>
    );

    const mainOwnerPets = (
        <>
            <hr />
            <Row>
                <Col>
                    <p className="text-center">{owner?.owner}'s Pets</p>
                </Col>
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
                    children={ownerPics.results.map((pic) => (
                        <Pic key={pic.id} {...pic} setPics={setOwnerPics} />
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
                    children={ownerTales.results.map((tale) => (
                        <Tale key={tale.id} {...tale} setTales={setOwnerTales} />
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
            case "pets":
                return (
                    <>
                        {mainOwnerPets}
                    </>
                );
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
                                <Button
                                    className={`${styles.OwnerStatsButton} ${activeOption === "pets" && styles.ActiveOption
                                        }`}
                                    onClick={() => handleOptionClick("pets")}
                                >
                                    Pets
                                </Button>
                                <Button
                                    className={`${styles.OwnerStatsButton} ${activeOption === "pics" && styles.ActiveOption
                                        }`}
                                    onClick={() => handleOptionClick("pics")}
                                >
                                    Pet Pics
                                </Button>
                                <Button
                                    className={`${styles.OwnerStatsButton} ${activeOption === "tales" && styles.ActiveOption
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
import React, { useEffect, useState } from 'react';
import appStyles from "../../App.module.css";
import styles from "../../styles/Tale.module.css";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link, useHistory } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { axiosReq, axiosRes } from '../../api/axiosDefaults';
import { MoreDropdown } from '../../components/MoreDropdown';


const Tale = (props) => {
    const {
        id,
        owner,
        owner_id,
        owner_profile_image,
        pet,
        pet_name,
        image,
        tldr,
        tale,
        likes_count,
        comments_count,
        updated_at,
        talePage,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();

    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [likesCount, setLikesCount] = useState(likes_count);

    const handleEdit = () => {
        history.push(`/tales/${id}/edit`)
    };

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/pettales/${id}`);
            history.goBack();
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async () => {
        try {
            if (!liked) {
                const { data } = await axiosRes.post('/likes/', { object_id: id, content_type: 'pettale' });
                setLiked(true);
                setLikeId(data.like_id);
                setLikesCount((prevCount) => prevCount + 1);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleUnlike = async () => {
        try {
            if (likeId) {
                await axiosRes.delete(`/likes/${likeId}`);
                setLiked(false);
                setLikeId(null);
                setLikesCount((prevCount) => prevCount - 1);
            }
        } catch (err) {
            console.log(err);
        }
    };   

    useEffect(() => {
        const fetchLikesCount = async () => {
            try {
              const { data } = await axiosReq.get(`/pettales/${id}`);
              if (data) {
                setLikesCount(data.likes_count);
              }
            } catch (err) {
              console.log(err);
            }
        };

        // Check if pettale is liked by the current user
        const checkLikedStatus = async () => {
            if (currentUser && currentUser.username && id) {
                try {
                    const { data } = await axiosReq.get(`/likes/?owner__username=${currentUser?.username}&object_id=${id}&content_type__model=pettale`);
                    if (data.results.length > 0) {
                        setLiked(true);
                        setLikeId(data.results[0].like_id);
                      }
                    fetchLikesCount();
                } catch (err) {
                    console.log(err);
                }
            }
        };

        checkLikedStatus();
    }, [currentUser, id]);

    

    return (
        <Card className={styles.Tales}>
            <Card.Body>
                <Media className="justify-content-between">
                    <Row className="d-flex align-items-center justify-content-around">
                    {pet_name && (
                        <Col xs={4} md={4} className="text-left">
                            <Link to={`/pets/${pet}`} className={appStyles.NoLinkUnderline}>
                                <Card.Title><small>Name:</small> <strong>{pet_name}</strong></Card.Title>
                            </Link>
                        </Col>
                    )} 
                    {owner_profile_image ? (
                        <Col xs={4} md={4}>
                        <Link to={`/owners/${owner_id}`} className={appStyles.NoLinkUnderline}>
                            <span className="d-none d-md-inline">{owner}</span>
                            <Avatar src={owner_profile_image} height={55} />
                        </Link>
                        </Col>
                    ) : (
                        <span>Loading owner...</span>
                    )}
                        
                    {is_owner && talePage && (
                        <Col xs={4} md={4} className="text-right">
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        </Col>
                    )}
                    </Row>
                </Media>
            </Card.Body>
            
            <Card.Body>
            <Link to={`/tales/${id}`} className={appStyles.NoLinkUnderline}>
            <Row>
                <Col xs={12} md={6} className="mb-3 mb-md-0">
                        <Card.Img className={styles.TaleImage} src={image} alt={pet_name} />
                </Col>
                <Col xs={12} md={6} className={styles.TalesContent}>
                        <Col>
                            {tldr && <Card.Text><strong>TL;DR:</strong> {tldr}</Card.Text>}
                        </Col>
                        <Col className={styles.ScrollableContainer}>
                            {tale && <Card.Text><strong>{pet_name}'s Tale:</strong> {tale}</Card.Text>}
                        </Col>
                </Col>
            </Row>
            </Link>
            </Card.Body>
            

            <Card.Body> 
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            {is_owner ? (
                                <OverlayTrigger placement='top' overlay={<Tooltip>You can't like your own tale!</Tooltip>}>
                                    <i className='far fa-heart' />
                                </OverlayTrigger>
                            ) : likeId ? (
                                <span onClick={handleUnlike}>
                                    <i className={`fas fa-heart ${styles.Heart}`} />
                                </span>
                            ) : currentUser ? (
                                <span onClick={handleLike}>
                                    <i className={`far fa-heart ${styles.HeartOutline}`} />
                                </span>
                            ) : (
                                <OverlayTrigger placement='top' overlay={<Tooltip>Log in to like pics!</Tooltip>}>
                                    <i className='far fa-heart' />
                                </OverlayTrigger>
                            )}
                            <span className="me-3">{likesCount}</span>
                            <Link to={`/tales/${id}`}>
                                <i className='far fa-comments' />
                            </Link>
                            <span>{comments_count}</span>
                        </div>
                        <span>Last updated: {updated_at}</span>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default Tale
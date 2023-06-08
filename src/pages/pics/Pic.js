import React, { useEffect, useState } from 'react'
import styles from "../../styles/Pic.module.css"
import appStyles from "../../App.module.css";
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


const Pic = (props) => {
    const {
        id,
        owner,
        owner_id,
        owner_profile_image,
        pet,
        pet_name,
        image,
        description,
        likes_count,
        comments_count,
        updated_at,
        picPage,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();

    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [likesCount, setLikesCount] = useState(likes_count);

    const handleEdit = () => {
        history.push(`/pics/${id}/edit`)
    };

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/petpics/${id}`);
            history.goBack();
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async () => {
        try {
            if (!liked) {
                const { data } = await axiosRes.post('/likes/', { 
                    object_id: id, 
                    content_type: 'petpic',
                });
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
            const { data } = await axiosReq.get(`/petpics/${id}`);
            if (data) {
              setLikesCount(data.likes_count);
            }
          } catch (err) {
            console.log(err);
          }
        };
    
        // Check if pet is liked by the current user
        const checkLikedStatus = async () => {
          if (currentUser && currentUser.username && id) {
            try {
              const { data } = await axiosReq.get(
                `/likes/?owner__username=${currentUser?.username}&object_id=${id}&content_type__model=petpic`
              );
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
        <Card className={styles.Pic}>
            <Card.Body>
                <Media className="justify-content-between">
                    <Row className="d-flex align-items-center justify-content-around">
                        {pet_name && (
                            <Col xs={4} md={4} className="text-left">
                                <Link to={`/pets/${pet}`} className={appStyles.NoLinkUnderline}>
                                <Card.Title className='text-center'><small>Name:</small> <strong>{pet_name}</strong></Card.Title>
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
                            <Col xs={3} md={3}>
                                <span>Loading owner...</span>
                            </Col>
                        )}

                        {is_owner && picPage && (
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

            <Link to={`/pics/${id}`}>
                <Card.Img
                    className={styles.PicImage}
                    src={image}
                    alt={description}
                />
            </Link>

            <Card.Body>
                {description && <Card.Text>{description}</Card.Text>}
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            {is_owner ? (
                                <OverlayTrigger placement='top' overlay={<Tooltip>You can't like your own pic!</Tooltip>}>
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
                            <Link to={`/pics/${id}`}>
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

export default Pic
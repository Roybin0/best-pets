import React, { useEffect, useState } from 'react'
import styles from "../../styles/Pic.module.css"
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
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
        // pet_id,
        pet_name,
        pet_type,
        image,
        description,
        // created_at,
        likes_count,
        updated_at,
        picPage,
        // setPets,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();

    const [ownerDetails, setOwnerDetails] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [likesCount, setLikesCount] = useState(likes_count);

    useEffect(() => {
        const fetchOwnerDetails = async () => {
            try {
                const { data } = await axiosReq.get(`/owners/${owner_id}`);
                setOwnerDetails(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchOwnerDetails();
    }, [owner_id]);

    useEffect(() => {
        // Check if petpic is liked by the current user
        const checkLikedStatus = async () => {
            if (currentUser && currentUser.username) {
                try {
                    const { data } = await axiosReq.get(`/likes/?owner__username=${currentUser.username}&object_id=${id}&content_type__model=petpic`);
                    if (data.results.length > 0) {
                        setLiked(true);
                        setLikeId(data.results[0].like_id);
                      }
                } catch (err) {
                    console.log(err);
                }
            }
        };

        checkLikedStatus();
    }, [currentUser, id]);

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

    const fetchPetDetails = async () => {
        try {
          const { data } = await axiosReq.get(`/petpics/${id}`);
          if (data) {
            // Update the likes_count from the server response
            setLikesCount(data.likes_count);
          }
        } catch (err) {
          console.log(err);
        }
      };

    const handleLike = async () => {
        try {
            if (!liked) {
                const { data } = await axiosRes.post('/likes/', { object_id: id, content_type: 'petpic' });
                setLiked(true);
                setLikeId(data.like_id);
                fetchPetDetails();
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
                fetchPetDetails();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Card className={styles.Pet}>

            <Card.Body>
                <Media className='align-items-center justify-content-between'>
                    {ownerDetails ? (
                        <Link to={`/owners/${owner_id}`}>
                            <Avatar src={ownerDetails.image} height={55} />
                            {owner}
                        </Link>
                    ) : (
                        <span>Loading owner...</span>
                    )}

                    <div className='d-flex align-items-center'>
                        <span>{updated_at}</span>
                        {is_owner && picPage && (
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        )}
                    </div>
                </Media>
            </Card.Body>

            <Link to={`/pics/${id}`}>
                <Card.Img className={styles.Pic} src={image} alt={description} />
            </Link>

            <Card.Body>
                {pet_name && <Card.Title className='text-center'>Name: {pet_name}</Card.Title>}
                {pet_type && <Card.Text>Category: {pet_type}</Card.Text>}
                {description && <Card.Text>{description}</Card.Text>}
                <div className={styles.PetBar}>
                    {is_owner ? (
                        <OverlayTrigger placement='top' overlay={<Tooltip>You can't like your own pet!</Tooltip>}>
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
                    {likesCount}
                    <Link to={`/pics/${id}`}>
                        <i className='far fa-comments' />
                    </Link>
                    {/* {comments_count} */}
                </div>
            </Card.Body>

        </Card>
    );
};

export default Pic
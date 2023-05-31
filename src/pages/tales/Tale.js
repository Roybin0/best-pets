import React, { useEffect, useState } from 'react'
import styles from "../../styles/Tale.module.css"
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
        owner_profile_image,
        // pet_id,
        pet_name,
        pet_type,
        image,
        tldr,
        tale,
        // created_at,
        likes_count,
        // comments_count,
        updated_at,
        talePage,
        // setPets,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();

    const [liked, setLiked] = useState(false);
    const [likeId, setLikeId] = useState(null);
    const [likesCount, setLikesCount] = useState(likes_count);

    useEffect(() => {
        // Check if pettale is liked by the current user
        const checkLikedStatus = async () => {
            if (currentUser && currentUser.username) {
                try {
                    const { data } = await axiosReq.get(`/likes/?owner__username=${currentUser.username}&object_id=${id}&content_type__model=pettale`);
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

    const fetchPetTaleDetails = async () => {
        try {
          const { data } = await axiosReq.get(`/pettales/${id}`);
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
                const { data } = await axiosRes.post('/likes/', { object_id: id, content_type: 'pettale' });
                setLiked(true);
                setLikeId(data.like_id);
                fetchPetTaleDetails();
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
                fetchPetTaleDetails();
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Card className={styles.Pet}>

            <Card.Body>
                <Media className='align-items-center justify-content-between'>
                    {owner_profile_image ? (
                        <Link to={`/owners/${owner_id}`}>
                            <Avatar src={owner_profile_image} height={55} />
                            {owner}
                        </Link>
                    ) : (
                        <span>Loading owner...</span>
                    )}

                    <div className='d-flex align-items-center'>
                        <span>{updated_at}</span>
                        {is_owner && talePage && (
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        )}
                    </div>
                </Media>
            </Card.Body>

            <Link to={`/tales/${id}`}>
                <Card.Img className={styles.Pic} src={image} alt={tldr} />
            </Link>

            <Card.Body>
                {pet_name && <Card.Title className='text-center'>Name: {pet_name}</Card.Title>}
                {pet_type && <Card.Text>Category: {pet_type}</Card.Text>}
                {tldr && <Card.Text>{tldr}</Card.Text>}
                {tale && <Card.Text>{tale}</Card.Text>}
                <div className={styles.PetBar}>
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
                    {likesCount}
                    <Link to={`/tales/${id}`}>
                        <i className='far fa-comments' />
                    </Link>
                    {/* {comments_count} */}
                </div>
            </Card.Body>

        </Card>
    );
};

export default Pic
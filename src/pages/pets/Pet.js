import React from 'react'
import styles from "../../styles/Pet.module.css"
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { Link, useHistory } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { axiosRes } from '../../api/axiosDefaults';
import { MoreDropdown } from '../../components/MoreDropdown';


const Pet = (props) => {

    const {
        id,
        owner,
        owner_id,
        owner_image,
        name,
        pet_type,
        likes_count,
        like_id,
        about,
        image,
        updated_at,
        petPage,
        setPets,
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;
    const history = useHistory();

    const handleEdit = () => {
        history.push(`/pets/${id}/edit`)
    };

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/pets/${id}`);
            history.goBack();
        } catch (err) {
            console.log(err);
        }
    };

    // const handleLike = async () => {
    //     try {
    //         const { data } = await axiosRes.post('/likes/', { pet: id });
    //         setPets((prevPets) => ({
    //             ...prevPets,
    //             results: prevPets.results.map((pet) => {
    //                 return pet.id === id
    //                     ? { ...pet, likes_count: pet.likes_count + 1, like_id: data.id }
    //                     : pet;
    //             }),
    //         }));
    //     } catch (err) {
    //         console.log(err)
    //     }
    // };

    // const handleUnlike = async () => {
    //     try {
    //         await axiosRes.delete(`/likes/${like_id}`);
    //         setPets((prevPets) => ({
    //             ...prevPets,
    //             results: prevPets.results.map((pet) => {
    //                 return pet.id === id
    //                     ? { ...pet, likes_count: pet.likes_count - 1, like_id: null }
    //                     : pet;
    //             }),
    //         }));
    //     } catch (err) {
    //         console.log(err)
    //     }
    // };

    const handleLike = async () => {
        try {
            const { data } = await axiosRes.post('/likes/', { pet_id: id });
            setPets((prevPets) => ({
                ...prevPets,
                results: prevPets.results.map((pet) =>
                    pet.id === id ? { ...pet, likes_count: pet.likes_count + 1, like_id: data.id } : pet
                ),
            }));
        } catch (err) {
            console.log(err);
        }
    };
    
    const handleUnlike = async () => {
        try {
            await axiosRes.delete(`/likes/${like_id}`);
            setPets((prevPets) => ({
                ...prevPets,
                results: prevPets.results.map((pet) =>
                    pet.id === id ? { ...pet, likes_count: pet.likes_count - 1, like_id: null } : pet
                ),
            }));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Card className={styles.Pet}>

            <Card.Body>
                <Media className='align-items-center justify-content-between'>
                    <Link to={`/owners/${owner_id}`}>
                        <Avatar src={owner_image} height={55} />
                        {owner}
                    </Link>
                    <div className='d-flex align-items-center'>
                        <span>{updated_at}</span>
                        {is_owner && petPage && (
                            <MoreDropdown
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        )}
                    </div>
                </Media>
            </Card.Body>

            <Link to={`/pets/${id}`}>
                <Card.Img src={image} alt={name} />
            </Link>

            <Card.Body>
                {name && <Card.Title className='text-center'>{name}</Card.Title>}
                {pet_type && <Card.Text>{pet_type}</Card.Text>}
                {about && <Card.Text>{about}</Card.Text>}
                <div className={styles.PetBar}>
                    {is_owner ? (
                        <OverlayTrigger placement='top' overlay={<Tooltip>You can't like your own pet!</Tooltip>}>
                            <i className='far fa-heart' />
                        </OverlayTrigger>
                    ) : like_id ? (
                        <span onClick={handleUnlike}>
                            <i className={`fas fa-heart ${styles.Heart}`} />
                        </span>
                    ) : currentUser ? (
                        <span onClick={handleLike}>
                            <i className={`far fa-heart ${styles.HeartOutline}`} />
                        </span>
                    ) : (
                        <OverlayTrigger placement='top' overlay={<Tooltip>Log in to like pets!</Tooltip>}>
                            <i className='far fa-heart' />
                        </OverlayTrigger>
                    )}
                    {likes_count}
                    <Link to={`/pets/${id}`}>
                        <i className='far fa-comments' />
                    </Link>
                    {/* {comments_count} */}
                </div>
            </Card.Body>

        </Card>
    );
};

export default Pet
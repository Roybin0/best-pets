import React, { useState } from 'react';
import styles from "../../styles/Comment.module.css";
import appStyles from "../../App.module.css";
import Media from 'react-bootstrap/Media';
import { Link } from 'react-router-dom/';
import Avatar from '../../components/Avatar';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { MoreDropdown } from '../../components/MoreDropdown';
import { axiosRes } from '../../api/axiosDefaults';
import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {

    const {
        owner_id,
        owner_profile_image,
        owner,
        comment,
        updated_at,
        setAsset,
        setComments,
        id,
    } = props;

    const [showEditForm, setShowEditForm] = useState(false);

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/comments/${id}`)
            setAsset(prevAsset => ({
                results: [{
                    ...prevAsset.results[0],
                    comments_count: prevAsset.results[0].comments_count - 1,
                }]
            }))

            setComments(prevComments => ({
                ...prevComments,
                results: prevComments.results.filter(comment => comment.id !== id)
            }))
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <hr />
            <Media>
                <Link to={`/owner/${owner_id}`}>
                    <Avatar src={owner_profile_image} />
                </Link>
                <Media.Body className="align-self-center ml-2">
                    <span className={styles.Owner}>{owner}</span>
                    <span className={styles.Date}>{updated_at}</span>
                    <div className={`${styles.CommentContainer} d-flex align-items-center justify-between`}>
                        <div className={styles.CommentText}>
                            <p>{comment}</p>
                        </div>
                        {is_owner && !showEditForm && (
                            <div className={`${styles.MoreDropdownContainer} ml-2`}>
                                <MoreDropdown
                                    handleEdit={() => setShowEditForm(true)}
                                    handleDelete={handleDelete}
                                />
                            </div>
                        )}
                    </div>
                    {showEditForm && (
                        <CommentEditForm
                            id={id}
                            profile_id={owner_id}
                            content={comment}
                            profileImage={owner_profile_image}
                            setComments={setComments}
                            setShowEditForm={setShowEditForm}
                        />
                    )}
                </Media.Body>

            </Media>
        </>
    );
};

export default Comment
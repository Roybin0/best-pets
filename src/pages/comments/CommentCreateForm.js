import React, { useState } from "react";
import { Link } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import styles from "../../styles/CommentCreateEditForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
    const { asset, asset_type, setAsset, setComments, owner_image, owner_id } = props;
    const [comment, setComment] = useState("");

    const handleChange = (event) => {
        setComment(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const postData = {
                comment,
            };

            if (asset_type === "pet_tale") {
                postData.pet_tale = asset;
                postData.pet_pic = null;
                postData.pet = null;
            } else if (asset_type === "pet_pic") {
                postData.pet_tale = null;
                postData.pet_pic = asset;
                postData.pet = null;
            } else if (asset_type === "pet") {
                postData.pet_tale = null;
                postData.pet_pic = null;
                postData.pet = asset;
            }

            const { data } = await axiosRes.post("/comments/", postData);
            setComments((prevComments) => ({
                ...prevComments,
                results: [data, ...prevComments.results],
            }));
            setAsset((prevAsset) => ({
                results: [
                    {
                        ...prevAsset.results[0],
                        comments_count: prevAsset.results[0].comments_count + 1,
                    },
                ],
            }));
            setComment("");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Link to={`/owners/${owner_id}`}>
                        <Avatar src={owner_image} />
                    </Link>
                    <Form.Control
                        className={styles.Form}
                        placeholder="My comment..."
                        as="textarea"
                        value={comment}
                        onChange={handleChange}
                        rows={2}
                    />
                </InputGroup>
            </Form.Group>
            <button
                className={`${btnStyles.Button} btn d-block ml-auto`}
                disabled={!comment.trim()}
                type="submit"
            >
                Comment
            </button>
        </Form>
    );
}

export default CommentCreateForm;
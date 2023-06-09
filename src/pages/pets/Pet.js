import React, { useEffect, useState } from "react";
import appStyles from "../../App.module.css";
import styles from "../../styles/Pet.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Media from "react-bootstrap/Media";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Link, useHistory } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import { MoreDropdown } from "../../components/MoreDropdown";

const Pet = (props) => {
  const {
    id,
    owner,
    owner_id,
    name,
    likes_count,
    comments_count,
    about,
    image,
    updated_at,
    petPage,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const [ownerDetails, setOwnerDetails] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likeId, setLikeId] = useState(null);
  const [likesCount, setLikesCount] = useState(likes_count);

  useEffect(() => {
    if (owner_id) {
      const fetchOwnerDetails = async () => {
        try {
          const { data } = await axiosReq.get(`/owners/${owner_id}`);
          setOwnerDetails(data);
        } catch (err) {
          // console.log(err);
        }
      };

      fetchOwnerDetails();
    }
  }, [owner_id]);

  useEffect(() => {
    const fetchLikesCount = async () => {
      try {
        const { data } = await axiosReq.get(`/pets/${id}`);
        if (data) {
          setLikesCount(data.likes_count);
        }
      } catch (err) {
        // console.log(err);
      }
    };

    // Check if pet is liked by the current user
    const checkLikedStatus = async () => {
      if (currentUser && currentUser.username && id) {
        try {
          const { data } = await axiosReq.get(
            `/likes/?owner__username=${currentUser?.username}&object_id=${id}&content_type__model=pet`
          );
          if (data.results.length > 0) {
            setLiked(true);
            setLikeId(data.results[0].like_id);
          }
          fetchLikesCount();
        } catch (err) {
          // console.log(err);
        }
      }
    };

    checkLikedStatus();
  }, [currentUser, id]);

  const handleEdit = () => {
    history.push(`/pets/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/pets/${id}`);
      history.goBack();
    } catch (err) {
      // console.log(err);
    }
  };

  const handleLike = async () => {
    try {
      if (!liked) {
        const { data } = await axiosRes.post("/likes/", {
          object_id: id,
          content_type: "pet",
        });
        setLiked(true);
        setLikeId(data.like_id);
        setLikesCount((prevCount) => prevCount + 1);
      }
    } catch (err) {
      // console.log(err);
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
      // console.log(err);
    }
  };

  return (
    <Card className={styles.Pet}>
      <Card.Body>
        <Media className="justify-content-between">
          <Row className="d-flex align-items-center justify-content-around">
            {name && (
              <Col xs={4} md={4} className="text-left">
                <Card.Title><small>Name:</small> <strong>{name}</strong></Card.Title>
              </Col>
            )}
            {ownerDetails ? (
              <Col xs={4} md={4}>
                <Link to={`/owners/${owner_id}`} className={appStyles.NoLinkUnderline}>
                  <span className="d-none d-md-inline">{owner}</span>
                  <Avatar src={ownerDetails.image} height={55} />
                </Link>
              </Col>
            ) : (
              <Col xs={3} md={3}>
                <span>Loading owner...</span>
              </Col>
            )}

            {is_owner && petPage && (
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

      <Link to={`/pets/${id}`}>
        <Card.Img
          src={image}
          alt={name}
          className={styles.PetImage}
        />
      </Link>

      <Card.Body>
        {about && <Card.Text>{about}</Card.Text>}
        <div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              {is_owner ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>You can't like your own pet!</Tooltip>}
                >
                  <i className="far fa-heart" />
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
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Log in to like pets!</Tooltip>}
                >
                  <i className="far fa-heart" />
                </OverlayTrigger>
              )}
              <span className="me-3">{likesCount}</span>
              <Link to={`/pets/${id}`}>
                <i className="far fa-comments" />
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

export default Pet; 

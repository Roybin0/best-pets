import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Tale from "././Tale";
import CommentCreateForm from "../comments/CommentCreateForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext"
import Comment from "../comments/Comment";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";
import { fetchMoreData } from "../../utils/utils";
// import PopularProfiles from "../profiles/PopularProfiles";

function TalePage() {
  const { id } = useParams();
  const [tale, setTale] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const owner_image = currentUser?.profile_image;
  const asset_type = "pet_tale"
  const [comments, setComments] = useState({ results: [] });

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: tale }, { data: comments }] = await Promise.all([
          axiosReq.get(`/pettales/${id}`),
          axiosReq.get(`/comments/?pet_tale=${id}`)
        ])
        setTale({ results: [tale] })
        setComments(comments)
      } catch (err) {
        // console.log(err)
      }
    };

    handleMount();
  }, [id]);


  return (
    <Row className="h-100">
      <Col className="py-2 p-0 p-lg-2" lg={8}>
        {/* <PopularProfiles mobile /> */}
        <Tale {...tale.results[0]} setTales={setTale} talePage />
        <Container className={appStyles.Content}>
          {currentUser ? (
            <CommentCreateForm
              owner_id={currentUser.owner_id}
              owner_image={owner_image}
              asset_type={asset_type}
              asset={id}
              setAsset={setTale}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setAsset={setTale}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser ? (
            <span>No comments yet, be the first to comment!</span>
          ) : (
            <span>No comments ... yet!</span>
          )}
        </Container>
      </Col>
      <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
        {/* <PopularProfiles /> */}
      </Col>
    </Row>
  );
}

export default TalePage;
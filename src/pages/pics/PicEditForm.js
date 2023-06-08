import React, { useRef, useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import upload from "../../assets/upload.png";
import styles from "../../styles/ContentCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function PicEditForm() { 

    const [picData, setPicData] = useState({
        pet: "",
        image: "",
        description: "",
    });

    const { pet, image, description } = picData;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username;

    const [pets, setPets] = useState({ results: [] });

    const [errors, setErrors] = useState({});
    const history = useHistory();
    const imageInput = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/petpics/${id}`)
                const { pet, image, description, is_owner } = data

                is_owner ? setPicData({ pet, image, description, }) : history.push('/')
            } catch (err) {
                console.log(err)
            }
        };

        handleMount();
    }, [history, id])

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const encodedOwner = encodeURIComponent(is_owner);
                const { data } = await axiosReq.get(`/pets/?owner__username=${encodedOwner}`);
                setPets(data);
                // console.log("API response:", data);
            } catch (err) {
                console.log(err);
            }
        };

        if (currentUser?.username) {
            fetchPets();
        }
    }, [currentUser, is_owner])

    const handleChange = (event) => {
        setPicData({
            ...picData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image)
            setPicData({
                ...picData,
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("pet", pet)
        if (imageInput.current.files.length > 0) {
            const imageFile = imageInput.current.files[0];
            formData.append("image", imageFile);
        } 
        formData.append("description", description)

        try {
            const { data } = await axiosReq.put(`/petpics/${id}`, formData);
            history.push(`/pics/${data.id}`);
        } catch (err) {
            console.log(err)
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const textFields = (
        <div className="text-center">
            <Form.Group className={styles.Padding}>
                <Form.Label><h5>Which pet is in this pic?</h5></Form.Label>
                <Form.Control
                    as="select"
                    name="pet"
                    value={pet}
                    onChange={handleChange} 
                >
                    {pets.results.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                            {pet.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            {errors?.pet?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Form.Group className={`${styles.Padding} pb-4`}>
                <Form.Label><h5>Image Description</h5></Form.Label>
                <Form.Control
                    type="textarea"
                    name="description"
                    rows={3}
                    aria-describedby="descriptionHelp"
                    value={description}
                    onChange={handleChange}
                />
                <Form.Text id="descriptionHelp" muted>
                    Add a short description about this image if you want!
                </Form.Text>
            </Form.Group>
            {errors?.about?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Button className={`${btnStyles.Button} p-2`} type="submit">
                Update Pic
            </Button>

            <Button
                className={`${btnStyles.Button} p-2`}
                onClick={() => history.goBack()}
            >
                Cancel
            </Button>

        </div>
    );

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Row className="align-items-center">
                    <h1 className={`${styles.TextBright} text-center pb-3`}>Update your Pic</h1>
                    <Col md={5} lg={4} className="p-0 p-md-2 d-none d-md-block d-flex justify-content-center">
                        <Container className={styles.Content}>{textFields}</Container>
                    </Col>
                    <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                        <Container
                            className={`${styles.Content} ${styles.Container}`}
                        >
                            <Form.Group className="text-center">
                                {image ? (
                                    <>
                                        <figure>
                                            <Image className={appStyles.Image} src={image} rounded />
                                        </figure>
                                        <div>
                                            <Form.Label
                                                className={btnStyles.Button}
                                                htmlFor="image-upload"
                                            >
                                                Change the image
                                            </Form.Label>
                                        </div>
                                    </>
                                ) : (
                                    <Form.Label
                                        className="d-flex justify-content-center"
                                        htmlFor="image-upload"
                                    >
                                        <Asset src={upload} message="Click or tap to upload an image" />
                                    </Form.Label>

                                )}

                                <Form.File
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleChangeImage}
                                    ref={imageInput}
                                />
                            </Form.Group>
                            {errors?.image?.map((message, idx) => (
                                <Alert variant="warning" key={idx}>
                                    {message}
                                </Alert>
                            ))}
                            <div className="d-md-none">{textFields}</div>
                        </Container>
                    </Col>
                </Row>
            </Form>

        </>
    );
}

export default PicEditForm;
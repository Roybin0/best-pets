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
import btnStyles from "../../styles/Button.module.css";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

function TaleEditForm() {
    const [taleData, setTaleData] = useState({
        pet: "",
        image: "",
        tldr: "",
        tale: "",
    });

    const { pet, image, tldr, tale } = taleData;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username;

    const [pets, setPets] = useState({ results: [] });
    const [errors, setErrors] = useState({});
    const history = useHistory();
    const imageInput = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const encodedOwner = encodeURIComponent(is_owner);
                const { data } = await axiosReq.get(`/pets/?owner__username=${encodedOwner}`);
                setPets(data);
            } catch (err) {
                // console.log(err);
            }
        };

        if (currentUser?.username) {
            fetchPets();
        }
    }, [currentUser, is_owner]);

    useEffect(() => {
        const fetchTaleData = async () => {
            try {
                const { data } = await axiosReq.get(`/pettales/${id}`);
                const { pet, image, tldr, tale, is_owner } = data;
                is_owner ? setTaleData({ pet, image, tldr, tale }) : history.push("/");
            } catch (err) {
                // console.log(err);
            }
        };

        fetchTaleData();
    }, [history, id]);

    const handleChange = (event) => {
        setTaleData({
            ...taleData,
            [event.target.name]: event.target.value,
        });
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            URL.revokeObjectURL(image);
            setTaleData({ ...taleData, image: URL.createObjectURL(file) });
        }
    };

    const getDefaultImage = (petId) => {
        const selectedPet = pets.results.find((pet) => pet.id === petId);
        return selectedPet?.image?.url || "";
    };

    const handleDefaultImageSelection = (event) => {
        const petId = event.target.value;
        const defaultImage = getDefaultImage(petId);
        setTaleData({ ...taleData, pet: petId, image: defaultImage });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("pet", pet);
        if (imageInput.current.files.length > 0) {
            const imageFile = imageInput.current.files[0];
            formData.append("image", imageFile);
        } 
        formData.append("tldr", tldr);
        formData.append("tale", tale);

        try {
            const { data } = await axiosReq.put(`/pettales/${id}/`, formData);
            history.push(`/tales/${data.id}`);
        } catch (err) {
            // console.log(err);
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const renderErrorAlerts = (errorMessages) => {
        return errorMessages.map((message, idx) => (
            <Alert variant="warning" key={idx}>
                {message}
            </Alert>
        ));
    };

    const textFields = (
        <div className="text-center">
            <Form.Group className={styles.Padding}>
                <Form.Label><h5>Which pet is in this tale?</h5></Form.Label>
                <Form.Control
                    as="select"
                    name="pet"
                    value={pet}
                    onChange={handleDefaultImageSelection}
                >
                    {pets.results.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                            {pet.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>
            {errors?.pet && renderErrorAlerts(errors.pet)}

            <Form.Group className={`${styles.Padding} pb-4`}>
                <Form.Label><h5>TL;DR:</h5></Form.Label>
                <Form.Control
                    type="text"
                    name="tldr"
                    placeholder="Provide a shortened version of your tale"
                    maxLength={255}
                    value={tldr}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.tldr && renderErrorAlerts(errors.tldr)}

            <Form.Group className={`${styles.Padding} pb-4`}>
                <Form.Label><h5>Update your tale</h5></Form.Label>
                <Form.Control
                    as="textarea"
                    name="tale"
                    rows={10}
                    value={tale}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.tale && renderErrorAlerts(errors.tale)}

            <Button className={`${btnStyles.Button} p-2`} type="submit">
                Update Tale
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
            <Form onSubmit={handleSubmit} >
                <Row className="align-items-center">
                    <h1 className={`${styles.TextBright} text-center pb-3`}>Update your tale</h1>
                    <Col md={7} lg={6} className="p-0 p-md-2 d-none d-md-block d-flex justify-content-center">
                        <Container className={styles.Content}>{textFields}</Container>
                    </Col>
                    <Col className="py-2 p-0 p-md-2" md={5} lg={6}>
                        <Container
                            className={`${styles.Content} ${styles.Container}`}
                        >
                            <Form.Group className="text-center">
                                {image ? (
                                    <>
                                        <figure>
                                            <Image 
                                                src={image} 
                                                rounded 
                                                className={styles.ExistingImage}
                                            />
                                        </figure>
                                        <div>
                                            <Form.Label
                                                className={styles.Button}
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
                                        <Asset
                                            src={upload}
                                            message="Click or tap to upload an image (optional). We'll use your pet's profile pic if no image is added."
                                        />
                                    </Form.Label>
                                )}

                                <Form.File
                                    id="image-upload"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    ref={imageInput}
                                    style={{ display: "none" }}
                                />
                            </Form.Group>
                            <div className="d-md-none">{textFields}</div>
                        </Container>
                    </Col>
                </Row>       
            </Form>
        </>
    );
}

export default TaleEditForm;
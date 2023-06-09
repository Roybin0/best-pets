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
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";

function TaleCreateForm() {
    useRedirect('loggedOut');
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
    const [defaultImage, setDefaultImage] = useState("");

    const [errors, setErrors] = useState({});
    const history = useHistory();
    const imageInput = useRef(null);

    // Fetch all pets belonging to the current user
    useEffect(() => {
        const fetchPets = async () => {
            try {
                const encodedOwner = encodeURIComponent(is_owner);
                const { data } = await axiosReq.get(`/pets/?owner__username=${encodedOwner}`);
                setPets(data);
            } catch (err) {
                // console.log("Fetch data error:", err);
            }
        };

        if (currentUser?.username) {
            fetchPets();
        }
    }, [currentUser, is_owner]);

    const handleChange = (event) => {
        setTaleData({
            ...taleData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image)
            setTaleData({
                ...taleData,
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
        formData.append("tldr", tldr)
        formData.append("tale", tale)

        try {
            const { data } = await axiosReq.post("/pettales/", formData);
            history.push(`/tales/${data.id}`);
        } catch (err) {
            // console.log(err)
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const textFields = (
        <div className="text-center pb-3">
            <Form.Group className={styles.Padding}>
                <Form.Label><h5>Which pet is in this tale?</h5></Form.Label>
                <Form.Control
                    as="select"
                    name="pet"
                    value={pet}
                    onChange={handleChange}
                >
                    <option>Choose your pet below</option>
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
            {errors?.tldr?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}


            <Form.Group className={`${styles.Padding} pb-4`}>
                <Form.Label><h5>Tell your tale</h5></Form.Label>
                <Form.Control
                    as="textarea"
                    name="tale"
                    rows={10}
                    value={tale}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.tale?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Button className={`${btnStyles.Button} p-2`} type="submit">
                Add Tale
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
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Row className="align-items-center">
                    <h1 className={`${styles.TextBright} text-center pb-3`}>Tell your tale</h1>
                    <Col md={7} lg={6} className="p-0 p-md-2 d-none d-md-block d-flex justify-content-center">
                        <Container className={styles.Content}>{textFields}</Container>
                    </Col>
                    <Col className="py-2 p-0 p-md-2" md={5} lg={6}>
                        <Container
                            className={`${styles.Content} ${styles.Container}`}
                        >
                            <Form.Group className="text-center">
                                {image && (
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
                                            <br />
                                            <small>Optional - We'll use your pet's profile pic if no new image is added</small>
                                        </div>
                                    </>
                                )}
                                {!image && (
                                    <Form.Label
                                        className="d-flex justify-content-center"
                                        htmlFor="image-upload"
                                    >
                                        <Asset
                                            src={upload}
                                            message="Click or tap to upload an image (optional). Your pet's profile pic will show beside your tale."
                                        />
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

export default TaleCreateForm
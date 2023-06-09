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

function PetEditForm() {

    const [petData, setPetData] = useState({
        name: "",
        pet_type: "",
        image: "",
        about: "",
    });

    const { name, pet_type, image, about } = petData;

    const [errors, setErrors] = useState({});
    const history = useHistory();
    const imageInput = useRef(null);
    const { id } = useParams();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/pets/${id}`)
                const { name, pet_type, image, about, is_owner } = data

                is_owner ? setPetData({ name, pet_type, image, about }) : history.push('/')
            } catch (err) {
                // console.log(err)
            }
        };

        handleMount();
    }, [history, id])

    const handleChange = (event) => {
        setPetData({
            ...petData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image)
            setPetData({
                ...petData,
                image: URL.createObjectURL(event.target.files[0])
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append("name", name)
        formData.append("pet_type", pet_type)
        if (imageInput?.current?.files[0]) {
            formData.append("image", imageInput.current.files[0])
        }
        formData.append("about", about)

        try {
            const { data } = await axiosReq.put(`/pets/${id}`, formData);
            history.push(`/pets/${data.id}`);
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
                <Form.Label><h5>Pet Name</h5></Form.Label>
                <Form.Control
                    type="text"
                    name="name"
                    value={name}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.name?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Form.Group className={styles.Padding}>
                <Form.Label><h5>Pet Type</h5></Form.Label>
                <Form.Control as="select"
                    name="pet_type"
                    value={pet_type}
                    onChange={handleChange}
                >
                    <option>Choose from the list below</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Hamster">Hamster</option>
                    <option value="Horse">Horse</option>
                    <option value="Reptile">Reptile</option>
                    <option value="Rabbit">Rabbit</option>
                    <option value="Other">Other</option>
                </Form.Control>
            </Form.Group>
            {errors?.pet_type?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Form.Group className={`${styles.Padding} pb-4`}>
                <Form.Label><h5>About (optional)</h5></Form.Label>
                <Form.Control
                    type="textarea"
                    name="about"
                    rows={3}
                    value={about}
                    onChange={handleChange}
                />
            </Form.Group>
            {errors?.about?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Button className={`${btnStyles.Button} p-2`} type="submit">
                Update Pet
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
                    <h1 className={`${styles.TextBright} text-center pb-3`}>Update your Pet</h1>
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

export default PetEditForm;
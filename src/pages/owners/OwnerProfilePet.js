import React from "react";
import styles from "../../styles/OwnerProfilePage.module.css";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";


const OwnerProfilePet = (props) => {
    const { profile, imageSize = 55 } = props;
    const { id, image, name } = profile;

    return (
        <div
            className={`my-3 d-flex flex-column align-items-center justify-content-center`}
        >
            <div>
                <Link className="align-self-center" to={`/pets/${id}`}>
                    <Avatar src={image} height={imageSize} />
                </Link>
            </div>
            <div className={`mx-2 ${styles.WordBreak} text-center`}>
                <strong>{name}</strong>
            </div>
        </div>
    );
};

export default OwnerProfilePet;
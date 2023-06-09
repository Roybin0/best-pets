import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import styles from "../styles/MoreDropdown.module.css";
import { useHistory } from "react-router-dom";


const ThreeDots = React.forwardRef(({ onClick }, ref) => (
    <i
        className="fas fa-ellipsis-v"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    />
));

export const MoreDropdown = ({ handleEdit, handleDelete }) => {
    return (
        <Dropdown className="ml-auto" drop="down">
            <Dropdown.Toggle 
                as={ThreeDots} 
                id="dropdown-custom-components"
                activeClassName={styles.Active}
            >
                Custom toggle
            </Dropdown.Toggle>

            <Dropdown.Menu
                className="text-center p-0"
                popperConfig={{ strategy: "fixed" }}
            >
                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleEdit}
                    aria-label="edit"
                >
                    <i className="fas fa-edit" />
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleDelete}
                    aria-label="delete"
                >
                    <i className="fas fa-trash-alt" />
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export function ProfileEditDropdown({ id }) {
    const history = useHistory();
    return (
        <Dropdown 
            className={`ml-auto px-3 ${styles.ProfileDark}`} 
            drop="down"
        >
            <Dropdown.Toggle 
                as={ThreeDots}
                activeClassName={styles.Active}
                className={styles.ProfileDark}
            />
            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={() => history.push(`/owners/${id}/edit`)}
                    aria-label="edit-profile"
                    className={styles.ProfileDropdownItem}
                >
                    <i className="fas fa-edit" /> edit profile
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => history.push(`/owners/${id}/edit/username`)}
                    aria-label="edit-username"
                    className={styles.ProfileDropdownItem}
                >
                    <i className="far fa-id-card" />
                    change username
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => history.push(`/owners/${id}/edit/password`)}
                    aria-label="edit-password"
                    className={styles.ProfileDropdownItem}
                >
                    <i className="fas fa-key" />
                    change password
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
};
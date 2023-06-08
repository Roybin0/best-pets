import React from "react";
import Container from "react-bootstrap/Container";
import styles from "../../styles/PopularOwnerPet.module.css";
import Asset from "../../components/Asset";
import { useOwnerData } from "../../contexts/OwnerDataContext";
import Owner from "./Owner";

const PopularOwners = ({ mobile }) => {
  const { popularOwners } = useOwnerData(); 

  return (
    <Container
      className={`${styles.PopularDark} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularOwners.results.length ? (
        <>
          <h5>Most followed Pet Owners:</h5>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularOwners.results.slice(0, 4).map((owner) => (
                <Owner rowkey={owner.id} profile={owner} mobile key={owner.id} />
              ))}
            </div>
          ) : (
            popularOwners.results.slice(0, 5).map((owner) => (
              <Owner rowkey={owner.id} profile={owner} key={owner.id} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularOwners;
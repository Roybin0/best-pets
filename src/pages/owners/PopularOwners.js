import React from "react";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { useOwnerData } from "../../contexts/OwnerDataContext";
import Owner from "./Owner";

const PopularOwners = ({ mobile }) => {
  const { popularOwners } = useOwnerData(); 

  if (!popularOwners) {
    return <Asset spinner />;
  }

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularOwners.results.length ? (
        <>
          <p>Most followed profiles.</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularOwners.results.slice(0, 4).map((owner) => (
                <Owner rowkey={owner.id} profile={owner} mobile key={owner.id} />
              ))}
            </div>
          ) : (
            popularOwners.results.map((owner) => (
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
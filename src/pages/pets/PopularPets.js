import React from "react";
import Container from "react-bootstrap/Container";
import appStyles from "../../App.module.css";
import Asset from "../../components/Asset";
import { usePetData } from "../../contexts/PetDataContext";
import PopularPet from "./PopularPet";

const PopularPets = ({ mobile }) => {
  const { popularPets } = usePetData(); 

  return (
    <Container
      className={`${appStyles.Content} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularPets.results.length ? (
        <>
          <p>Most followed Pets:</p>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {popularPets.results.slice(0, 4).map((pet) => (
                <PopularPet rowkey={pet.id} profile={pet} mobile key={pet.id} />
              ))}
            </div>
          ) : (
            popularPets.results.map((pet) => (
              <PopularPet rowkey={pet.id} profile={pet} key={pet.id} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularPets;
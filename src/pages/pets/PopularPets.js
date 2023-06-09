import React from "react";
import Container from "react-bootstrap/Container";
import styles from "../../styles/PopularOwnerPet.module.css";
import Asset from "../../components/Asset";
import { usePetData } from "../../contexts/PetDataContext";
import PopularPet from "./PopularPet";

const PopularPets = ({ mobile }) => {
  const { popularPets } = usePetData(); 

  const uniquePets = Array.from(new Set(popularPets.results.map((pet) => pet.id)))
  .map((id) => popularPets.results.find((pet) => pet.id === id));

  return (
    <Container
      className={`${styles.PopularDark} ${
        mobile && "d-lg-none text-center mb-3"
      }`}
    >
      {popularPets.results.length ? (
        <>
          <h5>Most followed Pets:</h5>
          {mobile ? (
            <div className="d-flex justify-content-around">
              {uniquePets.slice(0, 4).map((pet) => (
                <PopularPet rowkey={pet.id} profile={pet} mobile key={pet.id} />
                
              ))}
              
            </div>
          ) : (
            uniquePets.slice(0, 5).map((pet) => (
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
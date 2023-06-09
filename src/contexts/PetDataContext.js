import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { followPetHelper, unfollowPetHelper } from "../utils/utils";
import { useCurrentUser } from "./CurrentUserContext";

const PetDataContext = createContext();
const SetPetDataContext = createContext();

export const usePetData = () => useContext(PetDataContext);
export const useSetPetData = () => useContext(SetPetDataContext);

export const PetDataProvider = ({ children }) => {
  const [petData, setPetData] = useState({
    pagePet: { results: [] },
    popularPets: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFollow = async (clickedPet) => {
    try {
      const { data } = await axiosRes.post("/followers-pets/", {
        followed_pet: clickedPet.id,
      });

      setPetData((prevState) => ({
        ...prevState,
        pagePet: {
          results: prevState.pagePet.results.map((pet) =>
            followPetHelper(pet, clickedPet, data.id)
          ),
        },
        popularPets: {
          ...prevState.popularPets,
          results: prevState.popularPets.results.map((pet) =>
            followPetHelper(pet, clickedPet, data.id)
          ),
        },
      }));

      if (currentUser && currentUser?.id) {
        const updatedUser = {
          ...currentUser,
          following_count_pets: currentUser.following_count_pets + 1,
        };
        // Make an API request to update the current user's following_count_pets
        await axiosRes.patch(`/users/${currentUser?.owner_id}/`, updatedUser);
      }
      await fetchPopularPets();
    } catch (err) {
      // console.log(err);
    }
  };

  const handleUnfollow = async (clickedPet) => {
    try {
      await axiosRes.delete(`/followers-pets/${clickedPet.following_id}`);

      setPetData((prevState) => ({
        ...prevState,
        pagePet: {
          results: prevState.pagePet.results.map((pet) =>
            unfollowPetHelper(pet, clickedPet)
          ),
        },
        popularPets: {
          ...prevState.popularPets,
          results: prevState.popularPets.results.map((pet) =>
            unfollowPetHelper(pet, clickedPet)
          ),
        },
      }));

      if (currentUser && currentUser?.id) {
        const updatedUser = {
          ...currentUser,
          following_count_pets: currentUser.following_count_pets - 1,
        };
        // Make an API request to update the current user's following_count_pets
        await axiosRes.patch(`/users/${currentUser?.owner_id}/`, updatedUser);
      }
      await fetchPopularPets();
    } catch (err) {
      // console.log(err);
    }
  };

  const fetchPopularPets = async () => {
    try {
      const { data } = await axiosReq.get("/pets/?ordering=-followers_count");
      setPetData((prevState) => ({
        ...prevState,
        popularPets: data,
      }));
    } catch (err) {
      // console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      await fetchPopularPets();
    };

    handleMount();
  }, [currentUser]);

  return (
    <PetDataContext.Provider value={petData}>
      <SetPetDataContext.Provider
        value={{ setPetData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetPetDataContext.Provider>
    </PetDataContext.Provider>
  );
};
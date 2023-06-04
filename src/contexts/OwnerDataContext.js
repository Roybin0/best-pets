import { createContext, useContext, useEffect, useState } from "react";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { followOwnerHelper, unfollowOwnerHelper } from "../utils/utils";
import { useCurrentUser } from "./CurrentUserContext";

const OwnerDataContext = createContext();
const SetOwnerDataContext = createContext();

export const useOwnerData = () => useContext(OwnerDataContext);
export const useSetOwnerData = () => useContext(SetOwnerDataContext);

export const OwnerDataProvider = ({ children }) => {
  const [ownerData, setOwnerData] = useState({
    pageOwner: { results: [] },
    popularOwners: { results: [] },
  });

  const currentUser = useCurrentUser();

  const handleFollow = async (clickedOwner) => {
    try {
      const { data } = await axiosRes.post("/followers-owners/", {
        followed_owner: clickedOwner.id,
      });

      setOwnerData((prevState) => ({
        ...prevState,
        pageOwner: {
          results: prevState.pageOwner.results.map((owner) =>
            followOwnerHelper(owner, clickedOwner, data.id)
          ),
        },
        popularOwners: {
          ...prevState.popularOwners,
          results: prevState.popularOwners.results.map((owner) =>
            followOwnerHelper(owner, clickedOwner, data.id)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnfollow = async (clickedOwner) => {
    try {
      await axiosRes.delete(`/followers-owners/${clickedOwner.following_id}`);

      setOwnerData((prevState) => ({
        ...prevState,
        pageOwner: {
          results: prevState.pageOwner.results.map((owner) =>
            unfollowOwnerHelper(owner, clickedOwner)
          ),
        },
        popularOwners: {
          ...prevState.popularOwners,
          results: prevState.popularOwners.results.map((owner) =>
            unfollowOwnerHelper(owner, clickedOwner)
          ),
        },
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      try {
        console.log("Starting API call...")
        const { data } = await axiosReq.get(
          "/owners/?ordering=-followers_count"
        );
        console.log(`"API Response:" ${data}`)
        setOwnerData((prevState) => ({
          ...prevState,
          popularOwners: data,
        }));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [currentUser]);

  return (
    <OwnerDataContext.Provider value={ownerData}>
      <SetOwnerDataContext.Provider
        value={{ setOwnerData, handleFollow, handleUnfollow }}
      >
        {children}
      </SetOwnerDataContext.Provider>
    </OwnerDataContext.Provider>
  );
};
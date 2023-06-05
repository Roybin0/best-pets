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
            owner.id === clickedOwner.id
              ? followOwnerHelper(owner, clickedOwner, data.id)
              : owner
          ),
        },
        popularOwners: {
          ...prevState.popularOwners,
          results: prevState.popularOwners.results.map((owner) =>
            owner.id === clickedOwner.id
              ? followOwnerHelper(owner, clickedOwner, data.id)
              : owner
          ),
        },
      }));
      await fetchPopularOwners();
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
            owner.id === clickedOwner.id
              ? unfollowOwnerHelper(owner, clickedOwner)
              : owner
          ),
        },
        popularOwners: {
          ...prevState.popularOwners,
          results: prevState.popularOwners.results.map((owner) =>
            owner.id === clickedOwner.id
              ? unfollowOwnerHelper(owner, clickedOwner)
              : owner
          ),
        },
      }));
      await fetchPopularOwners();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchPopularOwners = async () => {
    try {
      const { data } = await axiosReq.get("/owners/?ordering=-followers_count");
      setOwnerData((prevState) => ({
        ...prevState,
        popularOwners: data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const handleMount = async () => {
      await fetchPopularOwners();
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

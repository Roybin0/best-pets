import jwtDecode from "jwt-decode";
import { axiosReq } from "../api/axiosDefaults";

export const fetchMoreData = async (resource, setResource) => {
  try {
    const { data } = await axiosReq.get(resource.next);
    setResource((prevResource) => ({
      ...prevResource,
      next: data.next,
      results: data.results.reduce((acc, cur) => {
        return acc.some((accResult) => accResult.id === cur.id)
          ? acc
          : [...acc, cur];
      }, prevResource.results),
    }));
  } catch (err) {}
};

export const followOwnerHelper = (owner, clickedOwner, following_id) => {
  return owner.id === clickedOwner.id
    ? // Clicked profile > update followers count and following id
      {
        ...owner,
        followers_count: owner.followers_count + 1,
        following_id,
      }
    : owner.is_owner
    ? // Logged in user > update following count
      { ...owner, following_count_owners: owner.following_count_owners + 1 }
    : owner;
};

export const unfollowOwnerHelper = (owner, clickedOwner) => {
  return owner.id === clickedOwner.id
    ? // Clicked profile > update followers count and following id
      {
        ...owner,
        followers_count: owner.followers_count - 1,
        following_id: null,
      }
    : owner.is_owner
    ? // Logged in user > update following count
      { ...owner, following_count_owners: owner.following_count_owners - 1 }
    : owner;
};

export const followPetHelper = (pet, clickedPet, following_id) => {
  return pet.id === clickedPet.id
    ? // Clicked pet > update followers count and following id
      {
        ...pet,
        followers_count: pet.followers_count + 1,
        following_id,
      }
    : pet;
};


export const unfollowPetHelper = (pet, clickedProfile) => {
  return pet.id === clickedProfile.id
    ? // Clicked pet > update followers count and following id
      {
        ...pet,
        followers_count: pet.followers_count - 1,
        following_id: null,
      }
    : pet;
};

export const setTokenTimestamp = (data) => {
  const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
  localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
};

export const shouldRefreshToken = () => {
  return !!localStorage.getItem("refreshTokenTimestamp");
};

export const removeTokenTimestamp = () => {
  localStorage.removeItem("refreshTokenTimestamp");
};
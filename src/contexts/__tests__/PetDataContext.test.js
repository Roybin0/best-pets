import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PetDataProvider, usePetData, useSetPetData } from "../PetDataContext";
import { useCurrentUser } from "../CurrentUserContext";
import { axiosReq } from "../../api/axiosDefaults";

jest.mock("../CurrentUserContext"); // Mock the useCurrentUser hook

describe("PetDataContext", () => {
    beforeEach(() => {
        // Reset the mocked currentUser value before each test
        useCurrentUser.mockReturnValue(null);
    });

    test("handleFollow should update petData and currentUser when following a pet", async () => {
        const petData = {
            pagePet: { results: [{ id: 1, followers_count: 10 }] },
            popularPets: { results: [] },
        };
        const setPetData = jest.fn();
        const currentUser = { id: 1, owner_id: 1, following_count_pets: 0 };
        useCurrentUser.mockReturnValue(currentUser);
        axiosReq.post = jest.fn().mockResolvedValue({ data: { id: 1 } }); // Use jest.fn() to mock axiosReq.post

        render(
            <PetDataProvider>
                <TestComponent />
            </PetDataProvider>
        );

        await act(async () => {
            userEvent.click(screen.getByTestId("follow-button"));
        });

        expect(axiosReq.post).toHaveBeenCalledWith("/followers-pets/", {
            followed_pet: 1,
        });
        expect(setPetData).toHaveBeenCalledTimes(1);
        expect(setPetData).toHaveBeenCalledWith({
            pagePet: {
                results: [{ id: 1, followers_count: 11 }],
            },
            popularPets: { results: [] },
        });

        expect(axiosReq.patch).toHaveBeenCalledWith("/users/1/", {
            ...currentUser,
            following_count_pets: 1,
        });

        expect(axiosReq.get).toHaveBeenCalledWith("/pets/?ordering=-followers_count");
    });

    test("handleUnfollow should update petData and currentUser when unfollowing a pet", async () => {
        const petData = {
            pagePet: { results: [{ id: 1, followers_count: 10 }] },
            popularPets: { results: [] },
        };
        const setPetData = jest.fn();
        const currentUser = { id: 1, owner_id: 1, following_count_pets: 1 };
        useCurrentUser.mockReturnValue(currentUser);

        render(
            <PetDataProvider>
                <TestComponent />
            </PetDataProvider>
        );

        await act(async () => {
            userEvent.click(screen.getByTestId("unfollow-button"));
        });

        expect(axiosReq.delete).toHaveBeenCalledWith("/followers-pets/1");
        expect(setPetData).toHaveBeenCalledTimes(1);
        expect(setPetData).toHaveBeenCalledWith({
            pagePet: {
                results: [{ id: 1, followers_count: 9 }],
            },
            popularPets: { results: [] },
        });

        expect(axiosReq.patch).toHaveBeenCalledWith("/users/1/", {
            ...currentUser,
            following_count_pets: 0,
        });

        expect(axiosReq.get).toHaveBeenCalledWith("/pets/?ordering=-followers_count");
    });
});

// TestComponent is a sample component that uses the PetDataContext hooks
function TestComponent() {
    const petData = usePetData();
    const { handleFollow, handleUnfollow } = useSetPetData();
  
    if (!petData || !petData.pagePet || petData.pagePet.results.length === 0) {
      return null; // Or you can render a loading state
    }
  
    const followersCount = petData.pagePet.results[0].followers_count;
  
    return (
      <div>
        <div>{followersCount}</div>
        <button
          onClick={() => handleFollow(petData.pagePet.results[0])}
          data-testid="follow-button"
        >
          Follow
        </button>
        <button
          onClick={() => handleUnfollow(petData.pagePet.results[0])}
          data-testid="unfollow-button"
        >
          Unfollow
        </button>
      </div>
    );
  }
  

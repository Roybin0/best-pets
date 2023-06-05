import { render, screen, fireEvent, act, cleanup } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import NavBar from "../NavBar";
import { CurrentUserProvider } from "../../contexts/CurrentUserContext";

test('renders Navbar', () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );

    // screen.debug();

    const signInLink = screen.getByRole('link', {name: 'Sign In'})
    expect(signInLink).toBeInTheDocument();
});

test('renders link to the user profile for a logged in user', async () => {
    await act(async () => {
      render(
        <Router>
          <CurrentUserProvider>
            <NavBar />
          </CurrentUserProvider>
        </Router>
      );
    });
  
    const profileAvatar = await screen.getByText('Owner');
    expect(profileAvatar).toBeInTheDocument();
  
    // await act(async () => {
    //   fireEvent.click(profileAvatar); // Simulate clicking on the profile avatar
    // });
  
    // const profileLink = await screen.findByText('My Profile');
    // expect(profileLink).toBeInTheDocument();
  });

test('renders sign up/in links when logged out', async () => {
    render(
        <Router>
            <NavBar />
        </Router>
    );

    // const signOutLink = await screen.findByRole('link', {name: 'Sign Out'})
    // fireEvent.click(signOutLink)

    const signInLink = await screen.findByRole('link', {name: 'Sign In'});
    const signUpLink = await screen.findByRole('link', {name: 'Sign Up'});
    
    expect(signUpLink).toBeInTheDocument();
    expect(signInLink).toBeInTheDocument();
});
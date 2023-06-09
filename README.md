# Best Pets

## Introduction

Best Pets is a front-end React application designed to provide a fun and engaging experience for animal enthusiasts. Whether you're a proud pet owner or simply adore cute and cuddly creatures, Best Pets offers a vibrant community where you can share captivating tales, discover new furry friends, and connect with fellow pet enthusiasts from around the world.

The link to the live website can be found here: [Best Pets](https://bestpets.herokuapp.com/).

## Table of Contents

* [Agile Development](#agile-development)
    * [User Stories](#user-stories)
    * [Technologies Used](#technologies-used)
* [Components](#components)
* [Testing](#testing)
* [Errors & Bugs](#errors)
* [Unfixed Bugs](#unfixed-bugs)
* [Future Features](#future-features)
* [Validator Testing](#validator-testing)
* [Deployment](#deployment)
* [Credits](#credits)
* [Media](#media)
* [Acknowledgements](#acknowledgements)

## Agile Development

Agile methodology is focused on flexibility, collaboration, and rapid iteration. Its principles include working collaboratively with clients to understand their needs, breaking down work into small pieces that can be completed quickly, and being open to change throughout the development process.

This project was built following Agile development principles. I started by identifying the client's needs and breaking down the work into small, manageable pieces that could be completed in short iterations.

## User Stories

The following requirements were determined based on User Stories that can be found on our project board - [Best Pets](https://github.com/users/Roybin0/projects/6/views/1).

Please note this contains User Stories from the API interface too.

* Users need to be able to create an Owner and Pet profile(s) with the ability to edit or delete them in the future (Pet only).
* Users need to be able to share images and stories, as well as edit or delete them as needed.
* Users need the ability to like and unlike content.
* Users need the ability to comment and edit or delete their comments as needed.
* Users need to see the most recent content first to be kept fully up to date.

## Technologies Used

* React: JavaScript library for building the user interface.
* React Router: For handling routing within the app.
* Django Authentication: For user registration and authentication.
* ElephantSQL: Cloud-based SQL database for storing user profiles and content.
* Cloudinary: For storing and retrieving uploaded images.
* CSS & React-Bootstrap: Styling the app.


## Components

The application is composed of several reusable components that are used in different parts of the application. Here are the main features of the key components:

* Share Pet Tales & Images: Capture unforgettable moments with your pets and share their tales through captivating stories. Add vivid descriptions, heartwarming anecdotes, and showcase their adorable photos to melt the hearts of fellow pet lovers.
* Explore Pet Community: Immerse yourself in a vast and diverse pet community.
* Follow Favorite Pets & Owners: Show your appreciation for fellow pet owners by following their adorable pets. Stay updated with their latest tales, milestones, and adventures. Let the cute overload brighten your day as you scroll through a personalized feed tailored to your interests.
* Popular Pets and Owners: Discover the most popular pets and pet owners on Best Pets. From the cutest kittens to the most photogenic pups, explore the profiles of influential pets and their dedicated owners who have captured the hearts of the community.
* Connect with Like-Minded Pet Lovers: Engage in meaningful conversations with pet enthusiasts who share your passion. Exchange tips, discuss pet care, and swap heartwarming stories about your furry companions. Forge new friendships and create lasting connections in a community that celebrates the unconditional love of animals.

### Pic

* Description: The Pic component displays an image associated with a pet.
* Location: /pages/pics/Pic.js
* Reusability: This component is used in the Home and Liked components to display pictures.

### Pet

* Description: The Pet component represents a pet profile.
* Location: /pages/pets/Pet.js
* Reusability: This component is reused in different parts of the application, including the home page, search results, popular pets (when eligible), and owner profile page.

### Tale

* Description: The Tale component represents a pet tale.
* Location: /pages/tales/Tale.js
* Reusability: This component is used in the tales section of the application, displaying individual pet tales.

### PopularPets

* Description: The PopularPets component displays a list of popular pets.
* Location: /pages/pets/PopularPets.js
* Reusability: This component is used in the sidebar of the application's home, feed, pets, tales, and pics pages to showcase the most followed pets.

### PopularOwners

* Description: The PopularOwners component displays a list of popular pet owners.
* Location: /pages/owners/PopularOwners.js
* Reusability: This component is used in the sidebar of the application's home, feed, pets, tales, and pics pages to showcase the most followed pets.

## Folder Structure

The application follows a modular structure to organize the components. Here's an overview of the main folders:
* components: Contains reusable components used across the application.
* styles: Contains CSS files and modules for styling components.
* assets: Stores static assets such as images and icons.
* contexts: Houses context providers for sharing data between components.
* hooks: Includes custom hooks used throughout the application.
* api: Contains API configuration and utility functions for making HTTP requests.

Feel free to explore the source code for more details on each component and its usage.

## Testing

### Content testing

The website content has been thoroughly tested using multiple devices (laptop, phone, and tablets) on multiple browsers (Chrome, Safari, and Firefox).

* The links are navigating to the correct pages.
* Login and logout are successful.
* The sign-up page functions as expected.
* Form submit buttons are expected to send, update, or delete data from the database and are working as expected.
* Redirects are in place as expected.

### App & API testing

While some basic tests have been added for certain files, more extensive testing is needed to ensure reliability.

## Errors

* Nested dropdown links wouldn't collapse properly due to a custom hook. This was resolved by changing the nav link to a dropdown item.
* POST and PUT requests failed to multiple endpoints due to a missing trailing `/`.
* Implementation of the ability to follow pets caused some issues with back-end serialization - this was added after the database has been created.

## Unfixed bugs

* Some nested links on mobile are not collapsing unless the user clicks away from the menu.
* An infinite scroll for pets is missing from the Liked and Home pages.

## Future Features

* Easier way to find your own content - Must go through Profile to find "My" content.
* Ability to share externally.
* Responding directly to comments - nested comments would make it easier for users to have conversations.
* Pet of the week competitions based on the number of likes. Could also be extended to Pic or Tale of the week.

## Validator Testing

* HTML - tested using the W3 Nu HTML Checker with no unexpected errors found. See [report](https://validator.w3.org/nu/?doc=https%3A%2F%2Fbestpets.herokuapp.com%2F).
* CSS - tested using the W3C CSS Validation Service. Some small errors found with imported bootstrap components. See [report](https://jigsaw.w3.org/css-validator/validator?uri=https%3A%2F%2Fbestpets.herokuapp.com%2F&profile=css3svg&usermedium=all&warning=1&vextwarning=&lang=en).
* Mobile Friendly - the website passes Google's Mobile Friendly test. Results [here](https://search.google.com/test/mobile-friendly/result?id=EuEuMT4tFWmNLSrwels1xg).
* PageSpeed Insights - shows lower than expected performance due to the size of images. See [report](https://pagespeed.web.dev/analysis/https-bestpets-herokuapp-com/fg8c8f7efy?form_factor=desktop). Images are capped at 2mb, but this may need to be reviewed.

The lowest score is 52 for Best Practices. This is due to an incorrect image aspect ratio and image sizing that could be reduced. This has been noted for future updates.

## Deployment

This project was deployed to Heroku. To set up the development environment and run the application locally, follow these steps:

1. Clone the repository.
2. Install the necessary dependencies by running `npm install`.
3. Start the development server with `npm start`.
4. Open the application in your web browser at http://localhost:3000.

## Credits

Hooks, contexts, and utility functions have been adapted and inspired by Code Institute's [Moment's Tutorial](https://github.com/Code-Institute-Solutions/moments).

## Media

Images from iStock, Pexels, Unsplash, Getty Images, and my amazingly supportive friends.

## Acknowledgements

* Huge thanks are due to Charlotte for holding the fort.
* Another special mention to Carolann for keeping me sane and well-fed.
* My multiple triers and testers - I thank you from the bottom of my heart.

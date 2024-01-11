- Implement backend authentication:

    -> <strike>Create the necessary routes and controllers for user authentication. </strike>
    
    -> <strike>Use the 42 intra API to handle user sign-in. </strike>

- Display user profile:

    -> <strike>Once the user is signed in, retrieve their profile information from the backend.</strike> (use redux store)
  
    -> <strike> Design and implement the frontend component to display the user's profile. </strike>

- Build the chat frontend & backend: 

	-> Create a UI Friend List on Left Side with new and exisiting friends. | W.I.P

	-> Create a UI chat room to chat with other users.

	-> Create channel creation and edit UI

	-> Create a right side bar UI shows friend informations

	-> Create Channel management methods in backend (HTTP only)
  
    -> <strike> Implement the functionality to send and receive messages. </strike>

- Game:
    -> <strike> send/accept invite </strike>
- Notification
    -> <strike> use real data | backend </strike>

    ///////// CHAT /////

Backend Integration:

    You'll need backend logic to handle the challenge functionality.
    Endpoints to send and receive challenge requests between users.
    Database or storage to manage the challenge state and history.

Frontend Implementation:

    Create a UI for sending challenges. already set up a button for sending a challenge.
    Implement a mechanism to handle the state of the challenge request. This could involve using React state or a state management library (like Redux).
    When the "Challenge" button is clicked, trigger a function that sends a challenge request to the friend you're chatting with.

Handling Challenge Responses:

    After sending the challenge, you'll need to wait for a response.
    Implement a way to display the challenge request to the recipient. This might involve a notification or a separate UI component.
    Add functionality for the recipient to accept or refuse the challenge. This might include buttons or other UI elements for response actions.

Updating UI Based on Responses:

    Once a response is received (accept/refuse), update the UI accordingly. For instance, if the challenge is accepted, you might show a success message or start the challenge. If refused, handle the rejection gracefully.

Real-Time Updates:

    real-time updates, consider using WebSocket or a similar technology to notify users about incoming challenges or their responses without manual refreshing.

-- ## Issue Section:
    
    Issue-1 (Back-end && Axios): When a user logs in for the first time, everything works correctly. However, after logging in, changing user information, and logging out, attempting to log in again with the same credentials results in an error saying the username already exists.

    Tasks:

    Investigate where the createUser method is being called when a user logs in. It should only be called when creating a new user, not when logging in an existing user.
    Check the logic in the login method. If a user with the provided username exists, the method should authenticate the user and log them in, not attempt to create a new user.

    Issue-2 ( - && - ): ...
-----------------------------------------------

To-do list to guide you through deploying your app on Vercel and setting up a CI/CD pipeline with Jenkins:

1. **Vercel Deployment:**
   - [ ] Sign up for a Vercel account.
   - [ ] Connect your GitHub repository to Vercel.
   - [ ] Configure your Next.js app for deployment with Vercel (use either the CLI or the Vercel website).

2. **Configure Database Connections:**
   - [ ] Ensure that Vercel environment variables include the necessary PostgreSQL database connection details.
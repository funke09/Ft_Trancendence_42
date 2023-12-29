- Implement backend authentication:

    -> <strike>Create the necessary routes and controllers for user authentication. </strike>
    
    -> <strike>Use the 42 intra API to handle user sign-in. </strike>

- Display user profile:

    -> <strike>Once the user is signed in, retrieve their profile information from the backend.</strike> (use redux store)
  
    -> <strike> Design and implement the frontend component to display the user's profile. </strike>

- Build the chat frontend & backend: 

    -> Create the necessary components and UI elements for the chat feature. | loading...
  
    -> Implement the functionality to send and receive messages. | needed!!!

- Game:
    -> send/accept invite
    -> MatchMaking not working yet?!
- Notification
    -> use real data | backend

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